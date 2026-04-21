export class Label {
  constructor(id, projectId, name, color, createdById = null) {
    this.id = id;
    this.projectId = projectId;
    this.name = name;
    this.color = color; // hex color code
    this.createdById = createdById;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const label = new Label(data.id, data.projectId || null, data.name, data.color, data.createdById || null);
    label.createdAt = data.createdAt;
    label.updatedAt = data.updatedAt;
    return label;
  }
}
