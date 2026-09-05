//bun --hot run index.ts to run the server with hot reloading
import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import User from "./models/User.js"
import Room from "./models/Room.js"

dotenv.config();
const PORT = Number(process.env.PORT) || 8080;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});

interface Message {
  username: string;
  text: string;
  roomId: string;
}

var id = 1;
var messageLog: Message[] = [];
var rooms: Map<string,Room> = new Map();

wss.on("connection", (ws, request) => {
  const cookies = request.headers.cookie;
  const username = cookies?.split(";")[0]?.split("=")[1];
  const roomId = cookies?.split(";")[1]?.split("=")[1];
  
  if (!username || !roomId) {
    ws.send(JSON.stringify({ "type": "error", "message": "No room Id or username" }));
    ws.close();
    return;
  }
  const user = new User(id++, roomId, username, ws);
  
  if (rooms.has(roomId)) {
    rooms.get(roomId)?.addUser(user);
  } else {
    rooms.set(roomId, new Room(user));
  }
  
  user.ws.send(`welcome to room ${roomId}, ${username} `);

  user.ws.on("message", (data) => {
    const received = JSON.parse(data.toString());
    messageLog.push({
      username: user.username,
      roomId: user.roomId,
      text: received.text
    });
    console.log("received:", received);
    rooms.get(user.roomId)?.broadCast(user.username,received.text);
  });
});

server.listen(PORT ,() => {
  console.log("Server running");
});

app.get("/api/getAllMessages/:id", (req, res) => {
  const roomId = req.params.id;
  const messages = messageLog.filter(message => message.roomId === roomId);
  res.send(messages);
})