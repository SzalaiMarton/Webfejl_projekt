import AutoResizeTextarea from "../components/AutoResizeTextarea";
import PopupCard from "../components/PopupCard";
import { useState, useEffect } from "react";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import ProjectService from "../services/ProjectService.js";
import IssueService from "../services/IssueService.js";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import { useStore } from "../services/StoreContext.jsx";
import CustomButton from "../components/CustomButton.jsx";

function CreateIssuePage() {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const { dispatch } = useStore();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    try {
      const data = await ProjectService.getCurrentUserProjects();
      
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      setErrorMessage("Error loading projects: " + err.message);
      setIsErrorOpen(true);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateIssue = async () => {
    if ((!title || title.trim().length === 0) && !selectedProjectId) {
      setErrorMessage("Please fill in the title and select a project.");
      setIsErrorOpen(true);
      return;
    }
    else if (!title || title.trim().length === 0) {
      setErrorMessage("Please fill in the title.");
      setIsErrorOpen(true);
      return;
    }
    else if (!selectedProjectId) {
      setErrorMessage("Please select a project.");
      setIsErrorOpen(true);
      return;
    }


    setIsLoading(true);
    try {
      await IssueService.createIssue(
        selectedProjectId,
        title,
        description,
        priority
      );

      dispatch({ type: 'ADD_ISSUE', payload: {
        id: 'temp-' + Date.now(),
        projectId: selectedProjectId,
        title,
        description,
        priority,
        status: 'open',
        labels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }});

      setIsSuccessOpen(true);
      setTimeout(() => {
        navigate(`/projects/${selectedProjectId}`);
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create issue");
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProjects) {
    return <div className="container"><h2>Loading projects...</h2></div>;
  }

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
      <PopupCard 
        isOpen={isSuccessOpen}
        message="Issue created successfully!"
        onClose={() => setIsSuccessOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
        title={"Success!"}
      />
      <div className="create-issue-form">
        <div>
          <h2>Create New Issue</h2>
          <p>Use this form to create a new issue.</p>
          
          <div className="create-issue-form-project-picker">
            <TitleBar
              title={"Project:"}
              isRequired={true}
            />
            <select 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.project.id} value={project.project.id}>
                  {project.project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="create-issue-form-title">
            <TitleBar
              title={"Title:"}
              isRequired={true}
            />
            <InputField
              isRequired={true}
              type="text"
              placeholderText="Issue title"
              textValue={(v) => setTitle(v)}
              disabled={isLoading}
            />
          </div>

          <div className="create-issue-form-desc">
            <TitleBar
              title={"Description:"}
              isRequired={false}
            />
            <AutoResizeTextarea 
              maxChar={800}
              placeholder="Issue Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
            <p>Maximum character length: 800</p>
          </div>

          <div className="create-issue-form-priority">
            <TitleBar
              title={"Priority:"}
              isRequired={false}
            />
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isLoading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <CustomButton
            className="create-issue-form-create-button"
            onClick={handleCreateIssue}
            disabled={isLoading}
            text={isLoading ? "Creating..." : "Create Issue"}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateIssuePage;
