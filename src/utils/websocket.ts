import {io} from "socket.io-client";

export const createSocket = async (id: number) => {

    const socket = io('api/ws/message');
    socket.on('connect', ()=>{

    });
    socket.emit("user_auth", {
        "id": id
    });
    return socket;
};

