import { useState } from "react";
import { ChatHeader } from "../chat/ChatHeader";
import { MessageInput } from "../chat/MessageInput";
import { MessageList } from "../chat/MessageList";
import { Sidebar } from "../sidebar/Sidebar";

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink">
      <div
        className={`fixed inset-y-0 left-0 z-20 w-80 transform transition lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-ink/60 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <MessageList />
        <MessageInput />
      </section>
    </div>
  );
}
