const getApps = (appName, options) => {
  options = options || {};
  const myApps = {
    "mastodon-browser-tools": {
      "name": "Stefan's Mastodon Tools Browser Extension",
      "showToken": true
    },
    "mastodon-dataviz": {
      "name": "Stefan's Dataviz App",
      "redirect_url": `https://data.stefanbohacek.dev/projects/fediverse?instance=${options.instance}&token=${options.access_token}`
    },
    "mastodon-dataviz-local": {
      "name": "Stefan's Dataviz App (LOCAL TEST)",
      "redirect_url": `http://localhost:5025/projects/fediverse?instance=${options.instance}&token=${options.access_token}`
    },
    "creator-and-the-machine": {
      "name": "Creator and the machine",
      "redirect_url": `https://curator-v2.glitch.me/app/?token=${options.access_token}`
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

export {getAppName, getApps};
