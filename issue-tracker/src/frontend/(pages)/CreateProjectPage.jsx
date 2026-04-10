import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import PopupCard from "../components/PopupCard.jsx";
import { useState, useEffect } from "react";
import RequiredField from "../components/RequiredField.jsx";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";
import CustomButton from "../components/CustomButton.jsx";
import ProjectService from "../services/ProjectService.js";

function CreateProjectPage() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(false);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleCreateProject = async () => {
    if (!isTitleValid) {
      setErrorMessage("Please fill in title and select a project");
      setIsErrorOpen(true);
      return;
    }

    setIsLoading(true);
    let currentUser = null;

    try {
      currentUser = AuthService.getCurrentUserFromStorage();
      if (!currentUser) {
        currentUser = AuthService.getCurrentUser();
      }
      if (!currentUser) {
        throw new Error("UserID not found");
      }
    }
    catch (error) {
      setErrorMessage("Something went wrong " + error);
      setIsErrorOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      await ProjectService.createProject(
        title,
        description
      );

      setIsSuccessOpen(true);
      /*setTimeout(() => {
        navigate("/projects");
      }, 2000);*/
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
            <RequiredField 
              required={true} 
              type="text"
              placeholder="Project title"
              isValid={(isValid) => setIsTitleValid(isValid)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
