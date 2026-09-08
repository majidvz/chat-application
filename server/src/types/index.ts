export interface User {
  id: string;
  username: string;
  roomId: string;
  socketId: string;
  joinedAt: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
}

export type MessageType = "user" | "system";

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string | null;
  username: string;
  content: string;
  timestamp: number;
  type: MessageType;
}

export interface JoinPayload {
  username: string;
  roomId: string;
}

export interface SendMessagePayload {
  content: string;
}

export interface TypingPayload {
  isTyping: boolean;
}

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
  join: (payload: JoinPayload) => void;
  "room:switch": (payload: { roomId: string }) => void;
  message: (payload: SendMessagePayload) => void;
  typing: (payload: TypingPayload) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
}
