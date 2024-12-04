import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import complaintsData from './complaints.json';
import casfos_logo from './assets/images/casfos_logo.jpg';
import users from './users.json';

function App() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(complaintsData);

  const handleLogin = (username, password) => {
    // Find the user in the users array based on the provided username and password
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      // If user is found, set the user state with the matched user details
      setUser({ id: user.id, username: user.username, role: user.role, department: user.department || null });
      return true;
    } else {
      // If no match is found, return false
      return false;
    }
  };

  const handleSignup = (newUser) => {
    // Implement your signup logic here
    setUser({ id: 2, ...newUser });
    return true;
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleNewComplaint = (newComplaint) => {
    setComplaints([...complaints, { ...newComplaint, id: complaints.length + 1 }]);
  };

  const handleStatusChange = (complaintId, newStatus) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
    ));
  };

  const handleFeedbackSubmit = (complaintId, feedback) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId ? { ...complaint, feedback } : complaint
    ));
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-green-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src={casfos_logo} alt="CASFOS Logo" className="h-12 w-auto mr-4" />
              <h1 className="text-2xl font-bold">CASFOS Grievance System</h1>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow container mx-auto my-8 px-4">
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/signup" element={
              user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleSignup} />
            } />
            <Route path="/dashboard" element={
              user ? (
                <Dashboard
                  user={user}
                  complaints={complaints}
                  onNewComplaint={handleNewComplaint}
                  onStatusChange={handleStatusChange}
                  onFeedbackSubmit={handleFeedbackSubmit}
                />
              ) : <Navigate to="/login" />
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;