const { uuid } = require("uuidv4");
const { setCache, getCache } = require("../utils/cache");

const listBots = async () => {
  try {
    const botList = await getCache("bots");
    const orderList = await getCache("orders");

    if (!botList) return [];

    if (!orderList) return botList;

    const inProgressOrder = orderList.filter(
      (order) => order.status === "IN_PROGRESS"
    );

    if (!inProgressOrder.length) return botList;

    const bots = botList.map((bot) => {
      const order = inProgressOrder.find((order) => order.botId === bot.id);

      if (order) {
        return {
          id: bot.id,
          orderId: order.id,
        };
      }

      return {
        id: bot.id,
        orderId: null,
      };
    });

    return bots;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getAvailableBot = async () => {
  try {
    const botList = await getCache("bots");
    const orderList = await getCache("orders");

    if (!botList) return null;
    if (!orderList) return botList[0];

    const inProgressOrder = orderList.filter(
      (order) => order.status === "IN_PROGRESS"
    );

    if (!inProgressOrder.length) return botList[0];

    const busyBot = new Set();

    for (let order of inProgressOrder) {
      busyBot.add(order.botId);
    }

    for (let bot of botList) {
      if (!busyBot.has(bot.id)) return bot;
    }

    return null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const addBot = async () => {
  try {
    let botList = await getCache("bots");

    const botData = {
      id: uuid(),
    };

    if (!botList) botList = [botData];
    else botList.push(botData);

    await setCache("bots", botList);

    return botData;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const removeBot = async (botId) => {
  try {
    const botList = await getCache("bots");

    const newBotList = botList.filter((bot) => bot.id !== botId);

    await setCache("bots", newBotList);

    return newBotList;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { getAvailableBot, addBot, removeBot, listBots };
