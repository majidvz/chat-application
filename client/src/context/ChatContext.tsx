import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { socket } from "../lib/socket";
import { sessionStore } from "../lib/storage";
import type {
  ChatMessage,
  ConnectionStatus,
  Room,
  User,
} from "../types";

interface ChatContextValue {
  connectionStatus: ConnectionStatus;
  currentUser: User | null;
  currentRoom: Room | null;
  rooms: Room[];
  users: User[];
  messages: ChatMessage[];
  typingUsers: string[];
  error: string | null;
  join: (username: string, roomId: string) => void;
  switchRoom: (roomId: string) => void;
  sendMessage: (content: string) => void;
  setTyping: (isTyping: boolean) => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const typingTimeouts = useRef<Map<string, number>>(new Map());

  const clearTypingUser = useCallback((username: string) => {
    const timeoutId = typingTimeouts.current.get(username);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      typingTimeouts.current.delete(username);
    }

    setTypingUsers((current) => current.filter((name) => name !== username));
  }, []);

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      setConnectionStatus("connected");

      const savedUsername = sessionStore.getUsername();
      const savedRoomId = sessionStore.getRoomId();

      if (savedUsername) {
        socket.emit("join", { username: savedUsername, roomId: savedRoomId });
      }
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("rooms:list", setRooms);
    socket.on("users:list", setUsers);
    socket.on("messages:history", (history) => {
      setMessages(history);
      setTypingUsers([]);
    });
    socket.on("joined", ({ user, room }) => {
      setCurrentUser(user);
      setCurrentRoom(room);
      sessionStore.setUsername(user.username);
      sessionStore.setRoomId(room.id);
      setError(null);
    });
    socket.on("message", (message) => {
      setMessages((current) => [...current, message]);
    });
    socket.on("typing", ({ username, isTyping }) => {
      if (!isTyping) {
        clearTypingUser(username);
        return;
      }

      setTypingUsers((current) =>
        current.includes(username) ? current : [...current, username],
      );

      const existingTimeout = typingTimeouts.current.get(username);
      if (existingTimeout) {
        window.clearTimeout(existingTimeout);
      }

      const timeoutId = window.setTimeout(() => {
        clearTypingUser(username);
      }, 2500);

      typingTimeouts.current.set(username, timeoutId);
    });
    socket.on("error", ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("rooms:list");
      socket.off("users:list");
      socket.off("messages:history");
      socket.off("joined");
      socket.off("message");
      socket.off("typing");
      socket.off("error");
      socket.disconnect();
    };
  }, [clearTypingUser]);

  const join = useCallback((username: string, roomId: string) => {
    setError(null);
    sessionStore.setUsername(username);
    sessionStore.setRoomId(roomId);
    socket.emit("join", { username, roomId });
  }, []);

  const switchRoom = useCallback((roomId: string) => {
    setError(null);
    sessionStore.setRoomId(roomId);
    socket.emit("room:switch", { roomId });
  }, []);

  const sendMessage = useCallback((content: string) => {
    socket.emit("message", { content });
    socket.emit("typing", { isTyping: false });
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    socket.emit("typing", { isTyping });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      connectionStatus,
      currentUser,
      currentRoom,
      rooms,
      users,
      messages,
      typingUsers,
      error,
      join,
      switchRoom,
      sendMessage,
      setTyping,
      clearError,
    }),
    [
      connectionStatus,
      currentUser,
      currentRoom,
      rooms,
      users,
      messages,
      typingUsers,
      error,
      join,
      switchRoom,
      sendMessage,
      setTyping,
      clearError,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
}
