import { randomUUID } from "node:crypto";
import type { User } from "../types/index.js";

class UserService {
  private usersBySocket = new Map<string, User>();
  private usersById = new Map<string, User>();

  create(username: string, roomId: string, socketId: string): User {
    const user: User = {
      id: randomUUID(),
      username,
      roomId,
      socketId,
      joinedAt: Date.now(),
    };

    this.usersBySocket.set(socketId, user);
    this.usersById.set(user.id, user);
    return user;
  }

  getBySocketId(socketId: string): User | undefined {
    return this.usersBySocket.get(socketId);
  }

  getById(userId: string): User | undefined {
    return this.usersById.get(userId);
  }

  listByRoom(roomId: string): User[] {
    return [...this.usersById.values()]
      .filter((user) => user.roomId === roomId)
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  isUsernameTaken(username: string, excludeSocketId?: string): boolean {
    const normalized = username.trim().toLowerCase();
    return [...this.usersById.values()].some(
      (user) =>
        user.socketId !== excludeSocketId &&
        user.username.toLowerCase() === normalized,
    );
  }

  moveToRoom(socketId: string, roomId: string): User | undefined {
    const user = this.usersBySocket.get(socketId);
    if (!user) {
      return undefined;
    }

    user.roomId = roomId;
    return user;
  }

  removeBySocketId(socketId: string): User | undefined {
    const user = this.usersBySocket.get(socketId);
    if (!user) {
      return undefined;
    }

    this.usersBySocket.delete(socketId);
    this.usersById.delete(user.id);
    return user;
  }
}

export const userService = new UserService();
