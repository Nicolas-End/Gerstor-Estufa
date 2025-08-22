import { io, Socket } from "socket.io-client";
import { getTokenCookie } from "../controller/cookiesController";
import { ReactServerDOMWebpackClient } from "next/dist/server/route-modules/app-page/vendored/ssr/entrypoints";

var socket: Socket | null = null;

export async function initSocket() {
    if (!socket) {
        const token = await getTokenCookie();

        socket = io("http://127.0.0.1:8080", {
            autoConnect: true,
            timeout: 6000,
            transports: ["websocket"],
            
            query:{
                'Token':token
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
        socket.disconnect()
        socket = null;
    }
}