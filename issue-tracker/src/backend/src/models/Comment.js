export class Comment {
  constructor(id, issueId, authorId, content) {
    this.id = id;
    this.issueId = issueId; // Issue.id
    this.authorId = authorId; // User.id
    this.content = content;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const comment = new Comment(data.id, data.issueId, data.authorId, data.content);
    comment.createdAt = data.createdAt;
    comment.updatedAt = data.updatedAt;
    return comment;
  }
}
