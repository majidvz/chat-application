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

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface JoinPayload {
  username: string;
  roomId: string;
}
