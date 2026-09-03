//bun --hot run index.ts to run the server with hot reloading
import express from "express";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

const app = express();
let users: { name: string, url: string }[] = [];
dotenv.config();
const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080, clientTracking: true });

wss.on("connection", function connection(ws) {
  ws.send("welcome to the chat, what's your name? ");
  ws.on("message", function message(data) {
    const name = data.toString();
    console.log("received:", name);
    ws.send(`Hello ${name}!`);
    wss.clients.forEach((client) => {
      client.send(`User ${name} is in the chat, Say hi!`)
    })
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
