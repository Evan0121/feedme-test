const { Router } = require("express");
const {
  removeBot,
  addBot,
  listBots,
  getAvailableBot,
} = require("../service/bot.js");
const { unprocessOrder, processOrder } = require("../service/order.js");
const { getCache } = require("../utils/cache.js");

const router = Router();

router.get("/list", async (req, res) => {
  try {
    const result = await listBots();

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const bot = await addBot();

    const order = await processOrder(bot.id);

    res.json({
      id: bot.id,
      orderId: order ? order.id : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/remove", async (req, res) => {
  try {
    const { botId } = req.body;

    await removeBot(botId);

    await unprocessOrder(botId);

    const availableBot = await getAvailableBot();

    if (availableBot) {
      await processOrder(availableBot.id);
    }

    const newBots = await listBots();
    const newOrders = await getCache("orders");

    res.json({
      bots: newBots,
      orders: newOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
