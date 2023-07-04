import express from 'express';
import DB from 'better-sqlite3-helper';
import rejectRequest from '../modules/rejectRequest.js';
import getFediverseMethod from '../modules/getFediverseMethod.js';
import { getFailRedirectURL } from '../modules/apps.js';
import { authenticate as oAuth } from '../modules/auth/oauth.js';
import { authenticate as miAuth } from '../modules/auth/miauth.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

const router = express.Router();

router.get('/', async (req, res) => {
  let {method, instance} = req.query;

  if (method){
    if (method === 'fediverse'){
      const fediverseMethod = await getFediverseMethod(instance);
      if (fediverseMethod === 'not_supported'){
        const redirectURL = getFailRedirectURL(req.query.app);
        res.redirect(`${redirectURL}?error=platform_not_supported`);
      } else {
        method = fediverseMethod;
      }
    }

    switch (method) {
      case 'oauth':
      case 'mastodon':
        if (instance){
          const results = await oAuth(req, res);
        } else {
          canProceed = false;
        }
        break;
      case 'miauth':
        if (instance){
          miAuth(req, res);
        } else {
          canProceed = false;
        }
        break;
    }
  } else {
    rejectRequest(req, res, 422);
  }
});

export default router;