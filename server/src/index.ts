import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { createSocketServer } from "./sockets/index.js";

const app = createApp();
const httpServer = createServer(app);

createSocketServer(httpServer);

httpServer.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
