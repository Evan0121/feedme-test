const { Router } = require("express");
const { getAvailableBot } = require("../service/bot.js");
const { addOrder, processOrder } = require("../service/order.js");
const { getCache } = require("../utils/cache.js");

const router = Router();

router.get("/list", async (req, res) => {
  try {
    let orderList = await getCache("orders");

    if (!orderList) orderList = [];

    res.json(orderList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { vip } = req.body;

    let order = await addOrder(vip);

    const availableBot = await getAvailableBot();

    if (availableBot) {
      order = await processOrder(availableBot.id);
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
