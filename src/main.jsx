import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import "./styles.css";

// English lives under an `/en` path prefix; Ukrainian is the bare root. As a
// router basename it prefixes every in-app link automatically.
const basename = /^\/en(?=\/|$)/.test(window.location.pathname) ? "/en" : "/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LangProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </LangProvider>
  </React.StrictMode>
);
