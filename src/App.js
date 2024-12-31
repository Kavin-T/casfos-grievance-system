import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  useEffect(() => {
    // Add event listener to delete token on tab close
    const removeTokenOnTabClose = () => {
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("authToken"); // Remove the token
      });
    };

    removeTokenOnTabClose();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", removeTokenOnTabClose);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute element={Home} />} />
      </Routes>

      <footer className="bg-green-800 text-white text-center py-6 sm:py-8 lg:py-12">
        <p className="text-green-400">
          &copy; 2023 Central Academy for State Forest Service. All rights
          reserved.
        </p>
      </footer>
    </Router>
  );
}

export default App;
