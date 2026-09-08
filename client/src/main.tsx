import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ChatProvider } from "./context/ChatContext";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>,
);
