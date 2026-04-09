export class Issue {
  constructor(
    id,
    projectId,
    title,
    description,
    createdById,
    priority = 'medium',
    status = 'open',
    assignedToId = null,
    labels = []
  ) {
    this.id = id;
    this.projectId = projectId; // Project.id
    this.title = title;
    this.description = description;
    this.createdById = createdById; // User.id
    this.assignedToId = assignedToId; // User.id | null
    this.priority = priority; // 'low' | 'medium' | 'high' | 'critical'
    this.status = status; // 'open' | 'in_progress' | 'blocked' | 'resolved' | 'closed'
    this.labels = labels; // [Label.id]
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const issue = new Issue(
      data.id,
      data.projectId,
      data.title,
      data.description,
      data.createdById,
      data.priority,
      data.status,
      data.assignedToId,
      data.labels || []
    );
    issue.createdAt = data.createdAt;
    issue.updatedAt = data.updatedAt;
    return issue;
  }
}
