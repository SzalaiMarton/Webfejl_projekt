import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import ProjectService from "../services/ProjectService.js";
import UserService from "../services/UserService.js";
import PopupCard from "../components/PopupCard.jsx";
import CustomButton from "../components/CustomButton.jsx";

function AssignProjectPeoplePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
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
    if (!isLoading && !project) {
      navigate("/not-found", { replace: true });
    }
  }, [isLoading, project, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [projectData, allUsers] = await Promise.all([
        ProjectService.getProjectById(id),
        UserService.getAllUsers(),
      ]);

      const loadedProject = projectData.project;
      setProject(loadedProject);
      setUsers(allUsers);

      const assignedUserIds = allUsers
        .filter((user) =>
          user.id === loadedProject.ownerId ||
          (user.assignedProjects || []).includes(loadedProject.id)
        )
        .map((user) => user.id);

      setSelectedUserIds(assignedUserIds);
      setError(null);
    } catch (err) {
      setError(err.message);
      setErrorMessage(err.message || "Failed to load project assignment data.");
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUser = (userId) => {
    if (userId === project?.ownerId) return;

    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  const handleSaveAssignments = async () => {
    if (!project) return;

    const originalAssignedUserIds = users
      .filter((user) =>
        user.id === project.ownerId ||
        (user.assignedProjects || []).includes(project.id)
      )
      .map((user) => user.id);

    const userIdsToAssign = selectedUserIds.filter((userId) => !originalAssignedUserIds.includes(userId));
    const userIdsToRemove = originalAssignedUserIds.filter((userId) => !selectedUserIds.includes(userId));

    setIsSaving(true);

    try {
      await Promise.all([
        ...userIdsToAssign.map((userId) => ProjectService.assignUserToProject(project.id, userId)),
        ...userIdsToRemove.map((userId) => ProjectService.removeUserFromProject(project.id, userId)),
      ]);

      setUsers((currentUsers) =>
        currentUsers.map((user) => ({
          ...user,
          assignedProjects: selectedUserIds.includes(user.id)
            ? Array.from(new Set([...(user.assignedProjects || []), project.id]))
            : (user.assignedProjects || []).filter((projectId) => projectId !== project.id),
        }))
      );

      setIsSuccessOpen(true);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update project assignments.");
      setIsErrorOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error && !project) return <div className="container"><h2>Error: {error}</h2></div>;

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
        message="Project members updated successfully!"
        onClose={() => setIsSuccessOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
        title={"Success!"}
      />

      <CustomButton
        onClick={() => navigate(`/projects/${id}`)}
        className={"back-button"}
        text={"◀ Back"}
        type="button"
      />

      <div className="create-project-form">
        <div>
          <h2>Assign People To Project</h2>
          <p>Choose which users should be part of {project?.name}.</p>

          <div className="assign-people-list">
            {users.length === 0 ? (
              <p>No users available.</p>
            ) : (
              users.map((user) => (
                <label key={user.id} className="assign-people-item">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleToggleUser(user.id)}
                    disabled={isSaving || user.id === project.ownerId}
                  />
                  <span>{user.username}{user.id === project.ownerId ? " (Owner)" : ""}</span>
                </label>
              ))
            )}
          </div>

          <CustomButton
            className={"create-project-form-create-button"}
            onClick={handleSaveAssignments}
            disabled={isSaving}
            text={isSaving ? "Saving..." : "Save Project Members"}
          />
        </div>
      </div>
    </div>
  );
}

export default AssignProjectPeoplePage;
