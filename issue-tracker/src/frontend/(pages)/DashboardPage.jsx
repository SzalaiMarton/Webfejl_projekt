import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import ProjectService from "../services/ProjectService.js";
import CommentService from "../services/CommentService.js";
import AuthService from "../services/AuthService.js";

import "../styles/tokens.css";
import "../styles/design.css";
import "../styles/layout.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [commentIssueTitles, setCommentIssueTitles] = useState({});
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const loadCommentIssueTitles = async (comments) => {
      const uniqueIssueIds = Array.from(new Set((comments || []).map((comment) => comment.issueId).filter(Boolean)));

      if (uniqueIssueIds.length === 0) {
        setCommentIssueTitles({});
        return;
      }

      const entries = await Promise.all(
        uniqueIssueIds.map(async (issueId) => {
          try {
            const issue = await IssueService.getIssueById(issueId);
            return [issueId, issue.title || issueId];
          } catch {
            return [issueId, issueId];
          }
        })
      );

      setCommentIssueTitles(Object.fromEntries(entries));
    };

    const runDashboardLoad = async () => {
      try {
        setIsLoading(true);
        
        try {
          const projectsData = await ProjectService.getCurrentUserProjects();
          setProjects(projectsData.slice(0, 3));
        } catch (error) {
          console.log(error.message);
        } 
        
        
        try {
          const issuesData = await IssueService.getCurrentUserIssues({ sortBy: "createdAt", sortOrder: "desc" });
          setRecentIssues(issuesData.slice(0, 5));
        } catch (error) {
          console.log(error.message);
        }

        try {
          const userId = AuthService.getCurrentUserIdFromStorage();
          const recentCommentsData = await CommentService.getUserRecentComments(userId, 3);
          setRecentComments(recentCommentsData);
          await loadCommentIssueTitles(recentCommentsData);
        } catch (error) {
          console.log(error.message);
        }

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    runDashboardLoad();
  }, [navigate]);

  return (
    <div className="container">
      <h2>Welcome Back!</h2>
      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : (
        (projects.length === 0) ? (
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
          <div className="recent-comments-container">
            {recentComments.length > 0 ? <h3>Your Recent Comments</h3> : <></>}
            {recentComments.length === 0 ? (
              <></>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {recentComments.map((c, idx) => (
                  <li
                    key={c.id}
                    style={{ padding: "0.5rem 0" }}
                  >
                    <strong>#{idx+1} {c.content}</strong>
                    <br />
                    <small>On Issue: {commentIssueTitles[c.issueId] || c.issueId} | {new Date(c.createdAt).toLocaleString()}</small>
                    <hr></hr>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="recent-issues-container">
            {recentIssues.length > 0 ? <h3>Recent Issues</h3> : <></>}
            {recentIssues.length === 0 ? (
              <></>
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
        </div>
        )
      )}
    </div>
  );
}

export default DashboardPage;
