export class Label {
  constructor(id, projectId, name, color, description = '') {
    this.id = id;
    this.projectId = projectId; // Project.id
    this.name = name;
    this.color = color; // hex color code
    this.description = description;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const label = new Label(data.id, data.projectId, data.name, data.color, data.description);
    label.createdAt = data.createdAt;
    label.updatedAt = data.updatedAt;
    return label;
  }
}
