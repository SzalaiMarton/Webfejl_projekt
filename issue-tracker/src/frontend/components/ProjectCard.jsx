function ProjectCard({ project }) {
  return (
    <article className="card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <button>Open</button>
    </article>
  );
}

export default ProjectCard;