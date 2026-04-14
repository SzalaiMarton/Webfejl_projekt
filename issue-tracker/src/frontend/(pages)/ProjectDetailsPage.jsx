import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectService from "../services/ProjectService.js";
import IssueService from "../services/IssueService.js";
import AuthService from "../services/AuthService.js";
import { useStore } from "../services/StoreContext.jsx";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadProject();
  }, [id, navigate]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const projectData = await ProjectService.getProjectById(id);
      setProject(projectData.project);
      setIssues(projectData.issues || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error loading project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueClick = (issueId) => {
    navigate(`/issues/${issueId}`);
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await ProjectService.deleteProject(id);
      if (dispatch) dispatch({ type: 'REMOVE_PROJECT', payload: id });
      navigate('/projects');
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error) return <div className="container"><h2>Error: {error}</h2></div>;
  if (!project) return <div className="container"><h2>Project not found</h2></div>;

  return (
    <div className="container">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p>Status: <strong>{project.status}</strong></p>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(`/projects/${id}/edit`)} style={{ marginRight: '0.5rem' }}>
          Edit Project
        </button>
        <button onClick={handleDeleteProject} style={{ backgroundColor: '#fee', color: '#c00' }}>
          Delete Project
        </button>
      </div>

      <h3>Issues in this project</h3>
      {issues.length === 0 ? (
        <p>No issues yet.</p>
      ) : (
        <div className="grid">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() => handleIssueClick(issue.id)}
            >
              <h4>{issue.title}</h4>
              <p>{issue.description}</p>
              <small>
                Priority: {issue.priority} | Status: {issue.status}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectDetailsPage;
