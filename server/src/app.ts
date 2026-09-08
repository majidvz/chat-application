import cors from "cors";
import express from "express";
import { isAllowedOrigin } from "./config/env.js";
import { roomService } from "./services/roomService.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
      },
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/rooms", (_req, res) => {
    res.json(roomService.list());
  });

  return app;
}
