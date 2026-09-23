//bun --hot run index.ts to run the server with hot reloading
import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { User, Room } from "./models/chat-entities.js"
import { greet } from "./services/chat-services.js"
import cors from "cors";

dotenv.config();
const PORT = Number(process.env.PORT) || 8080;
const app = express();

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://talkman-client-l2ijc207e-steve-dmellos-projects.vercel.app",
			"https://talkman-client-one.vercel.app"
		],
		credentials: true,
	})
);

const server = createServer(app);
const wss = new WebSocketServer({server});

var id = 1;
var rooms: Map<string,Room> = new Map();

wss.on("connection", (ws, request) => {
  // // const cookies = request.headers.cookie?.toLowerCase();
  
  // // if (!cookies) {
  // //   ws.send(JSON.stringify({ "type": "error", "message": "No cookies somehow" }));
  // //   ws.close(10001,"Invalid cookies");
  // //   return;
  // // }
  
  // // const [username, roomId] = parseCookies(cookies);
  
  // if (!username || !roomId) {
  //   ws.send(JSON.stringify({ "type": "error", "message": "No room Id or username" }));
  //   ws.close(10002,"Invalid roomId or username");
  //   return;
  // }
  
  const user = new User(id++, "", "", ws);
  
  // if (rooms.has(roomId)) {
  //   rooms.get(roomId)?.addUser(user);
  //   rooms.get(roomId)?.broadCast("system", `Say hi to ${username}, room ${roomId}`)
  // } else {
  //   rooms.set(roomId, new Room(user));
  // }
  
  user.ws.on("message", (data) => {
    const received = JSON.parse(data.toString());
    if (!received) {
      user.ws.send(JSON.stringify(
        {
          "type": "error",
          "sender": "system",
          "message" : "How did you manage to send nothing"
        }
      ));
    }
    if (user.authenticated === true) {
      console.log("received:", received);
      rooms.get(user.roomId)?.broadCast(user.username,received);
    } else {
      console.log(received);
      if (received.type === "join" && received.username && received.roomId) {
        user.username = received.username;
        user.roomId = received.roomId;
        if (rooms.has(user.roomId)) {
          rooms.get(user.roomId)?.addUser(user);
          rooms.get(user.roomId)?.broadCast("system", greet(user.username, user.roomId));
        } else {
          rooms.set(user.roomId, new Room(user));
          rooms.get(user.roomId)?.broadCast("system", greet(user.username, user.roomId));
        }
        
        user.authenticated = true;
      } else {
        user.ws.send(JSON.stringify(
          {
            "type": "error",
            "sender": "system",
            "message" : "Send username and roomid bro"
          }
        ));
      }
    }
    
  });
});

server.listen(PORT ,() => {
  console.log("Server running");
});

app.get("/api/getAllMessages/:id", (req, res) => {
  const roomId = req.params.id;
  const room = rooms.get(roomId)
  if (room == null)
    return res.send([]);
  else 
    res.send(room.messageLog ?? []);
})

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok" });
});
