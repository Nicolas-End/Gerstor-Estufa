import { io, Socket } from "socket.io-client";
import { getTokenCookie } from "../controller/cookiesController";

var socket: Socket | null = null;

export async function initSocket() {
    if (!socket) {
        const token = await getTokenCookie();

        socket = io("http://192.168.1.11:8080", {
            autoConnect: false,
            timeout: 6000,
            transports: ["websocket"],
            extraHeaders: {
                'datas': token
            }
        });
    }
    return await socket
}
export function getSocket() {
    if (!socket) {
        throw new Error("Socket não foi inicializado ainda. Chame initSocket() antes!");
    }
    return socket;
}
export function closeSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}