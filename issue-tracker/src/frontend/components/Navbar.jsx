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
    const auth = AuthService.isAuthenticated();
    setIsAuthenticated(auth);
    
    if (auth) {
      const currentUser = AuthService.getCurrentUserFromStorage();
      setUser(currentUser);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check auth state on mount
    checkAuthState();

    // Listen for auth state changes
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
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>IssueTracker</h1>
      </div>
      <ul className="navbar-links">
        {isAuthenticated && (
          <>
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
            <div className="navbar-user">
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
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