import { FormEvent, useState } from "react";
import { Hash, MessageCircle } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { sessionStore } from "../../lib/storage";

export function JoinScreen() {
  const { rooms, join, error, connectionStatus } = useChat();
  const [username, setUsername] = useState(sessionStore.getUsername());
  const [roomId, setRoomId] = useState(sessionStore.getRoomId());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    join(username.trim(), roomId);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_42%),radial-gradient(circle_at_80%_80%,_rgba(14,165,233,0.12),_transparent_36%)]" />

      <section className="relative w-full max-w-md rounded-3xl border border-line/80 bg-panel/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tide text-ink">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mist">
              Real-time rooms
            </p>
            <h1 className="text-2xl font-semibold">Harbor Chat</h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-mist">Display name</span>
            <input
              className="w-full rounded-2xl border border-line bg-ink/60 px-4 py-3 text-foam outline-none transition placeholder:text-mist/60 focus:border-tide"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. Maya Chen"
              autoComplete="nickname"
              maxLength={20}
              required
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm text-mist">Start in a room</legend>
            <div className="grid grid-cols-2 gap-2">
              {(rooms.length > 0 ? rooms : [{ id: "general", name: "General", description: "" }]).map(
                (room) => (
                  <label
                    key={room.id}
                    className={`cursor-pointer rounded-2xl border px-3 py-3 transition ${
                      roomId === room.id
                        ? "border-tide bg-tide/10"
                        : "border-line bg-ink/40 hover:border-mist/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="room"
                      value={room.id}
                      checked={roomId === room.id}
                      onChange={() => setRoomId(room.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Hash className="h-3.5 w-3.5 text-tide" />
                      {room.name}
                    </span>
                  </label>
                ),
              )}
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={connectionStatus !== "connected" || username.trim().length < 2}
            className="w-full rounded-2xl bg-tide px-4 py-3 font-semibold text-ink transition hover:bg-tide-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connectionStatus === "connected" ? "Enter chat" : "Connecting…"}
          </button>
        </form>
      </section>
    </main>
  );
}
