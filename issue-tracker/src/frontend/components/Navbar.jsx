import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import AuthService from "../services/AuthService.js";
import { useAuth } from "../services/AuthContext.jsx";

import '../styles/tokens.css'
import '../styles/design.css'
import '../styles/layout.css'
import CustomButton from "./CustomButton.jsx";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthPage = useMemo(() => isLoginPage || isRegisterPage, [isLoginPage, isRegisterPage]);
  const canManageProjects = Boolean(user);
 
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
        {!isAuthPage && isAuthenticated && (
        <div className="navbar-brand-logged-in">
          <h1>IssueTracker</h1>
          <div className="navbar-user">
            <h4>{user?.username}</h4>
            <CustomButton
              onClick={handleLogout}
              text={"Logout"}
              className={"logout-btn"}

            />
          </div>
        </div>

        )}
        {(!isAuthenticated || isAuthPage) && (
        <div className="navbar-brand-logged-out">
          <h1>IssueTracker</h1>
        </div>
      )}
      <ul className="navbar-links">
          {!isAuthPage && isAuthenticated && (
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
              {canManageProjects && (
                <li>
                  <NavLink to="/create-project" className={({ isActive }) => (isActive ? "active" : "")}>
                    Create Project
                  </NavLink>
                </li>
              )}
            </div>
          </>
        )}
          {(isAuthPage || !isAuthenticated) && (
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
