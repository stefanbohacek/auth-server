import DB from 'better-sqlite3-helper';
import queryString from 'query-string';
import rejectRequest from '../rejectRequest.js';
import { decrypt, encrypt } from '../encryption.js';
import { getAppName } from '../apps.js';

const getRedirectURI = (req, res) => {
  return `${process.env.ENVIRONMENT === 'production' ? 'https' : req.protocol}://${req.get('host')}/callback?${queryString.stringify(getInternalRedirectURIparams(req, res))}`;  
}

const getInternalRedirectURIparams = (req, res) => {
  const internalRedirectURIparams = {
    method: req.query.method,
    app: req.query.app,
    scope: req.query.scope.split('+').join(' '),
    instance: req.query.instance
  };

  return internalRedirectURIparams;
}

const getApp = async (req, res, decrypted) => {
  const instance = req.query.instance;
  const appName = req.query.app;

  let app = DB().queryFirstRow(
    'SELECT * FROM oauth_apps WHERE instance=? AND app=?',
    instance,
    appName
  );

  if (!app){
    app = await createApp(req, res);
  } else {
    console.log({'loaded_app_from_DB': app});
  }
  
  if (decrypted) {
    app['appName'] = appName;
    app['client_secret'] = decrypt(app['client_secret']);
  }
  
  return app;
}

const createApp = async (req, res) => {
  const appName = req.query.app;
  const instance = req.query.instance;
  const method = req.query.method;

  const redirectURI = getRedirectURI(req, res).replace('method=fediverse', `method=${method}`);
  const internalRedirectURIparams = getInternalRedirectURIparams(req, res);
  let formData = new URLSearchParams();

  formData.append('client_name', getAppName(req.query.app));
  formData.append('redirect_uris', redirectURI);
  formData.append('scopes', 'read:accounts read:follows');
  // formData.append('website', '');

  const resp = await fetch(`https://${instance}/api/v1/apps`, {
    method: 'POST',
    body: formData
  });

  let results = {};

  try{
    results = await resp.json();
    console.log({'created_new_app' : {results}});
    console.log('saving app to DB...');

    DB().insert('oauth_apps', {
      app: appName,
      instance: instance,
      id: results.id,
      client_id: results.client_id,
      client_secret: results.client_secret,
      vapid_key: results.vapid_key,
    });
  } catch (err){
    console.log('createApp:error', {err});
    console.log('debug:resp', resp);
    results = await resp.text()
    console.log('createApp:results', {results});
  }        
  return results;  
}

const authenticate = async (req, res) => {
  const internalRedirectURIparams = getInternalRedirectURIparams(req, res);
  let params = {};

  if (req.query.scope && req.query.instance){
    getApp(req, res).then(app => {
      params.scope = req.query.scope;
      params.response_type = 'code';
      params.instance = req.query.instance;
      params.client_id = app.client_id;
      const redirectURI = getRedirectURI(req, res);
      // params.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';
      params.redirect_uri = redirectURI;
  
      const url = `https://${req.query.instance}/oauth/authorize?${queryString.stringify(params)}`;
      console.log({
        'authenticate': {
          params,
          url
        }
      });
      res.redirect(url);
      return true;
    });
  } else {
    rejectRequest(req, res, 422);
    return false;
  }  
};

export {authenticate, getApp};
