import { formatTime } from "../../lib/format";
import type { ChatMessage } from "../../types";
import { Avatar } from "../ui/Avatar";

interface MessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
  if (message.type === "system") {
    return (
      <li className="py-1 text-center text-xs text-mist">{message.content}</li>
    );
  }

  return (
    <li className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <Avatar name={message.username} size="md" />
      <div className={`max-w-[80%] ${isOwn ? "items-end text-right" : ""}`}>
        <div className={`mb-1 flex items-baseline gap-2 ${isOwn ? "justify-end" : ""}`}>
          <span className="text-sm font-medium">{message.username}</span>
          <time className="text-xs text-mist" dateTime={new Date(message.timestamp).toISOString()}>
            {formatTime(message.timestamp)}
          </time>
        </div>
        <p
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
            isOwn
              ? "rounded-tr-md bg-tide text-ink"
              : "rounded-tl-md bg-panel-strong text-foam"
          }`}
        >
          {message.content}
        </p>
      </div>
    </li>
  );
}
