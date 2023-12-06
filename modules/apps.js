const getApps = (appName, options) => {
  options = options || {};
  const myApps = {
    "localhost-3000": {
      "name": "LOCAL TEST",
      "redirect_url": `http://localhost:3000?instance=${options.instance}&platform=${options.platform}&token=${options.access_token}`,
      "redirect_url_fail": `http://localhost:3000?error=login`
    },
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
    "fediverse-hashtags": {
      "name": "Stefan's Dataviz App #2: Hashtags",
      "redirect_url": `https://data.stefanbohacek.dev/projects/fediverse-hashtags?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `https://data.stefanbohacek.dev/projects/fediverse-hashtags`
    },
    "fediverse-hashtags-local": {
      "name": "Stefan's Dataviz App #2: Hashtags (LOCAL TEST)",
      "redirect_url": `http://localhost:5025/projects/fediverse-hashtags?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `http://localhost:5025/projects/fediverse-hashtags`
    },
    "fediverse-post-accessibility": {
      "name": "Stefan's Dataviz App #3: Post Accessibility",
      "redirect_url": `https://data.stefanbohacek.dev/projects/fediverse-post-accessibility?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `https://data.stefanbohacek.dev/projects/fediverse-post-accessibility`
    },
    "fediverse-post-accessibility-local": {
      "name": "Stefan's Dataviz App #3: Post Accessibility (LOCAL TEST)",
      "redirect_url": `http://localhost:5025/projects/fediverse-post-accessibility?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `http://localhost:5025/projects/fediverse-post-accessibility`
    },
    "fediverse-emoji": {
      "name": "Stefan's Dataviz App #2: Emoji",
      "redirect_url": `https://data.stefanbohacek.dev/projects/fediverse-emoji?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `https://data.stefanbohacek.dev/projects/fediverse-emoji`
    },
    "fediverse-emoji-local": {
      "name": "Stefan's Dataviz App #2: Emoji (LOCAL TEST)",
      "redirect_url": `http://localhost:5025/projects/fediverse-emoji?instance=${options.instance}&token=${options.access_token}`,
      "redirect_url_fail": `http://localhost:5025/projects/fediverse-emoji`
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
