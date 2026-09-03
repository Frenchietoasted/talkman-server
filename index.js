"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ws_1 = require("ws");
var app = (0, express_1.default)();
var wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        console.log("received:", data.toString());
    });
    ws.send("Hello from server!");
});
app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
