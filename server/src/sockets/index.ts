import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { isAllowedOrigin } from "../config/env.js";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../types/index.js";
import { registerChatHandlers } from "./handlers/chatHandler.js";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
      },
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    registerChatHandlers(io, socket);
  });

  return io;
}
