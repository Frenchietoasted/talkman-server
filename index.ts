import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        console.log("received:", data.toString());
    });

    ws.send("Hello from server!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
