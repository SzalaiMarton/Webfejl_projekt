import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      
      const projectsData = await ProjectService.getCurrentUserProjects();
      const issuesData = await IssueService.getCurrentUserIssues({ sortBy: "createdAt", sortOrder: "desc" });

      setProjects(projectsData.slice(0, 3));
      setRecentIssues(issuesData.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Welcome Back!</h2>
      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : (
        (projects.length === 0 && recentIssues.length === 0) ? (
          <div className="empty-dashboard">
            <p>Nothing to show here.</p>
            <p>
              Get started here: <a 
                href="/create-project"
                className="link-text"
              >
                Create a project
              </a>
            </p>
          </div>
        ) : (
        <div className="dashboard-container">
          <div className="recent-issues-container">
            {recentIssues.length > 0 ? <h3>Recent Issues</h3> : <></>}
            {recentIssues.length === 0 ? (
              <p>No recent issues to display.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {recentIssues.map((issue, idx) => (
                  <li
                    key={issue.id}
                    style={{
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  >
                    <strong>#{idx+1} {issue.title}</strong>
                    <br />
                    <small>
                      Priority: {issue.priority} | Status: {issue.status}
                    </small>
                    <hr></hr>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="your-projects-container">
            {projects.length > 0 ? <h3>Your Projects</h3> : <></>}
            {projects.length === 0 ? (
              <></>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {projects.map((project, idx) => (
                  <li
                    key={project.project.id}
                    style={{
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/projects/${project.project.id}`)}
                  >
                    <strong>#{idx+1} {project.project.name}</strong>
                    <br />
                    <small>{project.project.description}</small>
                    <hr></hr>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="statistics-container">
            <h3>Statistics</h3>
            <p>Total Issues: {recentIssues.length}</p>
            <p>Total Projects: {projects.length}</p>
            <p>Status: <span>Active</span></p>
          </div>
        </div>
        )
      )}
    </div>
  );
}

export default DashboardPage;
