import {io, Socket} from "socket.io-client";

export let socket: Socket;

export const createSocket = async (id: number) => {
    socket = io('api/ws/message');
    socket.on('connect', ()=>{

    });
    socket.emit("user_auth", {
        "id": id
    });
};

