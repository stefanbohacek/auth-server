import getNodeInfo from './getNodeInfo.js';

const getFediverseMethod = async (domain) => {
  let method = 'not_supported';
  const nodeInfo = await getNodeInfo(domain);
  const platform = nodeInfo?.software?.name;

  switch (platform) {
    case "mastodon":
    case "hometown":
    case "friendica":
    case "pleroma":
    case "akkoma":
    case "gotosocial":
      method = 'oauth';
      break;
    case "misskey":
    case "calckey":
    case "firefish":
    case "foundkey":
    case "magnetar":
      method = 'miauth';
      break;
  }
  return method;
};

export default getFediverseMethod;
