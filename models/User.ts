import { WebSocket } from "ws";

export default class User {
  public readonly id: number;
  public readonly roomId: string;
  public readonly username: string;
  public readonly ws: WebSocket;
  constructor(id: number,roomId :string, username: string, ws: WebSocket) {
    this.id = id;
    this.roomId = roomId;
    this.username = username;
    this.ws = ws;
  }
  closeConnection(code: number,reason: string) {
    this.ws.close(code,reason);
  }
}