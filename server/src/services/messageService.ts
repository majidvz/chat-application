import { randomUUID } from "node:crypto";
import type { ChatMessage, MessageType } from "../types/index.js";

const HISTORY_LIMIT = 100;

class MessageService {
  private messagesByRoom = new Map<string, ChatMessage[]>();

  add(params: {
    roomId: string;
    userId: string | null;
    username: string;
    content: string;
    type?: MessageType;
  }): ChatMessage {
    const message: ChatMessage = {
      id: randomUUID(),
      roomId: params.roomId,
      userId: params.userId,
      username: params.username,
      content: params.content,
      timestamp: Date.now(),
      type: params.type ?? "user",
    };

    const history = this.messagesByRoom.get(params.roomId) ?? [];
    history.push(message);

    if (history.length > HISTORY_LIMIT) {
      history.splice(0, history.length - HISTORY_LIMIT);
    }

    this.messagesByRoom.set(params.roomId, history);
    return message;
  }

  history(roomId: string): ChatMessage[] {
    return [...(this.messagesByRoom.get(roomId) ?? [])];
  }
}

export const messageService = new MessageService();
