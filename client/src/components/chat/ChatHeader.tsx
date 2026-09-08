import { Hash, Menu, Users } from "lucide-react";
import { useChat } from "../../hooks/useChat";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  const { currentRoom, users } = useChat();

  return (
    <header className="flex items-center justify-between border-b border-line bg-panel/70 px-4 py-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl border border-line p-2 text-mist hover:text-foam lg:hidden"
          aria-label="Toggle rooms and people"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Hash className="h-4 w-4 text-tide" />
            {currentRoom?.name ?? "Room"}
          </h1>
          <p className="text-sm text-mist">{currentRoom?.description}</p>
        </div>
      </div>
      <p className="flex items-center gap-2 text-sm text-mist">
        <Users className="h-4 w-4" />
        {users.length} online
      </p>
    </header>
  );
}
