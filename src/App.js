import React , {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import casfos_logo from './assets/images/casfos_logo.jpg';

function App() {

  useEffect(() => {
    // Add event listener to delete token on tab close
    const removeTokenOnTabClose = () => {
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem('authToken'); // Remove the token
      });
    };

    removeTokenOnTabClose();

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', removeTokenOnTabClose);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-green-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img src={casfos_logo} alt="CASFOS Logo" className="h-12 w-auto mr-4" />
              <h1 className="text-2xl font-bold">CASFOS Grievance System</h1>
            </div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
          </div>
        </header>

        <main className="flex-grow container mx-auto my-8 px-4">
          <Routes>
            <Route path="/" element={
              <Login/>
            } />
            <Route path="/dashboard" element={
                <Dashboard/>
            } />
          </Routes>
        </main>

        <footer className="bg-green-800 text-white text-center py-6 sm:py-8 lg:py-12">
          <p className="text-green-400">
            &copy; 2023 Central Academy for State Forest Service. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;