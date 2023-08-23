const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
	lineColor: string;
	isPencil: boolean;
};

type Point = {
  x: number;
  y: number;
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("draw-line", ({ prevPoint, currentPoint, lineColor, isPencil }: DrawLine) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, lineColor, isPencil });
  });
  socket.on("clear", () => io.emit("clear"));

  socket.on("user-connected", () =>
    socket.broadcast.emit("user-requested-canvas")
  );
	socket.on("send-newest-canvas", (newestCanvas : string) => socket.broadcast.emit("receive-newest-canvas", newestCanvas))
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
