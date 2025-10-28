import { io, Socket } from "socket.io-client";
import { getTokenCookie } from "../controller/cookies-controller";
import { showSucess } from "../controller/alerts-controller";

// Crie um classe para ter o controle do Socket no sistema
class SocketIOService {
  private static instance: SocketIOService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketIOService {
    if (!SocketIOService.instance) {
      SocketIOService.instance = new SocketIOService();
    }
    return SocketIOService.instance;
  }

  public async initSocket(): Promise<Socket> {
    if (!this.socket) {
      const token = await getTokenCookie();
      this.socket = io("https://socket-estufa.onrender.com/", {
        autoConnect: true,
        timeout: 6000,
        transports: ["websocket"],
        query: {
          Token: token
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Sockt.Io connected')
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }
  public async offSocketConnections():Promise<boolean>{
    this.socket?.removeAllListeners()
    return true
  }
  public getSocket(): Socket | null {
    
    return this.socket;
  }

  public closeSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = SocketIOService.getInstance();