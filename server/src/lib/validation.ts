const USERNAME_PATTERN = /^[a-zA-Z0-9_ ]{2,20}$/;
const MAX_MESSAGE_LENGTH = 1000;

export function normalizeUsername(username: string): string {
  return username.trim().replace(/\s+/g, " ");
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!USERNAME_PATTERN.test(normalized)) {
    return "Username must be 2–20 characters and use only letters, numbers, spaces, or underscores.";
  }

  return null;
}

export function normalizeMessage(content: string): string {
  return content.trim();
}

export function validateMessage(content: string): string | null {
  const normalized = normalizeMessage(content);

  if (!normalized) {
    return "Message cannot be empty.";
  }

  if (normalized.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  return null;
}
