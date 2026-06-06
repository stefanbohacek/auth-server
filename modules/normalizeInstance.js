export default (instance) => {
  if (instance) {
    instance = instance.trim();
    instance = instance.replace(/^https?:\/\//i, "");

    if (instance.includes("@")) {
      instance = instance.split("@").pop();
    }

    instance = instance.replace(/\/.*$/, "");
    instance = instance.trim().toLowerCase();
  }

  return instance;
};
