const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = require("socket.io")(http, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

const routes = require("./routes.js");

const port = process.env.PORT || 3000;

exports.socketIo = io.on("connection", (socket) => {
  console.log("Client is connected...");
});

app.use("/", routes);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
