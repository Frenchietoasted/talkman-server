import { WebSocket } from "ws";

export class User {
  public readonly id: number;
  public roomId: string;
  public username: string;
  public readonly ws: WebSocket;
  public authenticated : boolean
  constructor(id: number,roomId :string, username: string, ws: WebSocket) {
    this.id = id;
    this.roomId = roomId;
    this.username = username;
    this.ws = ws;
    this.authenticated = false;
  }
  closeConnection(code: number,reason: string) {
    this.ws.close(code,reason);
  }
}

export class Room {
  public users: User[] = [];
  public messageLog: Message[] = [];
  constructor(user: User) {
    this.users.push(user);
  }
  addUser(user: User) {
    this.users.push(user);
  }
  removeUser(user: User,code:number, reason: string) {
    this.users.forEach((roomUser) => {
      if (roomUser.id == user.id) {
        user.closeConnection(code, reason);
        this.users = this.users.filter(user => user.id != roomUser.id)
      }
    });
  }
  broadCast(username: string, message: Message) {
    const timeStamp = new Date().toISOString();
    this.messageLog.push({
      "id": message.id,
      "sender": username,
      "text": message.text,
      "timeStamp": timeStamp
    })
    this.users.forEach((user) => {
      user.ws.send(JSON.stringify({
         "id": message.id,
         "type": "message",
         "sender" : username,
         "text": message.text,
         "timeStamp": timeStamp
      }));
    });
  }
}

export interface Message {
  id: string;
  type?: string;
  sender: string;
  text: string;
  timeStamp: string;
}
