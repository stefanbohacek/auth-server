import express from 'express';
import DB from 'better-sqlite3-helper';
import rejectRequest from '../modules/rejectRequest.js';
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
  if (req.query.method){
    switch (req.query.method) {
      case 'oauth':
      case 'mastodon':
        if (req.query.instance){
          const results = await oAuth(req, res);
        } else {
          canProceed = false;
        }
        break;
      case 'miauth':
        if (req.query.instance){
          miAuth(req, res);
        } else {
          canProceed = false;
        }
    }
  } else {
    rejectRequest(req, res, 422);
  }
});

export default router;