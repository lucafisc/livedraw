import { Server } from "socket.io";
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "https://livedraw-ashy.vercel.app",
    methods: ["GET", "POST"]
  },
});

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

export enum Tools {
  PENCIL = "pencil",
  SPRAY = "spray",
  BRUSH = "brush",
}

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  lineColor: string;
  tool: Tools;
};

type Point = {
  x: number;
  y: number;
};

let connectedUsers = 0;

io.on("connection", (socket) => {
  connectedUsers++;
  socket.emit("connected-users", connectedUsers);
  console.log(`User connected. Total users: ${connectedUsers}`);
  socket.on(
    "draw-line",
    ({ prevPoint, currentPoint, lineColor, tool }: DrawLine) => {
      socket.broadcast.emit("draw-line", {
        prevPoint,
        currentPoint,
        lineColor,
        tool,
      });
    }
  );
  socket.on("clear", () => io.emit("clear"));

  socket.on("user-connected", () =>
    socket.broadcast.emit("user-requested-canvas")
  );
  socket.on("send-newest-canvas", (newestCanvas: string) =>
    socket.broadcast.emit("receive-newest-canvas", newestCanvas)
  );
  socket.on("disconnect", () => {
    connectedUsers--;
    socket.emit("connected-users", connectedUsers);
    console.log(`User disconnected. Total users: ${connectedUsers}`);
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
