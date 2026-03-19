export default (server) => {
  try {
    const url = new URL(`https://${server}`);
    return url.hostname === server;
  } catch {
    return false;
  }
};
