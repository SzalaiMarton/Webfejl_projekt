import AutoResizeTextarea from "../components/AutoResizeTextarea";
import RequiredFieldText from "../components/RequiredFieldText";
import ErrorCard from "../components/ErrorCard";
import { useState } from "react";
import RequiredField from "../components/RequiredField";

function CreateIssuePage() {
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const onClickHandler = () => {
    if (!isTitleValid) {
      setIsErrorOpen(true);
      return;
    }
  }

  return (
    <div className="container">
      <ErrorCard 
        isOpen={isErrorOpen}
        message="Creation failed, fill in the title or choose a project."
        onClose={() => setIsErrorOpen(false)}
      />
      <div className="create-issue-form">
        <div>
          <h2>Create New Issue</h2>
          <p>Use this form to create a new issue.</p>
          <div className="create-issue-form-project-picker">
            <titlebar>
              <label>Project:</label>
              <RequiredFieldText/>
            </titlebar>
            <select required={true}>
              <option>Project 1</option>
              <option>Project 2</option>
              <option>Project 3</option>
              <option>Project 4</option>
            </select>
          </div>
          <div className="create-issue-form-title">
            <titlebar>
              <label>Title:</label>
              <RequiredFieldText/>
            </titlebar>
            <RequiredField 
              required={true} 
              maxChar={17} 
              type="text"
              placeholder="Issue title"
              isValid={(isValid) => setIsTitleValid(isValid)}
            />
          </div>
          <div className="create-issue-form-desc">
            <label>Description:</label>
            <AutoResizeTextarea 
            maxChar={800}
            placeholder="Issue Description"></AutoResizeTextarea>
            <p>Maximum character length: 800</p>
          </div>
          <button className="create-issue-form-create-button" onClick={onClickHandler}>
            Create Issue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateIssuePage;
