const express = require("express");
const myConn = require("express-myconnection");
const cors = require("cors");
const mysql = require("mysql");
const routes1 = require("./controllers/route1");
const { Server } = require("socket.io");
const http = require("http");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

const init_DB = {
      host: "localhost",
      port: "3306",
      user: "root",
      password: "",
      database: "rumas",
};

app.use(myConn(mysql, init_DB, "pool"));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

io.on("connection", (socket) => {
      console.log(socket.id);

      socket.on("message", ({ body, from, timestamp, isText }) => {
            console.log(body);
            console.log(from);
            console.log(timestamp);
            console.log(isText);
            socket.broadcast.emit("message", {
                  body,
                  from,
                  timestamp,
                  isText,
            });
      });
});

app.get("/", (req, res) => {
      res.send("HOLA");
});
app.use("/login", routes1);
const PORT = 3001;

server.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
});
