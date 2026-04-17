import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import InputField from "../components/InputField.jsx";
import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import ProjectService from "../services/ProjectService.js";
import PopupCard from "../components/PopupCard.jsx";
import CustomButton from "../components/CustomButton.jsx";

function EditIssuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadData();
  }, [id, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [issueData, projectList] = await Promise.all([
        IssueService.getIssueById(id),
        ProjectService.getAllProjects()
      ]);

      setIssue(issueData);
      setTitle(issueData.title || '');
      setDescription(issueData.description || '');
      setPriority(issueData.priority || 'medium');
      setSelectedProjectId(issueData.projectId || '');
      setProjects(projectList);
    } catch (err) {
      setErrorMessage('Error loading issue: ' + err.message);
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || title.trim().length === 0) {
      setErrorMessage('Please enter a valid title');
      setIsErrorOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      await IssueService.updateIssue(id, {
        title,
        description,
        priority,
        projectId: selectedProjectId
      });
      navigate(`/issues/${id}`);
    } catch (err) {
      setErrorMessage('Error saving issue: ' + err.message);
      setIsErrorOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (!issue) return <div className="container"><h2>Issue not found</h2></div>;

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
      <div className="edit-issue-header">
        <h2>Edit Issue</h2>

      </div>
      <div className="create-issue-form">
        <div>
          <div className="create-issue-form-project-picker">
            <TitleBar title={"Project:"} isRequired={true} />
            <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} disabled={isSaving}>
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="create-issue-form-title">
            <TitleBar title={"Title:"} isRequired={true} />
            <InputField isRequired={true} type="text" placeholderText="Issue title" textValue={(v) => setTitle(v)} disabled={isSaving} />
          </div>

          <div className="create-issue-form-desc">
            <TitleBar title={"Description:"} isRequired={false} />
            <AutoResizeTextarea maxChar={800} placeholder="Issue Description" value={description} onChange={(e)=>setDescription(e.target.value)} disabled={isSaving} />
          </div>

          <div className="create-issue-form-priority">
            <TitleBar title={"Priority:"} isRequired={false} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={isSaving}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <CustomButton
              className={"cancel-button"}
              onClick={() => setIsCancelOpen(true)}
              disabled={isSaving}
              text={"Cancel"}
              type="button"
            />
            <button onClick={handleSave} disabled={isSaving} className="create-issue-form-create-button">
              {isSaving ? 'Saving...' : 'Save Issue'}
            </button>
          </div>
          <PopupCard
            isOpen={isCancelOpen}
            message={"Discard changes and go back?"}
            title={"Confirm"}
            onClose={() => setIsCancelOpen(false)}
            onConfirm={() => { setIsCancelOpen(false); navigate(`/issues/${id}`); }}
            innerClassName="confirm-card-message"
            confirmText="Discard"
            cancelText="Keep Editing"
          />
        </div>
      </div>
    </div>
  );
}

export default EditIssuePage;
