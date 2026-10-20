import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import "./components/paper-story.css";
import "./components/site-chrome.css";
import { App } from "./App.js";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
