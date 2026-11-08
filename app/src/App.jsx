import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Landing from "./Landing.jsx";
import Demo from "./Demo.jsx";
import Proof from "./Proof.jsx";
import Nav from "./Nav.jsx";

// Tiny router: /, /app, /judge, /proof
export function go(path) { history.pushState({}, "", path); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo({ top: 0 }); }

export default function App() {
  const [path, setPath] = useState(location.pathname.replace(/\/$/, "") || "/");
  useEffect(() => { const f = () => setPath(location.pathname.replace(/\/$/, "") || "/"); addEventListener("popstate", f); return () => removeEventListener("popstate", f); }, []);
  const page = path === "/proof" ? <Proof /> : path === "/app" || path === "/judge" ? <Demo judge={path === "/judge"} /> : <Landing />;
  useEffect(() => { document.title = { "/app": "Demo · Ask Me First", "/judge": "Judge path · Ask Me First", "/proof": "Proof · Ask Me First" }[path] || "Ask Me First"; }, [path]);
  return (<MotionConfig reducedMotion="user">
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
    <Nav path={path} overlay={path === "/"} />
    <div id="main">{page}</div>
  </MotionConfig>);
}
