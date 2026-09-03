import express from "express";
import { WebSocketServer } from "ws";

const app = express();
let users: { name: string, url: string }[] = [];
const wss = new WebSocketServer({ port: 8080, clientTracking: true });

wss.once("connection", function connection(ws) {
  console.log("welcome to the chat: what's your name?\n ");
  console.log(wss.clients);
  ws.on("message", function message(data) {
    const name = data.toString();
    users.push({ name, url: ws.url });
    console.log("received:", name);
    ws.send(`Hello ${name}!`);
  });

    ws.send("Hello from server!");
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
