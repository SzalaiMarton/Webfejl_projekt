import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectService from "../services/ProjectService.js";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import RequiredField from "../components/RequiredField.jsx";
import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";

function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(false);

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
      const resp = await ProjectService.getProjectById(id);
      setProject(resp.project);
      setTitle(resp.project.name || "");
      setDescription(resp.project.description || "");
    } catch (err) {
      alert("Error loading project: " + err.message);
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
      await ProjectService.updateProject(id, { name: title, description });
      navigate(`/projects/${id}`);
    } catch (err) {
      alert('Error updating project: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (!project) return <div className="container"><h2>Project not found</h2></div>;

  return (
    <div className="container">
      <h2>Edit Project</h2>
      <div className="create-project-form">
        <div>
          <div className="create-project-form-title">
            <TitleBar title={"Title:"} isRequired={true} />
            <RequiredField
              required={true}
              type="text"
              placeholder="Project title"
              isValid={(isValid) => setIsTitleValid(isValid)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="create-project-form-desc">
            <TitleBar title={"Description:"} isRequired={false} />
            <AutoResizeTextarea
              maxChar={800}
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
            />
            <p>Maximum character length: 800</p>
          </div>

          <button onClick={handleSave} disabled={isSaving} className="create-project-form-create-button">
            {isSaving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProjectPage;
