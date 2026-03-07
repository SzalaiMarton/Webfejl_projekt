import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>IssueTracker</h1>
      </div>
      <ul className="navbar-links">
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
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;