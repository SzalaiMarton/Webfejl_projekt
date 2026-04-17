import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import PopupCard from "../components/PopupCard.jsx";
import { useState, useEffect } from "react";
import InputField from "../components/InputField.jsx";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import CustomButton from "../components/CustomButton.jsx";
import ProjectService from "../services/ProjectService.js";
import { useStore } from "../services/StoreContext.jsx";

function CreateProjectPage() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { dispatch } = useStore();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleCreateProject = async () => {
    if (!title || title.trim().length === 0) {
      setErrorMessage("Please fill in title and select a project");
      setIsErrorOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error("UserID not found");
      }
      
      const project = await ProjectService.createProject(
        title,
        description
      );

      if (project) {
        dispatch({ type: 'ADD_PROJECT', payload: { project, issues: [], labels: [] } });
      }

      setIsSuccessOpen(true);
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
    }
    catch (error) {
      setErrorMessage("Something went wrong " + error);
      setIsErrorOpen(true);
      setIsLoading(false);
    }
    finally {
      setIsLoading(false);
    }
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
        message="Project created successfully!"
        onClose={() => setIsSuccessOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
        title={"Success!"}
      />
      <div className="create-project-form">
        <div>
          <h2>Create New Project</h2>
          <p>Use this form to create a new project.</p>
          <div className="create-project-form-title">
            <TitleBar
              title={"Title:"}
              isRequired={true}
            />
            <InputField
              isRequired={true}
              type="text"
              placeholderText="Project title"
              textValue={(v) => setTitle(v)}
              disabled={isLoading}
            />
          </div>

          <div className="create-project-form-desc">
            <TitleBar
              title={"Description:"}
              isRequired={false}
            />
            <AutoResizeTextarea 
              maxChar={800}
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
            <p>Maximum character length: 800</p>
          </div>

          <CustomButton
            className={"create-project-form-create-button"}
            onClick={handleCreateProject}
            disabled={isLoading}
            text={(isLoading ? "Creating..." : "Create Project")}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateProjectPage;
