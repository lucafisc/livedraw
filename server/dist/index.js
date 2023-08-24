"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
var Tools;
(function (Tools) {
    Tools["PENCIL"] = "pencil";
    Tools["SPRAY"] = "spray";
    Tools["BRUSH"] = "brush";
})(Tools || (exports.Tools = Tools = {}));
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("draw-line", ({ prevPoint, currentPoint, lineColor, tool }) => {
        socket.broadcast.emit("draw-line", { prevPoint, currentPoint, lineColor, tool });
    });
    socket.on("clear", () => io.emit("clear"));
    socket.on("user-connected", () => socket.broadcast.emit("user-requested-canvas"));
    socket.on("send-newest-canvas", (newestCanvas) => socket.broadcast.emit("receive-newest-canvas", newestCanvas));
});
server.listen(3001, () => {
    console.log("listening on *:3001");
});
