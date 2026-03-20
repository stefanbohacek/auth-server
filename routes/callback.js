import express from "express";
import DB from "better-sqlite3-helper";
import rejectRequest from "../modules/rejectRequest.js";
import getNodeInfo from "../modules/getNodeInfo.js";
import {
  getApp as getOAuthApp,
  getRedirectURI,
} from "../modules/auth/oauth.js";
import { getApps as getApp } from "../modules/apps.js";

const router = express.Router();

const handleAppCallback = (app, token, req, res) => {
  if (app.redirect_url) {
    res.redirect(app.redirect_url);
  } else if (app.showToken) {
    res.send(token);
  } else {
    rejectRequest(req, res, 422);
  }
};

router.get("/", async (req, res) => {
  let { code, state, session } = req.query;
  let appName, method, instance, environment, scope, platform;

  if (req.query.options) {
    try {
      const optionsJSON = JSON.parse(req.query.options);
      method = optionsJSON.method;
      instance = optionsJSON.instance;
      appName = optionsJSON.app;
      environment = optionsJSON.environment || "production";
    } catch (err) {
      console.log("callback error", err);
      rejectRequest(req, res, 422);
      return;
    }
  } else {
    const savedState = DB().queryFirstRow(
      "SELECT * FROM oauth_state WHERE state=?",
      state,
    );

    if (!savedState) {
      rejectRequest(req, res, 422);
      return;
    }

    DB().delete("oauth_state", { state });

    method = savedState.method;
    instance = savedState.instance;
    appName = savedState.app;
    environment = savedState.environment;
    scope = savedState.scope;
  }

  req.query.app = appName;
  req.query.instance = instance;
  req.query.environment = environment;
  req.query.scope = scope;
  req.query.method = method;

  const nodeInfo = await getNodeInfo(instance);
  platform = nodeInfo?.software?.name;

  let formData = new URLSearchParams();

  switch (method) {
    case "oauth":
    case "mastodon":
      getOAuthApp(req, res, true).then(async (app) => {
        formData.append("grant_type", "authorization_code");
        formData.append("code", code);
        formData.append("client_id", app.client_id);
        formData.append("client_secret", app.client_secret);
        formData.append("redirect_uri", getRedirectURI(req));
        formData.append("scope", scope);

        const resp = await fetch(`https://${instance}/oauth/token`, {
          method: "POST",
          body: formData,
        });

        try {
          const results = await resp.json();
          const myApp = getApp(appName, {
            instance,
            platform,
            environment,
            access_token: results.access_token,
          });
          handleAppCallback(myApp, results.access_token, req, res);
        } catch (err) {
          console.log("access_token error", err);
          rejectRequest(req, res, 422);
        }
      });
      break;
    case "miauth":
      const url = `https://${instance}/api/miauth/${session}/check`;
      const resp = await fetch(url, { method: "POST" });

      console.log("miauth debug: resp.status:", resp.status);
      console.log("miauth debug: resp.url:", resp.url);
      const respText = await resp.text();
      // console.log("miauth debug: respText:", respText.substring(0, 200));

      if (!resp.ok) {
        console.log(`miauth debug: login failed: ${resp.status}`);

        const myApp = getApp(appName, { instance, platform, environment });
        if (myApp.redirect_url_fail) {
          res.redirect(`${myApp.redirect_url_fail}?error=server_blocked`);
        } else {
          rejectRequest(req, res, 422);
        }

        break;
      }

      const results = await resp.json();

      const myApp = getApp(appName, {
        instance,
        platform,
        access_token: results.token,
        environment,
      });

      myApp.redirect_url += `&username=${results?.user?.username}&userid=${results?.user?.id}&avatarUrl=${results?.user?.avatarUrl}`;
      handleAppCallback(myApp, results.token, req, res, results);
      break;
    default:
      rejectRequest(req, res, 422);
      break;
  }
});

export default router;
