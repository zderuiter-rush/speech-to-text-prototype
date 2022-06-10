import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./routes/navbar";
import SpeechText from "./routes/speechtext";
import Home from "./routes/home";
import Page1 from "./routes/page1";

import "./styles/App.scss";

export const App = () => {
  return (
    <div>
      <Navbar />
      <SpeechText />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/1" element={<Page1 />} />
        <Route exact path="/2" element={<Page1 />} />
      </Routes>
    </div>
  );
};

// eslint-disable-next-line
export default () => (
  <Router>
    <App />
  </Router>
);
