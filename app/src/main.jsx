import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// The static build ships the agent as a browser script; load it before the first render.
async function boot() {
  if (import.meta.env.VITE_STATIC === "1") {
    await new Promise((ok, fail) => { const s = document.createElement("script"); s.src = "/static-api.js"; s.onload = ok; s.onerror = fail; document.head.append(s); });
  }
  createRoot(document.getElementById("root")).render(<App />);
}
boot();
