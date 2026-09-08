import type { Room } from "../types/index.js";

const DEFAULT_ROOMS: Room[] = [
  {
    id: "general",
    name: "General",
    description: "Everyday conversation",
  },
  {
    id: "random",
    name: "Random",
    description: "Off-topic and anything else",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Engineering and tools",
  },
  {
    id: "design",
    name: "Design",
    description: "UI, UX, and visual craft",
  },
];

class RoomService {
  private rooms = new Map<string, Room>(
    DEFAULT_ROOMS.map((room) => [room.id, room]),
  );

  list(): Room[] {
    return [...this.rooms.values()];
  }

  getById(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  exists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }
}

export const roomService = new RoomService();
