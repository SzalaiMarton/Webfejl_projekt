import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProjectService from "../services/ProjectService.js";
import { useStore } from "../services/StoreContext.jsx";
import { useLocation } from "react-router-dom";
import AuthService from "../services/AuthService.js";

function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const { state, dispatch } = useStore();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearch(q);
  }, [location.search]);

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
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        console.log("Error user not found.");
        throw new Error("Error user not found.");
      }

      const dataIds = [...user.createdProjects, ...user.assignedProjects];
      const data = await Promise.all(
        dataIds.map((value) => ProjectService.getProjectById(value))
      );

      dispatch({ type: 'SET_PROJECTS', payload: data });
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

  function filteredProjects() {
    const list = state.projects && state.projects.length ? state.projects : projects;
    if (!search || search.trim() === '') return list;
    const s = search.toLowerCase();
    return list.filter(p => (p.name || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
  }

  return (
    <div className="container">
      <h2>Projects</h2>
      <p>Manage your projects here.</p>
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            const params = new URLSearchParams(location.search);
            if (value) params.set('q', value); else params.delete('q');
            const newSearch = params.toString() ? `?${params.toString()}` : '';
            navigate(`${location.pathname}${newSearch}`, { replace: true });
          }}
        />
      </div>
      
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <p>Loading projects...</p>
      ) : (filteredProjects().length === 0 ? (
        <p>No projects yet. Create one to get started!</p>
      ) : (
        <div className="grid">
          {filteredProjects().map((project) => (
            <div key={project.project.id}>
              <ProjectCard
                onClick={() => handleProjectClick(project.project.id)}
                project={project}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export default ProjectsPage;
