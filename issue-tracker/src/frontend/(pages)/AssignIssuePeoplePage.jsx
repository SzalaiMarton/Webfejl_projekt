import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import IssueService from "../services/IssueService.js";
import ProjectService from "../services/ProjectService.js";
import UserService from "../services/UserService.js";
import PopupCard from "../components/PopupCard.jsx";
import CustomButton from "../components/CustomButton.jsx";
import TitleBar from "../components/TitleBar.jsx";

function AssignIssuePeoplePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadData();
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoading && !issue) {
      navigate("/not-found", { replace: true });
    }
  }, [isLoading, issue, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const issueData = await IssueService.getIssueById(id);
      const [projectData, allUsers] = await Promise.all([
        ProjectService.getProjectById(issueData.projectId),
        UserService.getAllUsers(),
      ]);

      const loadedProject = projectData.project;
      const projectUsers = allUsers.filter(
        (user) =>
          user.id === loadedProject.ownerId ||
          (user.assignedProjects || []).includes(loadedProject.id)
      );

      setIssue(issueData);
      setProject(loadedProject);
      setUsers(projectUsers);
      setSelectedUserId(issueData.assignedToId || "");
      setError(null);
    } catch (err) {
      setError(err.message);
      setErrorMessage(err.message || "Failed to load issue assignment data.");
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAssignment = async () => {
    if (!issue) return;

    setIsSaving(true);

    try {
      if (selectedUserId) {
        await IssueService.assignIssue(issue.id, selectedUserId);
      } else {
        await IssueService.unassignIssue(issue.id);
      }

      setIssue((current) => ({
        ...current,
        assignedToId: selectedUserId || null,
      }));
      setIsSuccessOpen(true);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update issue assignment.");
      setIsErrorOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error && !issue) return <div className="container"><h2>Error: {error}</h2></div>;

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
        message="Issue assignee updated successfully!"
        onClose={() => setIsSuccessOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
        title={"Success!"}
      />

      <CustomButton
        onClick={() => navigate(`/issues/${id}`)}
        className={"back-button"}
        text={"◀ Back"}
        type="button"
      />

      <div className="create-issue-form">
        <div>
          <h2>Assign Person To Issue</h2>
          <p>Select who should work on {issue?.title}.</p>

          <div className="create-issue-form-project-picker">
            <TitleBar
              title={"Project:"}
              isRequired={false}
            />
            <p className="assign-people-context-text">{project?.name}</p>
          </div>

          <div className="create-issue-form-project-picker">
            <TitleBar
              title={"Assignee:"}
              isRequired={false}
            />
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isSaving}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <CustomButton
            className={"create-issue-form-create-button"}
            onClick={handleSaveAssignment}
            disabled={isSaving}
            text={isSaving ? "Saving..." : "Save Issue Assignee"}
          />
        </div>
      </div>
    </div>
  );
}

export default AssignIssuePeoplePage;
