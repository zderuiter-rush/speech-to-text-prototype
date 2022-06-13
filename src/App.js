import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./routes/navbar";
import SpeechText from "./routes/speechtext";
import Home from "./routes/home";
import Step1 from "./routes/step1";
import Step2 from "./routes/step2";
import Step3 from "./routes/step3";

import "./styles/App.scss";

export const App = () => {
  return (
    <div>
      <Navbar />
      <SpeechText />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/1" element={<Step1 />} />
        <Route exact path="/2" element={<Step2 />} />
        <Route exact path="/3" element={<Step3 />} />
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
