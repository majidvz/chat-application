const USERNAME_KEY = "harbor.username";
const ROOM_KEY = "harbor.roomId";

export const sessionStore = {
  getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY) ?? "";
  },
  setUsername(username: string) {
    sessionStorage.setItem(USERNAME_KEY, username);
  },
  getRoomId(): string {
    return sessionStorage.getItem(ROOM_KEY) ?? "general";
  },
  setRoomId(roomId: string) {
    sessionStorage.setItem(ROOM_KEY, roomId);
  },
  clear() {
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(ROOM_KEY);
  },
};
