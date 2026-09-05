export default class User {
    id;
    roomId;
    username;
    ws;
    constructor(id, roomId, username, ws) {
        this.id = id;
        this.roomId = roomId;
        this.username = username;
        this.ws = ws;
    }
    closeConnection(code, reason) {
        this.ws.close(code, reason);
    }
}
