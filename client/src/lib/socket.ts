import { io, type Socket } from "socket.io-client";
import type { ChatMessage, Room, User } from "../types";

export interface ServerToClientEvents {
  joined: (payload: { user: User; room: Room }) => void;
  "rooms:list": (rooms: Room[]) => void;
  "users:list": (users: User[]) => void;
  "messages:history": (messages: ChatMessage[]) => void;
  message: (message: ChatMessage) => void;
  typing: (payload: { username: string; isTyping: boolean }) => void;
  error: (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  join: (payload: { username: string; roomId: string }) => void;
  "room:switch": (payload: { roomId: string }) => void;
  message: (payload: { content: string }) => void;
  typing: (payload: { isTyping: boolean }) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001";

export const socket: AppSocket = io(socketUrl, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});
