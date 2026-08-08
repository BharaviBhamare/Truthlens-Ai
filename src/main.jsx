import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Audio from "./pages/Audio.jsx";
import Document from "./pages/Document.jsx";

import "./index.css";
import App from "./App.jsx";
import Image from "./pages/Image.jsx";
import Video from "./pages/Video.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/image" element={<Image />} />
        <Route path="/video" element={<Video />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/document" element={<Document />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
