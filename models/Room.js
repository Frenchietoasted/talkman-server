export default class Room {
    users = [];
    constructor(user) {
        this.users.push(user);
    }
    addUser(user) {
        this.users.push(user);
    }
    removeUser(user, code, reason) {
        this.users.forEach((roomUser) => {
            if (roomUser.id == user.id) {
                user.closeConnection(code, reason);
                this.users = this.users.filter(user => user.id != roomUser.id);
            }
        });
    }
    broadCast(username, message) {
        this.users.forEach((user) => {
            user.ws.send(JSON.stringify({
                "type": "message",
                "sender": username,
                "message": message,
            }));
        });
    }
}
