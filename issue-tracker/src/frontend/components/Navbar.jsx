import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "../services/AuthService.js";

import '../styles/tokens.css'
import '../styles/design.css'
import '../styles/layout.css'
import CustomButton from "./CustomButton.jsx";

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
        {isAuthenticated && (
        <div className="navbar-brand-logged-in">
          <h1>IssueTracker</h1>
          <div className="navbar-user">
            <p2>Welcome, {user.username}</p2>
            <CustomButton
              onClick={handleLogout}
              text={"Logout"}
              className={"logout-btn"}

            />
          </div>
        </div>

      )}
      {!isAuthenticated && (
        <div className="navbar-brand-logged-out">
          <h1>IssueTracker</h1>
        </div>
      )}
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
              <li>
                <NavLink to="/create-project" className={({ isActive }) => (isActive ? "active" : "")}>
                  Create Project
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