import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      <footer className="bg-green-800 text-white text-center py-6 sm:py-8 lg:py-12">
        <p className="text-green-400">
          &copy; 2025 Central Academy for State Forest Service. All rights
          reserved.
        </p>
      </footer>
    </Router>
  );
}

export default App;
