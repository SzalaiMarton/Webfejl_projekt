import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "../services/AuthService.js";

import '../styles/tokens.css'
import '../styles/design.css'
import '../styles/layout.css'

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthState = () => {
    if (AuthService.isAuthenticated()) {
      const storedUser = AuthService.getCurrentUserFromStorage();
      if (storedUser) {
        setIsAuthenticated(true);
        setUser(storedUser);
        return;
      }
      
      AuthService.getCurrentUser()
        .then(user => {
          if (user) {
            setIsAuthenticated(true);
            setUser(user);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthState();

    const handleAuthChange = (event) => {
      checkAuthState();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);
 
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>IssueTracker</h1>
        {isAuthenticated && (
        <>
          <div className="navbar-user">
            <p2>{user.username}</p2>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </>
      )}
      </div>
      <ul className="navbar-links">
        {isAuthenticated && (
          <>
            <div className="navbar-inner-links">
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/create-issue" className={({ isActive }) => (isActive ? "active" : "")}>
                  Create Issue
                </NavLink>
              </li>
            </div>
          </>
        )}
        {!isAuthenticated && (
          <li>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;