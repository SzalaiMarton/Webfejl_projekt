import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProjectService from "../services/ProjectService.js";
import AuthService from "../services/AuthService.js";

function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await ProjectService.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="container">
      <h2>Projects</h2>
      <p>Manage your projects here.</p>
      
      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fee", color: "#c00", marginBottom: "1rem" }}>
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Create one to get started!</p>
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <div key={project.id} onClick={() => handleProjectClick(project.id)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
