-- Up
CREATE TABLE `oauth_state` (
  state TEXT PRIMARY KEY NOT NULL,
  app TEXT,
  instance TEXT,
  environment TEXT,
  scope TEXT,
  method TEXT,
  session TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Down
DROP TABLE IF EXISTS `oauth_state`;