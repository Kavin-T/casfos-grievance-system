import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { exp } = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (exp <= currentTime) {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            alert('Your session has expired. Please log in again.');
            navigate('/');
          } else {
            setIsAuthenticated(true);
            // Schedule a timeout to log out the user when the token expires
            const timeUntilExpiry = (exp - currentTime) * 1000;
            setTimeout(() => {
              localStorage.removeItem('authToken');
              setIsAuthenticated(false);
              alert('Your session has expired. Please log in again.');
              navigate('/');
            }, timeUntilExpiry);
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          alert('Session validation error. Please log in again.');
          navigate('/');
        }
      } else {
        setIsAuthenticated(false);
        alert('Token not found. Please log in again.');
        navigate('/');
      }
      setLoading(false);
    };

    // Initial token check
    checkTokenExpiration();
  }, [navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return <div></div>;
  }

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
