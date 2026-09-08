import { useChat } from "../../hooks/useChat";

export function TypingIndicator() {
  const { typingUsers } = useChat();

  if (typingUsers.length === 0) {
    return null;
  }

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : `${typingUsers.slice(0, 2).join(", ")} are typing`;

  return (
    <p className="px-1 text-sm text-mist">
      {label}
      <span className="inline-flex w-6 justify-between pl-1">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse [animation-delay:150ms]">.</span>
        <span className="animate-pulse [animation-delay:300ms]">.</span>
      </span>
    </p>
  );
}
