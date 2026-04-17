import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectService from "../services/ProjectService.js";
import IssueService from "../services/IssueService.js";
import AuthService from "../services/AuthService.js";
import { useStore } from "../services/StoreContext.jsx";
import CustomButton from "../components/CustomButton.jsx";
import IssueCard from "../components/IssueCard.jsx";
import PopupCard from "../components/PopupCard.jsx";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadProject();
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoading && !project) {
      navigate('/not-found', { replace: true });
    }
  }, [isLoading, project, navigate]);

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
      setErrorMessage('Error deleting project: ' + err.message);
      setIsErrorOpen(true);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error) return <div className="container"><h2>Error: {error}</h2></div>;

  return (
    <div className="container">
      <PopupCard
        isOpen={isErrorOpen}
        message={errorMessage}
        onClose={() => setIsErrorOpen(false)}
        innerClassName="error-card-message"
        outerClassName="error-card-container"
        title={"Error!"}
      />
      <CustomButton
        onClick={() => navigate(-1)}
        className={"back-button"}
        text={"◀ Back"}
        type="button"
      />
      <div className="project-details-header">
        
      </div>

      <hr></hr>

      <div className="utils">
        <div className="issue-details-left">
          <div className="util-desc">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </div>
        </div>
        <div className="issue-details-right">
          <div className="issue-data">
            <p>Status: <strong>{project.status}</strong></p>
          </div>
          <div className="util-buttons">
            <h4>Options:</h4>
            <CustomButton
              onClick={() => navigate(`/projects/${id}/edit`)}
              text={"Edit Project"}
              className={"edit-button"}
            />
            <CustomButton
              className={"delete-button"}
              onClick={handleDeleteProject}
              text={"Delete Project"}
            />
          </div>
        </div>
      </div>
      
      <hr></hr>
      
      <h3>Issues in this project</h3>
      {issues.length === 0 ? (
        <p>No issues yet.</p>
      ) : (
        <div className="project-details-issues">
          {issues.map((issue, idx) => (
            <IssueCard
              key={issue.id}
              number={idx + 1}
              issue={issue}
              onClick={handleIssueClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectDetailsPage;
