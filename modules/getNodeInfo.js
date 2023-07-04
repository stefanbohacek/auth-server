import NodeCache from 'node-cache';
const appCache = new NodeCache( { stdTTL: 100, checkperiod: 60 } );

const getNodeInfo = async (domain, full) => {
  let nodeInfoURL, nodeInfo = {
    domain
  };

  const cacheKey = `nodeinfo:${domain}${full ? ':full' : ''}`;
  const cachedData = appCache.get(cacheKey);

  if (cachedData == undefined){
    try{
      const resp = await fetch(`https://${domain}/.well-known/nodeinfo`);
      let results = await resp.json();
    
      if (results.links){
        results.links.forEach(link => {
          if (link.rel.includes('nodeinfo.diaspora.software/ns/schema')){
            nodeInfoURL = link.href;
          }
        });
      }

      if (nodeInfoURL){
        const resp = await fetch(nodeInfoURL);
        let results = await resp.json();
  
        if (full){
          nodeInfo.nodeInfo = results;
        } else {
          nodeInfo.software = {
            name: results?.software?.name,
            version: results?.software?.version,
          }
        }
      }        
      const success = appCache.set(cacheKey, nodeInfo);
    } catch(err){
      console.log('node-info error', err);
    }


  } else {
    nodeInfo = cachedData;
  }

  return nodeInfo;
};

export default getNodeInfo;
