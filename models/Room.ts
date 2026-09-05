import User from "./User.js"

export default class Room {
  public users: User[] = [];
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
  broadCast(username : string,message: string) {
    this.users.forEach((user) => {
       user.ws.send(JSON.stringify({
         "type": "message",
         "sender" : username,
         "message": message,
      }));
    });
  }
}