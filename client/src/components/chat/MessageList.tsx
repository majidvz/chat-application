import { useChat } from "../../hooks/useChat";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

export function MessageList() {
  const { messages, currentUser, typingUsers } = useChat();
  const endRef = useAutoScroll(`${messages.length}-${typingUsers.join(",")}`);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-mist">
          No messages yet. Say hello.
        </div>
      ) : (
        <ul className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={message.userId === currentUser?.id}
            />
          ))}
          <li>
            <TypingIndicator />
            <div ref={endRef} />
          </li>
        </ul>
      )}
    </div>
  );
}
