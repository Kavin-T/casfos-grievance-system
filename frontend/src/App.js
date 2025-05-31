/*
 * App.js
 *
 * Purpose:
 * This is the main entry point for the CASFOS Grievance Redressal System frontend React application.
 * It sets up the application routes and global layout, including the footer.
 *
 * Features:
 * - Configures React Router for navigation between main pages (MainPage, Login, Home, UnderMaintenance).
 * - Handles fallback routes for undefined paths.
 * - Displays a global footer on all pages.
 *
 * Usage:
 * This file is rendered at the root of the React app. Do not remove the Router or Routes structure.
 *
 * Dependencies:
 * - react-router-dom for routing.
 * - All main page components (Login, MainPage, Home, UnderMaintenance).
 *
 * Notes:
 * - Update routes as needed to add or remove pages.
 * - Footer is always visible at the bottom of the app.
 */

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import Home from "./components/Home";
import UnderMaintenance from "./components/UnderMaintenance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/under-maintenance" element={<UnderMaintenance />} />
        <Route path="*" element={<UnderMaintenance />} />
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
