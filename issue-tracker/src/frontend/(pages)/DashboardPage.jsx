import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import ProjectService from "../services/ProjectService.js";
import AuthService from "../services/AuthService.js";

import "../styles/tokens.css";
import "../styles/design.css";
import "../styles/layout.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Felhasználó adatai
      const currentUser = AuthService.getCurrentUserFromStorage();
      setUser(currentUser);

      // Projektek és issue-k
      const [projectsData, issuesData] = await Promise.all([
        ProjectService.getAllProjects(),
        IssueService.getAllIssues({ sortBy: "createdAt", sortOrder: "desc" }),
      ]);

      setProjects(projectsData.slice(0, 3)); // Első 3 projekt
      setRecentIssues(issuesData.slice(0, 5)); // Legutóbbi 5 issue
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome {user?.username || "to your Issue Tracker"}!</p>

      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid">
          <div className="card">
            <h3>Recent Issues</h3>
            {recentIssues.length === 0 ? (
              <p>No recent issues to display.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {recentIssues.map((issue) => (
                  <li
                    key={issue.id}
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  >
                    <strong>{issue.title}</strong>
                    <br />
                    <small>
                      Priority: {issue.priority} | Status: {issue.status}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Your Projects</h3>
            {projects.length === 0 ? (
              <p>No projects to display.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {projects.map((project) => (
                  <li
                    key={project.id}
                    style={{
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <strong>{project.name}</strong>
                    <br />
                    <small>{project.description}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Statistics</h3>
            <p>Total Issues: {recentIssues.length}</p>
            <p>Total Projects: {projects.length}</p>
            <p>Status: Active</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
