import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Prefs from "./prefs/App";

const content = <App />;

const app = (
  <StrictMode>
    <BrowserRouter basename="/yorick">
      <Routes>
        <Route path="/" element={content} />
        <Route path="index.html" element={content} />
        <Route path="prefs" element={<Prefs />} />{" "}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(app);
}
