import { Hash } from "lucide-react";
import { useChat } from "../../hooks/useChat";

export function RoomList() {
  const { rooms, currentRoom, switchRoom } = useChat();

  return (
    <section>
      <h2 className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.18em] text-mist">
        Rooms
      </h2>
      <ul className="space-y-1">
        {rooms.map((room) => {
          const isActive = currentRoom?.id === room.id;

          return (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => switchRoom(room.id)}
                className={`flex w-full items-start gap-2 rounded-2xl px-3 py-2.5 text-left transition ${
                  isActive
                    ? "bg-tide/12 text-foam"
                    : "text-mist hover:bg-panel-strong hover:text-foam"
                }`}
              >
                <Hash className={`mt-0.5 h-4 w-4 ${isActive ? "text-tide" : ""}`} />
                <span>
                  <span className="block text-sm font-medium">{room.name}</span>
                  <span className="block text-xs text-mist">{room.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
