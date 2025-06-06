/*
 * Login.js
 *
 * Purpose:
 * This React component provides the login form and authentication logic for the CASFOS Grievance Redressal System.
 * It handles user credential input, authentication requests, error handling, and redirects on success or failure.
 *
 * Features:
 * - Username and password input fields with validation.
 * - Handles login requests and stores user info in localStorage.
 * - Displays error messages and toast notifications.
 * - Redirects to home on successful login, or maintenance page on backend failure.
 *
 * Usage:
 * Used as the entry point for users to sign in. Should be rendered at the login route.
 * Example: <Login />
 *
 * Dependencies:
 * - loginUser: API service for authentication (../services/authApi).
 * - react-toastify for notifications.
 * - react-router-dom for navigation.
 *
 * Notes:
 * - Expects backend to return username and designation on successful login.
 * - Handles both frontend and backend errors gracefully.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import casfos_logo from "../assets/images/casfos_logo.jpg";
import { loginUser } from "../services/authApi";
import { toast } from "react-toastify";

// Main Login component for authentication
export default function Login() {
  // State for username, password, and error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handler for form submission and authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(username, password);
      localStorage.setItem("username", data.username);
      localStorage.setItem("designation", data.designation);
      navigate("/home");
      toast.success(`Welcome, ${data.username}!`);
    } catch (error) {
      if (error==="Login failed.") {
        // Redirect to maintenance page if backend is unreachable
        navigate("/maintenance");
      } else {
        setError(error);
      }
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and form title */}
          <div>
            <img
              className="mx-auto h-24 w-auto"
              src={casfos_logo}
              alt="CASFOS Logo"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Hidden remember input */}
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Username input */}
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm pl-10"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              {/* Password input */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm pl-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Error message display */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              {/* Submit button */}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
