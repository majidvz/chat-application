import { useChat } from "../../hooks/useChat";
import { Avatar } from "../ui/Avatar";

export function UserList() {
  const { users, currentUser } = useChat();

  return (
    <section>
      <h2 className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.18em] text-mist">
        Online · {users.length}
      </h2>
      <ul className="space-y-1">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm"
          >
            <Avatar name={user.username} />
            <span className="truncate">
              {user.username}
              {user.id === currentUser?.id ? (
                <span className="ml-2 text-xs text-tide">you</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
