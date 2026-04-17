import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import CommentService from "../services/CommentService.js";
import AuthService from "../services/AuthService.js";
import CustomButton from "../components/CustomButton.jsx";
import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import PopupCard from "../components/PopupCard.jsx";

function IssueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    loadIssue();
  }, [id, navigate]);

  useEffect(() => {
    if (!isLoading && !issue) {
      navigate('/not-found', { replace: true });
    }
  }, [isLoading, issue, navigate]);

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
      setErrorMessage("Error adding comment: " + err.message);
      setIsErrorOpen(true);
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
      setErrorMessage("Error deleting comment: " + err.message);
      setIsErrorOpen(true);
    }
  };

  const handleDeleteIssue = async () => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      await IssueService.deleteIssue(id);
      navigate("/projects");
    } catch (err) {
      setErrorMessage("Error deleting issue: " + err.message);
      setIsErrorOpen(true);
    }
  };

  if (isLoading) return <div className="container"><h2>Loading...</h2></div>;
  if (error) return <div className="container"><h2>Error: {error}</h2></div>;

  return (
    <div className="container">
      <PopupCard
        isOpen={isErrorOpen}
        message={errorMessage}
        onClose={() => setIsErrorOpen(false)}
        innerClassName="error-card-message"
        outerClassName="error-card-container"
        title={"Error!"}
      />
      <CustomButton
        onClick={() => navigate(-1)}
        className={"back-button"}
        text={"◀ Back"}
        type="button"
      />
      
      
      <hr></hr>

      <div className="utils">
        <div className="issue-details-left">
          <h2>{issue.title}</h2>
          <div className="util-desc">
            {issue.description.length > 0 ? 
            (<p>{issue.description}</p>) : 
            (<p>No description provided.</p>)
            }
          </div>
          <div>
            {issue.assignedToId && <p><strong>Assigned to:</strong> {issue.assignedToId}</p>}
            {issue.labels && issue.labels.length > 0 && (
              <p><strong>Labels:</strong> {issue.labels.join(", ")}</p>
            )}
          </div>
        </div>
        <div className="issue-details-right">
          <div className="issue-data">
            <p><strong>Priority:</strong> {issue.priority}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="util-buttons">
            <h4>Options:</h4>
            <CustomButton
              onClick={() => navigate(`/issues/${id}/edit`)}
              className={"edit-button"}
              text={"Edit Issue"}
            />
            <CustomButton
              onClick={handleDeleteIssue}
              className={"delete-button"}
              text={"Delete Issue"}
            />
          </div>
        </div>
      </div>

      <hr></hr>
      
      <h3>Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <p><strong>{comment.authorId}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
              <p>{comment.content}</p>
              <CustomButton
                type="button"
                onClick={() => handleDeleteComment(comment.id)}
                className={"comment-delete-btn"}
                text={"Delete"}
              />
            </div>
          ))}
        </div>
      )}
      <div className="issue-details-comment-compose">
        <h4>Add Comment</h4>
        <AutoResizeTextarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          className={"textarea-compose"}
          disabled={isPosting}
        />
        <CustomButton
          type="button"
          onClick={handleAddComment}
          disabled={isPosting || !newComment.trim()}
          className={"post-button"}
          text={isPosting ? "Posting..." : "Post Comment"}
        />
      </div>
    </div>
  );
}

export default IssueDetailsPage;
