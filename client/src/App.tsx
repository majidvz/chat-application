import { JoinScreen } from "./components/join/JoinScreen";
import { ChatLayout } from "./components/layout/ChatLayout";
import { useChat } from "./hooks/useChat";

export function App() {
  const { currentUser } = useChat();

  return currentUser ? <ChatLayout /> : <JoinScreen />;
}
