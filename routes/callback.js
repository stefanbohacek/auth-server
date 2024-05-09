import express from "express";
import queryString from "query-string";
import rejectRequest from "../modules/rejectRequest.js";
import getNodeInfo from "../modules/getNodeInfo.js";
import { getApp as getOAuthApp } from "../modules/auth/oauth.js";
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
  let { platform, method, instance, scope, code, session } = req.query;
  let appName = req.query.app;

  if (req.query && req.query.options) {
    try {
      const optionsJSON = JSON.parse(req.query.options);
      ({ method, instance, code, scope } = optionsJSON);
      appName = optionsJSON.app;
    } catch (err) {
      console.log("callback route error", err);
    }
  } else {
    method = req.query.method;
  }

  if (!platform) {
    const nodeInfo = await getNodeInfo(instance);
    platform = nodeInfo?.software?.name;
  }

  /*
  req.query.method
  req.query.instance
  req.query.code
*/
  let formData = new URLSearchParams();

  switch (method) {
    case "oauth":
    case "mastodon":
      let internalRedirectURIparams = {
        method,
        scope: scope.split("+").join(" "),
      };

      getOAuthApp(req, res).then(async (app) => {
        internalRedirectURIparams.instance = instance;
        internalRedirectURIparams.app = req.query.app;
        formData.append("grant_type", "authorization_code");
        formData.append("code", code);
        formData.append("client_id", app.client_id);
        formData.append("client_secret", app.client_secret);
        formData.append(
          "redirect_uri",
          `${
            process.env.ENVIRONMENT === "production" ? "https" : req.protocol
          }://${req.get("host")}/callback?${queryString.stringify(
            internalRedirectURIparams
          )}`
        );
        formData.append("scope", scope);

        const resp = await fetch(`https://${instance}/oauth/token`, {
          method: "POST",
          body: formData,
        });

        try {
          const results = await resp.json();
          let myApp = getApp(appName, {
            instance,
            platform,
            access_token: results.access_token,
          });
          handleAppCallback(myApp, results.access_token, req, res);
        } catch (err) {
          console.log("access_token_error", err);
          // const results = await resp.text()
          rejectRequest(req, res, 422);
        }
      });
      break;
    case "miauth":
      const url = `https://${instance}/api/miauth/${session}/check`;
      const resp = await fetch(url, {
        method: "POST",
      });

      const results = await resp.json();
      // console.log({results});
      // console.log({url, token: results.token});

      let myApp = getApp(appName, {
        instance,
        platform,
        access_token: results.token,
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
