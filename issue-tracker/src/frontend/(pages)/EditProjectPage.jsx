import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectService from "../services/ProjectService.js";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import InputField from "../components/InputField.jsx";
import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import PopupCard from "../components/PopupCard.jsx";
import CustomButton from "../components/CustomButton.jsx";

function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

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
      setErrorMessage("Error loading project: " + err.message);
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
      await ProjectService.updateProject(id, { name: title, description });
      navigate(`/projects/${id}`);
    } catch (err) {
      setErrorMessage('Error updating project: ' + err.message);
      setIsErrorOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (!project) return <div className="container"><h2>Project not found</h2></div>;

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
      <h2>Edit Project</h2>
      <div className="create-project-form">
        <div>
          <div className="create-project-form-title">
            <TitleBar title={"Title:"} isRequired={true} />
            <InputField
              isRequired={true}
              type="text"
              placeholderText="Project title"
              textValue={(v) => setTitle(v)}
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

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <CustomButton
              className={"cancel-button"}
              onClick={() => setIsCancelOpen(true)}
              disabled={isSaving}
              text={"Cancel"}
              type="button"
            />
            <button onClick={handleSave} disabled={isSaving} className="create-project-form-create-button">
              {isSaving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
          <PopupCard
            isOpen={isCancelOpen}
            message={"Discard changes and go back?"}
            title={"Confirm"}
            onClose={() => setIsCancelOpen(false)}
            onConfirm={() => { setIsCancelOpen(false); navigate(`/projects/${id}`); }}
            innerClassName="confirm-card-message"
            outerClassName="confirm-card-container"
            confirmText="Discard"
            cancelText="Keep Editing"
          />
        </div>
      </div>
    </div>
  );
}

export default EditProjectPage;
