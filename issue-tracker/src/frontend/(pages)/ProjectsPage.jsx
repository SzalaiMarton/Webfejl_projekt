import { useEffect, useMemo, useState } from "react";
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated-desc');
  const { state, dispatch } = useStore();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const status = params.get('status') || 'all';
    const sort = params.get('sort') || 'updated-desc';
    setSearch(q);
    setStatusFilter(status);
    setSortBy(sort);
  }, [location.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

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

  const filteredProjects = useMemo(() => {
    const list = state.projects && state.projects.length ? state.projects : projects;
    const filtered = list.filter((projectEntry) => {
      const projectData = projectEntry?.project || projectEntry;
      const projectName = projectData?.name || "";
      const projectDescription = projectData?.description || "";
      const matchesSearch = !debouncedSearch
        || projectName.toLowerCase().includes(debouncedSearch)
        || projectDescription.toLowerCase().includes(debouncedSearch);
      const matchesStatus = statusFilter === 'all' || projectData?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      const left = a.project || a;
      const right = b.project || b;
      if (sortBy === 'name-asc') return (left.name || '').localeCompare(right.name || '');
      if (sortBy === 'name-desc') return (right.name || '').localeCompare(left.name || '');
      if (sortBy === 'updated-asc') return new Date(left.updatedAt) - new Date(right.updatedAt);
      return new Date(right.updatedAt) - new Date(left.updatedAt);
    });
  }, [debouncedSearch, projects, sortBy, state.projects, statusFilter]);

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
            if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter); else params.delete('status');
            if (sortBy && sortBy !== 'updated-desc') params.set('sort', sortBy); else params.delete('sort');
            const newSearch = params.toString() ? `?${params.toString()}` : '';
            navigate(`${location.pathname}${newSearch}`, { replace: true });
          }}
        />
      </div>
      <div className="list-controls">
        <select
          value={statusFilter}
          onChange={(e) => {
            const value = e.target.value;
            setStatusFilter(value);
            const params = new URLSearchParams(location.search);
            if (search) params.set('q', search); else params.delete('q');
            if (value !== 'all') params.set('status', value); else params.delete('status');
            if (sortBy !== 'updated-desc') params.set('sort', sortBy); else params.delete('sort');
            const newSearch = params.toString() ? `?${params.toString()}` : '';
            navigate(`${location.pathname}${newSearch}`, { replace: true });
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(value);
            const params = new URLSearchParams(location.search);
            if (search) params.set('q', search); else params.delete('q');
            if (statusFilter !== 'all') params.set('status', statusFilter); else params.delete('status');
            if (value !== 'updated-desc') params.set('sort', value); else params.delete('sort');
            const newSearch = params.toString() ? `?${params.toString()}` : '';
            navigate(`${location.pathname}${newSearch}`, { replace: true });
          }}
        >
          <option value="updated-desc">Latest updated</option>
          <option value="updated-asc">Oldest updated</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>
      
      {error && (
        <div className="error-banner">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <p>Loading projects...</p>
      ) : (filteredProjects.length === 0 ? (
        <p>No projects yet. Create one to get started!</p>
      ) : (
        <div className="grid">
          {filteredProjects.map((project) => (
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
