import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectService from "../services/ProjectService.js";
import IssueService from "../services/IssueService.js";
import AuthService from "../services/AuthService.js";
import { useStore } from "../services/StoreContext.jsx";
import CustomButton from "../components/CustomButton.jsx";
import IssueCard from "../components/IssueCard.jsx";
import PopupCard from "../components/PopupCard.jsx";
import ProjectLabelsModal from "../components/ProjectLabelsModal.jsx";
import UserService from "../services/UserService.js";
import LabelService from "../services/LabelService.js";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [questionIsOpen, setQuestionIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

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
      setLabels(projectData.labels || await LabelService.getProjectLabels(id));
      setError(null);
      setIsActive(projectData.project.status === "active");

      const user = await UserService.getUserById(projectData.project.ownerId);
      setOwnerName(user.username)
    } catch (err) {
      setError(err.message);
      console.error("Error loading project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectStatusChange = async () => {
    const nextStatus = isActive ? "inactive" : "active";
    const updatedProject = await ProjectService.updateProject(project.id, { status: nextStatus });
    setProject(updatedProject);
    setIsActive(updatedProject.status === "active");
  };

  const handleIssueClick = (issueId) => {
    navigate(`/issues/${issueId}`);
  };

  const filteredIssues = [...issues]
    .filter((issue) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch = !normalizedSearch
        || issue.title.toLowerCase().includes(normalizedSearch)
        || issue.description.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleDeleteProject = async () => {
    try {
      await ProjectService.deleteProject(id);
      if (dispatch) dispatch({ type: 'REMOVE_PROJECT', payload: id });
      navigate('/projects');
    } catch (err) {
      setErrorMessage('Failed to delete project.');
      setIsErrorOpen(true);
    }
    setQuestionIsOpen(false);
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
        title={"Error!"}
      />
      <PopupCard
        title={"Are you sure?"}
        message={"Delete this project?"}
        onConfirm={handleDeleteProject}
        onClose={() => setQuestionIsOpen(false)}
        isOpen={questionIsOpen}
        innerClassName={"confirm-card-message"}
      />
      <ProjectLabelsModal
        isOpen={isLabelsModalOpen}
        onClose={() => setIsLabelsModalOpen(false)}
        projectId={id}
        labels={labels}
        onLabelsChange={setLabels}
      />
      <CustomButton
        onClick={() => navigate(`/projects`)}
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
            <div className="project-labels-summary">
              <strong>Labels:</strong>
              {labels.length > 0 ? (
                <div className="label-chip-list compact">
                  {labels.map((label) => (
                    <span key={label.id} className="label-chip" style={{ backgroundColor: label.color }}>
                      {label.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No labels yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="issue-details-right">
          <div className="issue-data">
            <div className="issue-inner-data">
              <strong>Creator:</strong>
              <p>{ownerName}</p>
            </div>
            <div className="issue-inner-data">
              <strong>Status:</strong>
              <p 
                className={(isActive ? "text-active" : "text-deactive")}>
                {project.status}
              </p>
            </div>
          </div>
          <div className="util-buttons">
            <h4>Options:</h4>
            <CustomButton
              onClick={() => navigate(`/projects/${id}/edit`)}
              text={"Edit Project"}
              className={"edit-button"}
            />
            <CustomButton
              onClick={() => navigate(`/projects/${id}/assign`)}
              text={"Assign People"}
              className={"assign-people-button"}
            />
            <CustomButton
              onClick={() => setIsLabelsModalOpen(true)}
              text={"Labels"}
              className={"edit-button"}
            />
            <CustomButton
              className={"delete-button"}
              onClick={() => setQuestionIsOpen(true)}
              text={"Delete Project"}
            />
            <CustomButton
              className={(isActive ? 
                "change-status-button-activate" :
                "change-status-button-deactivate")}
              onClick={handleProjectStatusChange}
              text={(isActive ? "Deactivate" : "Activate")}
            />
          </div>
        </div>
      </div>
      
      <hr></hr>
      
      <h3>Issues in this project</h3>
      <div className="search-wrapper">
        <input
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search issues in this project..."
        />
      </div>
      <div className="list-controls">
        
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest created</option>
          <option value="priority">Priority</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
      {filteredIssues.length === 0 ? (
        <p>No issues yet.</p>
      ) : (
        <div className="project-details-issues">
          {filteredIssues.map((issue, idx) => (
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
