import { MessageCircle, Radio } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { RoomList } from "./RoomList";
import { UserList } from "./UserList";

export function Sidebar() {
  const { connectionStatus, currentUser } = useChat();

  return (
    <aside className="flex h-full w-full flex-col border-r border-line bg-panel/90 lg:w-80">
      <div className="flex items-center gap-3 border-b border-line px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tide text-ink">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">Harbor Chat</p>
          <p className="flex items-center gap-1.5 text-xs text-mist">
            <Radio
              className={`h-3 w-3 ${
                connectionStatus === "connected" ? "text-tide" : "text-amber-400"
              }`}
            />
            {connectionStatus === "connected" ? "Live" : "Reconnecting"}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <RoomList />
        <UserList />
      </div>

      {currentUser ? (
        <div className="border-t border-line px-5 py-4 text-sm text-mist">
          Signed in as{" "}
          <span className="font-medium text-foam">{currentUser.username}</span>
        </div>
      ) : null}
    </aside>
  );
}
