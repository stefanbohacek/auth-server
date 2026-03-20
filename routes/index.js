import express from "express";
import DB from "better-sqlite3-helper";
import rejectRequest from "../modules/rejectRequest.js";
import getFediverseMethod from "../modules/getFediverseMethod.js";
import getNodeInfo from "../modules/getNodeInfo.js";
import { getFailRedirectURL } from "../modules/apps.js";
import { authenticate as oAuth } from "../modules/auth/oauth.js";
import { authenticate as miAuth } from "../modules/auth/miauth.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

DB({
  path: "data/database.db",
  readonly: false,
  fileMustExist: false,
  WAL: true,
  migrate: {
    force: false,
    table: "migration",
    migrationsPath: __dirname + "/../migrations",
  },
});

const normalizeScopes = (scope, platform) => {
  if (platform === "friendica") {
    const baseScopes = [
      ...new Set(scope.split(" ").map((s) => s.split(":")[0])),
    ];
    return baseScopes.join(" ");
  }
  return scope;
};

const router = express.Router();

router.get("/", async (req, res) => {
  let { method, instance } = req.query;

  if (method) {
    if (method === "fediverse") {
      const { method: fediverseMethod, platform } =
        await getFediverseMethod(instance);
      if (fediverseMethod === "not_supported") {
        const redirectURL = getFailRedirectURL(req.query.app);
        res.redirect(`${redirectURL}?error=platform_not_supported`);
        return;
      }
      req.query.method = fediverseMethod;
      req.query.scope = normalizeScopes(req.query.scope, platform);
      method = fediverseMethod;
    } else if (method === "oauth") {
      const nodeInfo = await getNodeInfo(instance);
      const platform = nodeInfo?.software?.name;
      req.query.scope = normalizeScopes(req.query.scope, platform);
    }

    switch (method) {
      case "oauth":
      case "mastodon":
        if (instance) {
          await oAuth(req, res);
        } else {
          rejectRequest(req, res, 422);
        }
        break;
      case "miauth":
        if (instance) {
          miAuth(req, res);
        } else {
          rejectRequest(req, res, 422);
        }
        break;
      default:
        rejectRequest(req, res, 422);
    }
  } else {
    rejectRequest(req, res, 422);
  }
});

export default router;
