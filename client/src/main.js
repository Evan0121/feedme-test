import Vue from "vue";
import App from "./App.vue";
import VueSocketIO from "vue-socket.io";

import "./index.css";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://localhost:3000/",
  })
);

new Vue({
  render: (h) => h(App),
  sockets: {
    connect() {
      console.log("socket connected...");
    },
    disconnected() {
      console.log("socket disconnected...");
    },
  },
}).$mount("#app");
