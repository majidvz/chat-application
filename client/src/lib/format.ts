export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return (parts[0] ?? "").slice(0, 2).toUpperCase();
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const AVATAR_COLORS = [
  "bg-teal-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-lime-500",
  "bg-cyan-500",
  "bg-orange-500",
] as const;

export function getAvatarColor(name: string): string {
  let hash = 0;

  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash);
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? "bg-teal-500";
}
