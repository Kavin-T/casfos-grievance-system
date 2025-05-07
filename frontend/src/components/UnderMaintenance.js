import React from "react";
import casfos_logo from "../assets/images/casfos_logo.jpg";

export default function UnderMaintenance() {
  return (
    <>
      {/* Header */}
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

      {/* Main Content */}
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