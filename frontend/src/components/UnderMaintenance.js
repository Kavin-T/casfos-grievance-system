/*
 * UnderMaintenance.js
 *
 * Purpose:
 * This React component displays a maintenance/under construction page for the CASFOS Grievance Redressal System.
 * It is shown when the site is temporarily unavailable due to backend or server issues.
 *
 * Features:
 * - Shows a header with logo and title.
 * - Displays a prominent maintenance message and image.
 * - Provides a simple footer.
 *
 * Usage:
 * Used as a fallback or redirect page when the backend is unreachable or during scheduled maintenance.
 * Example: <UnderMaintenance />
 *
 * Dependencies:
 * - casfos_logo.jpg and 404 image.avif for branding and illustration.
 *
 * Notes:
 * - Designed to be user-friendly and informative during downtime.
 */

import React from "react";
import casfos_logo from "../assets/images/casfos_logo.jpg";

// Main UnderMaintenance component for maintenance mode display
export default function UnderMaintenance() {
  return (
    <>
      {/* Header with logo and title */}
      <header className="bg-green-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={casfos_logo}
              alt="CASFOS Logo"
              className="h-12 w-auto mr-4"
            />
            <h1 className="text-2xl font-bold">CASFOS Grievance Redressal System</h1>
          </div>
        </div>
      </header>

      {/* Main content: maintenance message and image */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          This site is under maintenance
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          We are currently working on the issue. Please check back later.
        </p>
        <img
          src={require("../assets/images/404 image.avif")}
          alt="Under Maintenance"
          className="max-w-md"
        />
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white p-4 mt-4">
        <div className="container mx-auto text-center">
        </div>
      </footer>
    </>
  );
}
