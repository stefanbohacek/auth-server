# Authentication server

This project is currently under active development an is intended to be self-hosted. The authentication server currently supports:

- OAuth; tested with:
    - Mastodon
    - Friendica
    - Pleroma and Akkoma
- MiAuth; tested with Misskey and Calckey

<!--
One option is [importing it to Glitch](https://glitch.com/edit/#!/import/github/stefanbohacek/auth-server). ([Learn more about Glitch.](https://glitch.com/about))
-->

## How to use

Redirect your user to your authentication server while passing the following variables:

- `method`: `fediverse` (or you can use `oauth` or `miauth` directly)
- `instance`: domain name of the server your user needs to authenticate with (eg. mastodon.social)
- `scope`: required scopes (eg: `scope=read:accounts+read:follows`)
- `app`: id of your app the user will be redirected to (see `modules/apps.js`)

Example URL:

```
https://authserver.com/?method=fediverse&instance=mastodon.social&scope=read:accounts+read:follows&app=myapp
```

Example URL for fediverse platforms that support OAuth:

```
https://authserver.com/?method=oauth&instance=mastodon.social&scope=read:accounts+read:follows&app=myapp
```

Example URL for fediverse platforms that use MiAuth:

```
https://authserver.com/?method=miauth&instance=calckey.social&scope=read:account+read:following&app=myapp
```

Your users will be redirect to the app's `redirect_url` (from `modules/apps.js`) with the `instance`
 and `token` parameters passed in the URL.

```
https://myapp.com?instance=mastodon.social&token=ABCDE12345
```

If you're using the automatic `fediverse` method and an error occurs, the user will be instead redirected to `redirect_url_fail` and an `error` parameter will be passed.

Here's an example for when an instance that uses an unsuported fediverse platform is passed:

```
https://myapp.com?error=platform_not_supported
```
## Development

1. Install dependencies with `npm install`.
2. Rename `.env-copy` to `.env` and update the contents of this file.

```
ENCRYPTION_KEY="random text here to be used as your encryption key"
```

3. Update `modules/apps.js`.

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