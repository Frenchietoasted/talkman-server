import { Message } from "../models/chat-entities.js"
export function parseCookies(cookieString : string ): (string | undefined)[] {
  const cookies = cookieString?.split(";");
  var username : string | undefined;
  var roomId: string | undefined;
  cookies.forEach((cookie) => {
    if (cookie.includes("username")) {
      username = cookie.split("=")[1];
    }
    if (cookie.includes("roomid")) {
      roomId = cookie.split("=")[1];
    }
  });
  console.log(cookies,username, roomId);
  return [username, roomId];
}
export function greet(username: string, roomId: string): Message {
  const timeStamp = new Date().toISOString();
  return ({
    "id": 'msg-' + timeStamp,
    "type": "message",
    "sender" : "system",
    "text": `Say hi to ${username}, room ${roomId}`,
    "timeStamp": timeStamp
  })
}