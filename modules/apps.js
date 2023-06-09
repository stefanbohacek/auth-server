const getApps = (appName, options) => {
  options = options || {};
  const myApps = {
    "mastodon-browser-tools": {
      "name": "Stefan's Mastodon Tools Browser Extension",
      "showToken": true
    },
    "mastodon-dataviz": {
      "name": "Stefan's Dataviz App",
      "redirect_url": `https://data.stefanbohacek.dev/projects/fediverse?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `https://data.stefanbohacek.dev/projects/fediverse`
    },
    "mastodon-dataviz-local": {
      "name": "Stefan's Dataviz App (LOCAL TEST)",
      "redirect_url": `http://localhost:5025/projects/fediverse?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `http://localhost:5025/projects/fediverse`
    },
    "creator-and-the-machine": {
      "name": "Curator and the machine",
      "redirect_url": `https://curator-and-the-machine.glitch.me/app?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `https://curator-and-the-machine.glitch.me/app`
    }
  };

  if (myApps[appName]){
    return myApps[appName];
  } else {
    return {
      "name": "Stefan's Test App",
      "showToken": true
    }
  }
}

const getAppName = (app) => {
  const myApp = getApps(app);
  return myApp.name;
}

const getFailRedirectURL = (app) => {
  const myApp = getApps(app);
  return myApp.redirect_url_fail;
}

export {getAppName, getFailRedirectURL, getApps};
