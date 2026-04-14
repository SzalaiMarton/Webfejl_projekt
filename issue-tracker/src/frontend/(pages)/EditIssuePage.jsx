import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import RequiredField from "../components/RequiredField.jsx";
import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import ProjectService from "../services/ProjectService.js";

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
  const [isTitleValid, setIsTitleValid] = useState(false);

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
      alert('Error loading issue: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isTitleValid) {
      alert('Please enter a valid title');
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
      alert('Error saving issue: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (!issue) return <div className="container"><h2>Issue not found</h2></div>;

  return (
    <div className="container">
      <h2>Edit Issue</h2>
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
            <RequiredField required={true} type="text" placeholder="Issue title" isValid={(v)=>setIsTitleValid(v)} value={title} onChange={(e)=>setTitle(e.target.value)} disabled={isSaving} />
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

          <button onClick={handleSave} disabled={isSaving} className="create-issue-form-create-button">
            {isSaving ? 'Saving...' : 'Save Issue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditIssuePage;
