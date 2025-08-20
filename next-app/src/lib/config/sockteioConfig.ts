import { io, Socket } from "socket.io-client";
import { getTokenCookie } from "../controller/cookiesController";

var socket: Socket | null = null;

export async function initSocket() {
    if (!socket) {
        const token = await getTokenCookie();

        socket = io("http://127.0.0.1:8080", {
            autoConnect: true,
            timeout: 6000,
            transports: ["websocket"],
            extraHeaders: {
                'datas': token
            }
        });
    }
    return socket
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