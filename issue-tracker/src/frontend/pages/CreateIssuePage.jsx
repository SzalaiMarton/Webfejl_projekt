import AutoResizeTextarea from "../components/AutoResizeTextarea";
import RequiredFieldText from "../components/RequiredFieldText";

function CreateIssuePage() {
  return (
    <div className="container">
      <form className="create-issue-form">
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
            <input 
              maxLength={20} 
              required={true} 
              type="text" 
              placeholder="Issue title"/>
          </div>
          <div className="create-issue-form-desc">
            <label>Description:</label>
            <AutoResizeTextarea 
            maxChar={800}
            placeholder="Issue Description"></AutoResizeTextarea>
            <p>Maximum character length: 800</p>
          </div>
          <button className="create-issue-form-create-button" type="submit">
            Create Issue
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateIssuePage;
