const getApps = (appName, options) => {
  options = options || {};
  const myApps = {
    testapp: {
      production: {},
      development: {
        name: "LOCAL TEST",
        redirect_url: `http://localhost:3000?instance=${options.instance}&platform=${options.platform}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:3000?error=login`,
      },
    },
    "mastodon-browser-tools": {
      production: {
        name: "Stefan's Mastodon Tools Browser Extension",
        showToken: true,
      },
      development: {},
    },
    "mastodon-dataviz": {
      production: {
        name: "Stefan's Dataviz App",
        redirect_url: `https://data.stefanbohacek.com/projects/fediverse?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://data.stefanbohacek.com/projects/fediverse`,
      },
      development: {
        name: "Stefan's Dataviz App (LOCAL TEST)",
        redirect_url: `http://localhost:5025/projects/fediverse?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:5025/projects/fediverse`,
      },
    },
    "fediverse-hashtags": {
      production: {
        name: "Stefan's Dataviz App #2: Hashtags",
        redirect_url: `https://data.stefanbohacek.com/projects/fediverse-hashtags?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://data.stefanbohacek.com/projects/fediverse-hashtags`,
      },
      development: {
        name: "Stefan's Dataviz App #2: Hashtags (LOCAL TEST)",
        redirect_url: `http://localhost:5025/projects/fediverse-hashtags?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:5025/projects/fediverse-hashtags`,
      },
    },
    "fediverse-post-accessibility": {
      production: {
        name: "Stefan's Dataviz App #3: Post Accessibility",
        redirect_url: `https://data.stefanbohacek.com/projects/fediverse-post-accessibility?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://data.stefanbohacek.com/projects/fediverse-post-accessibility`,
      },
      development: {
        name: "Stefan's Dataviz App #3: Post Accessibility (LOCAL TEST)",
        redirect_url: `http://localhost:5025/projects/fediverse-post-accessibility?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:5025/projects/fediverse-post-accessibility`,
      },
    },
    "fediverse-emoji": {
      production: {
        name: "Stefan's Dataviz App #4: Emoji",
        redirect_url: `https://data.stefanbohacek.com/projects/fediverse-emoji?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://data.stefanbohacek.com/projects/fediverse-emoji`,
      },
      development: {
        name: "Stefan's Dataviz App #4: Emoji (LOCAL TEST)",
        redirect_url: `http://localhost:5025/projects/fediverse-emoji?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:5025/projects/fediverse-emoji`,
      },
    },
    "fediverse-follows": {
      production: {
        name: "Stefan's Dataviz App #5: Fediverse Follows",
        redirect_url: `https://data.stefanbohacek.com/projects/fediverse-follows?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://data.stefanbohacek.com/projects/fediverse-follows`,
      },
      development: {
        name: "Stefan's Dataviz App #5: Fediverse Follows (LOCAL TEST)",
        redirect_url: `http://localhost:5025/projects/fediverse-follows?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:5025/projects/fediverse-follows`,
      },
    },
    "pinned-posts": {
      production: {
        name: "Stefan's Pinned Posts Organizer",
        redirect_url: `https://pinned-posts-organizer.stefanbohacek.com/?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://pinned-posts-organizer.stefanbohacek.com/error`,
      },
      development: {
        name: "Stefan's Pinned Posts Organizer (LOCAL TEST)",
        redirect_url: `http://localhost:8080/?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:8080/error`,
      },
    },
    "creator-and-the-machine": {
      production: {
        name: "Curator and the machine",
        redirect_url: `https://curator-and-the-machine.stefanbohacek.com/app?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://curator-and-the-machine.stefanbohacek.com/app`,
      },
      development: {},
    },
    "signatures": {
      production: {
        name: "Fediverse Signatures",
        redirect_url: `https://signatures.stefanbohacek.com/signatures?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `https://signatures.stefanbohacek.com/error`,
      },
      development: {
        name: "Fediverse Signatures (LOCAL TEST)",
        redirect_url: `http://localhost:3000/signatures?instance=${options.instance}&token=${options.access_token}`,
        redirect_url_fail: `http://localhost:3000/error`,
      },
    },
  };

  if (myApps[appName]) {
    return myApps[appName][
      options.environment ? options.environment : "production"
    ];
  } else {
    return {
      name: "Stefan's Test App",
      showToken: true,
    };
  }
};

const getAppName = (app) => {
  const myApp = getApps(app);
  return myApp.name;
};

const getFailRedirectURL = (app) => {
  const myApp = getApps(app);
  return myApp.redirect_url_fail;
};

export { getAppName, getFailRedirectURL, getApps };
