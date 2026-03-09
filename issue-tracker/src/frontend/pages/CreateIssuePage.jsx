import React from "react";

function CreateIssuePage() {
  return (
    <div className="container">
      <form className="create-issue-form">
        <div>
          <h2>Create New Issue</h2>
          <p>Use this form to create a new issue.</p>
          <div className="create-issue-form-project-picker">
            <label>Project:</label>
            <select>
              <option>Project 1</option>
              <option>Project 2</option>
              <option>Project 3</option>
              <option>Project 4</option>
            </select>
          </div>
          <div className="create-issue-form-title">
            <label>Title:</label>
            <input type="text" placeholder="Issue title" />
          </div>
          <div className="create-issue-form-desc">
            <label>Description:</label>
            <textarea placeholder="Issue description"></textarea>
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
