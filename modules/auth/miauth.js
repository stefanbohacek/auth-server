import queryString from 'query-string';
import url from 'url';
import { generateApiKey } from 'generate-api-key';
import rejectRequest from '../rejectRequest.js';
import { getAppName } from '../apps.js';

const authenticate = async (req, res) => {
  // const callbackServer = 'https://auth.stefanbohacek.com';
  // const callbackServer = 'http://localhost:3000';

  const hostname = req.headers.host;
  const pathname = url.parse(req.url).pathname;
  const callbackServer = `https://${hostname}${pathname}`;
  
  console.log(callbackServer);

  if (req.query.scope && req.query.instance){
    const appID = generateApiKey({
      method: 'string',
      pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
    });

    const appName = getAppName(req.query.app);
    const options = {
      method:'miauth',
      instance: req.query.instance,
      app: req.query.app
    };

    const callbackURL = `${callbackServer}callback?options=${JSON.stringify(options)}`;

    let permissionsMapped = req.query.scope.replace("read:accounts", "read:account").replace("profile", "read:account");

    const url = `https://${req.query.instance}/miauth/${appID}?name=${encodeURIComponent(appName)}&permission=${permissionsMapped.split(' ').join(',')}&callback=${callbackURL}`;
    res.redirect(url);
  } else {
    rejectRequest(req, res, 422);
    return false;
  }  
};

export {authenticate};
