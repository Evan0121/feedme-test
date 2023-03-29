const nodeCache = require("node-cache");

const cache = new nodeCache();

const setCache = async (key, value) => {
  try {
    return cache.set(key, value);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getCache = async (key) => {
  try {
    return cache.get(key);
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { setCache, getCache };
