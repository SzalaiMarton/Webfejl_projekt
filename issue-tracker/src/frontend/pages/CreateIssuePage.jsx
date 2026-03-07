import React from "react";

function CreateIssuePage() {
  return (
    <div className="container">
      <h2>Create New Issue</h2>
      <p>Use this form to create a new issue.</p>
      <form>
        <div>
          <label>Title:</label>
          <input type="text" placeholder="Issue title" />
        </div>
        <div>
          <label>Description:</label>
          <textarea placeholder="Issue description"></textarea>
        </div>
        <button type="submit">Create Issue</button>
      </form>
    </div>
  );
}

export default CreateIssuePage;
