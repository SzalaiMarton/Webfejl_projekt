export class Attachment {
  constructor(id, fileName, fileUrl, fileSize, mimeType, issueId = null, commentId = null) {
    this.id = id;
    this.issueId = issueId; // Issue.id | null
    this.commentId = commentId; // Comment.id | null
    this.fileName = fileName;
    this.fileUrl = fileUrl;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
    this.uploadedAt = new Date().toISOString();
  }

  static fromJSON(data) {
    const attachment = new Attachment(
      data.id,
      data.fileName,
      data.fileUrl,
      data.fileSize,
      data.mimeType,
      data.issueId,
      data.commentId
    );
    attachment.uploadedAt = data.uploadedAt;
    return attachment;
  }
}
