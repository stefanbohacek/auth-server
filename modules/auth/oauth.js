import DB from "better-sqlite3-helper";
import queryString from "query-string";
import crypto from "crypto";
import isValidServer from "../isValidServer.js";
import rejectRequest from "../rejectRequest.js";
import { decrypt, encrypt } from "../encryption.js";
import { getAppName } from "../apps.js";

const getRedirectURI = (req) => {
  return `${process.env.ENVIRONMENT === "production" ? "https" : req.protocol}://${req.get("host")}/callback`;
};

const getApp = async (req, res, decrypted) => {
  const instance = req.query.instance;
  const appName = req.query.app;
  const environment = req.query.environment || "production";

  let app = DB().queryFirstRow(
    "SELECT * FROM oauth_apps WHERE instance=? AND app=? AND environment=?",
    instance,
    appName,
    environment,
  );

  if (!app) {
    app = await createApp(req, res);
  } else {
    // console.log({ loaded_app_from_DB: app });
  }

  if (decrypted) {
    app["appName"] = appName;
    app["client_secret"] = decrypt(app["client_secret"]);
  }

  return app;
};

const createApp = async (req, res) => {
  const instance = req.query.instance;

  if (!isValidServer(instance)) {
    rejectRequest(req, res, 422);
    return;
  }

  const appName = req.query.app;
  const environment = req.query.environment || "production";
  const redirectURI = getRedirectURI(req);
  let formData = new URLSearchParams();

  formData.append("client_name", getAppName(req.query.app));
  formData.append("redirect_uris", redirectURI);
  formData.append("scopes", req.query.scope.split("+").join(" "));

  const resp = await fetch(`https://${instance}/api/v1/apps`, {
    method: "POST",
    body: formData,
  });

  let results = {};

  try {
    if (!resp.ok) {
      throw new Error(`App registration failed: ${resp.status}`);
    }
    results = await resp.json();

    DB().insert("oauth_apps", {
      app: appName,
      environment: environment,
      instance: instance,
      id: results.id,
      client_id: results.client_id,
      client_secret: encrypt(results.client_secret),
      vapid_key: results.vapid_key,
    });
  } catch (err) {
    results = await resp.text();
  }
  return results;
};

const saveState = (req) => {
  const state = crypto.randomUUID();
  DB().insert("oauth_state", {
    state,
    app: req.query.app,
    instance: req.query.instance,
    environment: req.query.environment || "production",
    scope: req.query.scope,
    method: req.query.method,
  });
  return state;
};

const authenticate = async (req, res) => {
  if (req.query.scope && req.query.instance) {
    getApp(req, res)
      .then((app) => {
        const redirectURI = getRedirectURI(req);
        const state = saveState(req);

        const url = `https://${req.query.instance}/oauth/authorize?${queryString.stringify(
          {
            client_id: app.client_id,
            response_type: "code",
            scope: req.query.scope,
            redirect_uri: redirectURI,
            state,
          },
        )}`;

        res.redirect(url);
      })
      .catch((err) => {
        console.log("authenticate error", { err });
        rejectRequest(req, res, 500);
      });
  } else {
    rejectRequest(req, res, 422);
  }
};

export { authenticate, getApp, getRedirectURI };
