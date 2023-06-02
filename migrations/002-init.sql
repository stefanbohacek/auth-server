-- Up
CREATE TABLE `oauth_apps` (
  instance TEXT,
  app TEXT,
  id INTEGER,
  client_id TEXT,
  client_secret TEXT,
  vapid_key TEXT,
  working INTEGER,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Down
DROP TABLE IF EXISTS `oauth_apps`;
