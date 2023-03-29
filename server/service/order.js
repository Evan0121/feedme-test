const { setCache, getCache } = require("../utils/cache.js");
const { uuid } = require("uuidv4");
const app = require("../index.js");

const addOrder = async (vip) => {
  try {
    const orderList = await getCache("orders");

    orderData = { id: uuid(), status: "PENDING", botId: null, vip };

    if (!orderList) {
      await setCache("orders", [orderData]);

      return [orderData];
    }

    let orderPlaced = false;

    for (let index = 0; index < orderList.length; index++) {
      if (
        vip &&
        !orderList[index].vip &&
        orderList[index].status === "PENDING"
      ) {
        orderList.splice(index, 0, orderData);

        orderPlaced = true;

        break;
      }
    }

    if (!orderPlaced) {
      orderList.push(orderData);
    }

    await setCache("orders", orderList);

    return orderData;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const processOrder = async (botId) => {
  try {
    const orderList = await getCache("orders");

    if (!orderList) return null;

    let order;
    let orderIndex;

    for (let index = 0; index < orderList.length; index++) {
      if (orderList[index].status === "PENDING") {
        order = orderList[index];
        orderIndex = index;

        break;
      }
    }

    if (!order) return null;

    orderList[orderIndex].status = "IN_PROGRESS";
    orderList[orderIndex].botId = botId;

    await setCache("orders", orderList);

    setTimeout(() => {
      completeOrder(botId, order.id).then(async (res) => {
        if (res) {
          await processOrder(botId);

          app.socketIo.emit("ORDER_COMPLETED", true);
        }
      });
    }, 10000);

    return orderList[orderIndex];
  } catch (error) {
    console.log(error);
    return false;
  }
};

const unprocessOrder = async (botId) => {
  try {
    const orderList = await getCache("orders");

    if (!orderList) return null;

    const newOrderList = orderList.map((order) => {
      if (order.status === "IN_PROGRESS" && order.botId === botId) {
        return {
          ...order,
          botId: null,
          status: "PENDING",
        };
      }

      return order;
    });

    await setCache("orders", newOrderList);

    return newOrderList;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const completeOrder = async (botId, orderId) => {
  try {
    const botList = await getCache("bots");

    const bot = botList.find((bot) => bot.id === botId);

    if (!bot) return false;

    const orderList = await getCache("orders");

    const newOrderList = orderList.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "COMPLETED",
        };
      }

      return order;
    });

    await setCache("orders", newOrderList);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { addOrder, processOrder, unprocessOrder, completeOrder };
