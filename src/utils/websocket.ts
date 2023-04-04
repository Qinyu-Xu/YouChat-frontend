import {io, Socket} from "socket.io-client";

let socket: Socket;

export const createSocket = async (id: number) => {
    socket = io('api/ws/message');
    socket.emit("user_auth", {
        "id": id
    });
};

export const getSocket = () => {
    return socket;
}
