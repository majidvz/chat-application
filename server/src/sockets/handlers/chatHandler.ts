import type { Server, Socket } from "socket.io";
import { messageService } from "../../services/messageService.js";
import { roomService } from "../../services/roomService.js";
import { userService } from "../../services/userService.js";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../types/index.js";
import {
  normalizeMessage,
  normalizeUsername,
  validateMessage,
  validateUsername,
} from "../../lib/validation.js";

type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

function emitRoomUsers(io: AppServer, roomId: string) {
  io.to(roomId).emit("users:list", userService.listByRoom(roomId));
}

function emitSystemMessage(
  io: AppServer,
  roomId: string,
  content: string,
) {
  const message = messageService.add({
    roomId,
    userId: null,
    username: "system",
    content,
    type: "system",
  });

  io.to(roomId).emit("message", message);
}

function joinRoom(io: AppServer, socket: AppSocket, roomId: string) {
  const room = roomService.getById(roomId);
  const user = userService.getBySocketId(socket.id);

  if (!room || !user) {
    socket.emit("error", { message: "Unable to join that room." });
    return;
  }

  void socket.join(roomId);
  socket.emit("joined", { user, room });
  socket.emit("messages:history", messageService.history(roomId));
  emitRoomUsers(io, roomId);
}

export function registerChatHandlers(io: AppServer, socket: AppSocket) {
  socket.emit("rooms:list", roomService.list());

  socket.on("join", ({ username, roomId }) => {
    const normalizedUsername = normalizeUsername(username);
    const usernameError = validateUsername(normalizedUsername);

    if (usernameError) {
      socket.emit("error", { message: usernameError });
      return;
    }

    if (!roomService.exists(roomId)) {
      socket.emit("error", { message: "That room does not exist." });
      return;
    }

    const existing = userService.getBySocketId(socket.id);
    if (existing) {
      void socket.leave(existing.roomId);
      emitRoomUsers(io, existing.roomId);
      userService.removeBySocketId(socket.id);
    }

    if (userService.isUsernameTaken(normalizedUsername, socket.id)) {
      socket.emit("error", { message: "That username is already in use." });
      return;
    }

    const user = userService.create(normalizedUsername, roomId, socket.id);
    socket.data.userId = user.id;
    joinRoom(io, socket, roomId);
    emitSystemMessage(io, roomId, `${user.username} joined the room.`);
  });

  socket.on("room:switch", ({ roomId }) => {
    const user = userService.getBySocketId(socket.id);

    if (!user) {
      socket.emit("error", { message: "Join a room before switching." });
      return;
    }

    if (!roomService.exists(roomId)) {
      socket.emit("error", { message: "That room does not exist." });
      return;
    }

    if (user.roomId === roomId) {
      return;
    }

    const previousRoomId = user.roomId;
    void socket.leave(previousRoomId);
    emitSystemMessage(io, previousRoomId, `${user.username} left the room.`);
    emitRoomUsers(io, previousRoomId);

    userService.moveToRoom(socket.id, roomId);
    joinRoom(io, socket, roomId);
    emitSystemMessage(io, roomId, `${user.username} joined the room.`);
  });

  socket.on("message", ({ content }) => {
    const user = userService.getBySocketId(socket.id);

    if (!user) {
      socket.emit("error", { message: "Join a room before sending messages." });
      return;
    }

    const normalized = normalizeMessage(content);
    const messageError = validateMessage(normalized);

    if (messageError) {
      socket.emit("error", { message: messageError });
      return;
    }

    const message = messageService.add({
      roomId: user.roomId,
      userId: user.id,
      username: user.username,
      content: normalized,
    });

    io.to(user.roomId).emit("message", message);
  });

  socket.on("typing", ({ isTyping }) => {
    const user = userService.getBySocketId(socket.id);
    if (!user) {
      return;
    }

    socket.to(user.roomId).emit("typing", {
      username: user.username,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    const user = userService.removeBySocketId(socket.id);
    if (!user) {
      return;
    }

    emitSystemMessage(io, user.roomId, `${user.username} left the room.`);
    emitRoomUsers(io, user.roomId);
  });
}
