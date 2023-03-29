<template>
  <main>
    <div class="title">
      <p class="text-4xl font-bold text-gray-900 dark:text-black">
        FeedMe Test
      </p>
    </div>

    <div class="order-btn-group">
      <button
        @click="addOrder(false)"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Add Normal Order
      </button>
      <button
        @click="addOrder(true)"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Add VIP Order
      </button>
    </div>

    <div class="order-table">
      <div class="relative overflow-x-auto max-h-96">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 top-0 sticky"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Order ID</th>
              <th scope="col" class="px-6 py-3">VIP</th>
              <th scope="col" class="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="max-h-96 overflow-y-auto">
            <template v-for="(value, index) in orders">
              <tr
                :key="index"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="px-6 py-4">{{ value.id }}</td>
                <td class="px-6 py-4">{{ value.vip ? "YES" : "NO" }}</td>
                <td class="px-6 py-4">{{ value.status }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bots">
      <template v-for="(value, index) in bots">
        <div
          :key="index"
          id="toast-default"
          class="mx-20 mt-5 flex items-center p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert"
        >
          <div>
            <div class="ml-4 text-base text-gray-900 dark:text-white">
              Bot: {{ value.id }}
            </div>
            <div class="ml-3 mt-1 text-sm font-normal">
              Order: {{ value.orderId }}
            </div>
          </div>

          <button
            @click="removeBot(value.id)"
            type="button"
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-default"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </template>
    </div>

    <div class="add-bot-btn">
      <button
        @click="addBot"
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Add Bot
      </button>
    </div>
  </main>
</template>

<script>
import { listOrder, addOrder, addBot, listBot, removeBot } from "./api.js";

export default {
  data() {
    return {
      orders: [],
      bots: [],
    };
  },

  mounted() {
    this.sockets.subscribe("ORDER_COMPLETED", () => {
      listOrder().then((res) => {
        this.orders = res.data;

        listBot().then((res) => {
          this.bots = res.data;
        });
      });
    });

    listOrder().then((res) => {
      this.orders = res.data;

      listBot().then((res) => {
        this.bots = res.data;
      });
    });
  },
  methods: {
    addOrder(vip) {
      addOrder({ vip }).then((res) => {
        listOrder().then((_res) => {
          this.orders = _res.data;
        });

        this.bots.forEach((bot) => {
          if (bot.id === res.data.botId) {
            bot.orderId = res.data.id;
          }
        });
      });
    },
    addBot() {
      addBot().then((res) => {
        this.bots.push(res.data);

        this.orders.forEach((order) => {
          if (order.id === res.data.orderId) {
            order.botId = res.data.id;
            order.status = "IN_PROGRESS";
          }
        });
      });
    },
    removeBot(botId) {
      removeBot({ botId }).then((res) => {
        this.orders = res.data.orders;
        this.bots = res.data.bots;
      });
    },
  },
};
</script>

<style scoped>
.title {
  margin-left: 5%;
  margin-top: 3vh;
}

.order-btn-group {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  width: 30%;
  margin-top: 3vh;
}

.order-table {
  margin-top: 2vh;
  padding: 0 10%;
}

.bots {
  margin: 0 10%;
  margin-top: 4vh;
}

.add-bot-btn {
  margin-left: 15%;
  margin-top: 5vh;
}
</style>
