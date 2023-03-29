const { Router } = require("express");
const healthcheck = require("./controller/healthcheck.js");
const order = require("./controller/order.js");
const bot = require("./controller/bot.js");

const routes = Router();

routes.use("/healthcheck", healthcheck);
routes.use("/order", order);
routes.use("/bot", bot);

module.exports = routes;
