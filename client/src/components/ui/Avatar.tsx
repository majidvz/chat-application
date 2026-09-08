import { getAvatarColor, getInitials } from "../../lib/format";

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-sm",
};

export function Avatar({ name, size = "sm" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-ink ${sizeClasses[size]} ${getAvatarColor(name)}`}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
