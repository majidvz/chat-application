import dotenv from "dotenv";

dotenv.config();

const DEFAULT_ORIGIN = "http://localhost:5173";

export const env = {
  port: Number(process.env.PORT ?? 3001),
  clientOrigin: process.env.CLIENT_ORIGIN ?? DEFAULT_ORIGIN,
};

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  if (origin === env.clientOrigin) {
    return true;
  }

  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}
