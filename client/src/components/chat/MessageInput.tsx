import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useChat } from "../../hooks/useChat";

export function MessageInput() {
  const { sendMessage, setTyping, error, clearError } = useChat();
  const [content, setContent] = useState("");
  const typingRef = useRef(false);

  const stopTyping = () => {
    if (!typingRef.current) {
      return;
    }

    typingRef.current = false;
    setTyping(false);
  };

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    const next = content.trim();

    if (!next) {
      return;
    }

    sendMessage(next);
    setContent("");
    stopTyping();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (value: string) => {
    setContent(value);
    clearError();

    const isTyping = value.trim().length > 0;
    if (isTyping !== typingRef.current) {
      typingRef.current = isTyping;
      setTyping(isTyping);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-line bg-panel/80 px-4 py-4 backdrop-blur lg:px-8"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-3xl border border-line bg-ink/50 p-2">
        <textarea
          value={content}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={stopTyping}
          rows={1}
          maxLength={1000}
          placeholder="Write a message… Enter to send, Shift+Enter for a new line"
          className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-mist/70"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="mb-1 mr-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-tide text-ink transition hover:bg-tide-deep disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
      {error ? (
        <p className="mx-auto mt-3 max-w-3xl text-sm text-rose-300">{error}</p>
      ) : null}
    </form>
  );
}
