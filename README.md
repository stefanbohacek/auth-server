# Authentication server

This project is currently under active development. The authentication server currently supports:

- OAuth; tested with:
    - Mastodon
    - Friendica
    - Pleroma and Akkoma
- MiAuth; tested with Misskey and Calckey

## How to use

Redirect your user to your authentication server while passing the following variables:

- `method`: oauth or miauth
- `instance`: domain name of the server your user needs to authenticate with (eg. mastodon.social)
- `scope`: required scopes (eg: `scope=read:accounts+read:follows`)
- `app`: id of your app the user will be redirected to (see `apps.js`)

Example URL for fediverse platforms that support OAuth:

```
https://authserver.com/?method=oauth&instance=mastodon.social&scope=read:accounts+read:follows&app=myapp
```

Example URL for fediverse platforms that use MiAuth:

```
https://authserver.com/?method=miauth&instance=calckey.social&scope=read:account+read:following&app=myapp
```

## Development

1. Install dependencies with `npm install`.
2. Rename `.env-copy` to `.env` and update the contents of this file.

```
ENCRYPTION_KEY="random text here to be used as your encryption key"
```

3. Update `apps.json`.

You can either redirect the user to your app that requires an authentication token:

```js
"my-app-1": {
    "name": "This is my app #1",
    "redirect_url": `https://myapp1.com/?instance=${options.instance}&token=${options.access_token}`
}
```

Or you can display the token in the browser for the user to copy:

```js
"my-app-2": {
    "name": "This is my app #2",
    "showToken": true
}
```

4. Run the authentication server locally:

```sh
npm run dev
```