import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";

function ProjectCard({ project, onClick }) {
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCreator() {
      try {
        const c = await UserService.getUserById(project.project.ownerId);
        if (mounted) setCreator(c);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCreator();
    return () => { mounted = false; };
  }, [project.project.ownerId]);

  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3>{project.project.name}</h3>
        <div 
          className="issue-data"
          style={{alignItems: "center", paddingTop:"20px"}}
        >
          <h3 className="project-card-member-count-text">
            Creator: {creator ? creator.username : "Unknown"}</h3>
          <h3 className="project-card-member-count-text">
            Status: <span 
              className={(project.project.status === "active" ? "text-green" : "text-red")}
            >{project.project.status}</span></h3>
        </div>
      </div>
      {project.labels && project.labels.length > 0 ? (
        <div className="project-card-labels">
          {project.labels.map((label) => (
            <span
              key={label.id}
              className="label-chip"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="project-card-context">
        <p>{project.project.description}</p>
      </div>
      <div className="project-card-footer">
        <button onClick={onClick}>Open</button>
      </div>
    </article>
  );
}

export default ProjectCard;
