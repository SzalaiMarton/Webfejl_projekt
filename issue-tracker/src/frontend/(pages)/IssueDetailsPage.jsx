import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import CommentService from "../services/CommentService.js";
import AuthService from "../services/AuthService.js";

function IssueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadIssue();
  }, [id, navigate]);

  const loadIssue = async () => {
    try {
      setIsLoading(true);
      const issueData = await IssueService.getIssueById(id);
      setIssue(issueData);
      
      const commentsData = await CommentService.getIssueComments(id);
      setComments(commentsData);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error loading issue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsPosting(true);
      const comment = await CommentService.createComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment("");
    } catch (err) {
      alert("Error adding comment: " + err.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await CommentService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert("Error deleting comment: " + err.message);
    }
  };

  const handleDeleteIssue = async () => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      await IssueService.deleteIssue(id);
      navigate("/projects");
    } catch (err) {
      alert("Error deleting issue: " + err.message);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error) return <div className="container"><h2>Error: {error}</h2></div>;
  if (!issue) return <div className="container"><h2>Issue not found</h2></div>;

  return (
    <div className="container">
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <p><strong>Priority:</strong> {issue.priority}</p>
          <p><strong>Status:</strong> {issue.status}</p>
          <p><strong>Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          {issue.assignedToId && <p><strong>Assigned to:</strong> {issue.assignedToId}</p>}
          {issue.labels && issue.labels.length > 0 && (
            <p><strong>Labels:</strong> {issue.labels.join(", ")}</p>
          )}
        </div>
      </div>

      <button onClick={handleDeleteIssue} style={{ marginBottom: "2rem", padding: "0.5rem 1rem", backgroundColor: "#fee", color: "#c00" }}>
        Delete Issue
      </button>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(`/issues/${id}/edit`)} style={{ marginRight: '0.5rem' }}>
          Edit Issue
        </button>
      </div>

      <h3>Comments ({comments.length})</h3>
      
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ padding: "1rem", borderLeft: "3px solid #ddd", marginBottom: "1rem" }}>
              <p><strong>{comment.authorId}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
              <p>{comment.content}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
        <h4>Add Comment</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          rows={4}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          disabled={isPosting}
        />
        <button
          onClick={handleAddComment}
          disabled={isPosting || !newComment.trim()}
          style={{ padding: "0.5rem 1rem" }}
        >
          {isPosting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
}

export default IssueDetailsPage;
