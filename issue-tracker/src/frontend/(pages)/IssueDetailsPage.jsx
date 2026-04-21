import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IssueService from "../services/IssueService.js";
import CommentService from "../services/CommentService.js";
import AuthService from "../services/AuthService.js";
import CustomButton from "../components/CustomButton.jsx";
import AutoResizeTextarea from "../components/AutoResizeTextarea.jsx";
import PopupCard from "../components/PopupCard.jsx";
import UserService from "../services/UserService.js";
import LabelService from "../services/LabelService.js";
import ProjectService from "../services/ProjectService.js";

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
  const [isOpen, setIsOpen] = useState(false);
  const [issuePriority, setIssuePriority] = useState("text-orange");
  const [commentAuthors, setCommentAuthors] = useState({});
  const [issueLabels, setIssueLabels] = useState([]);
  const [assignedUserName, setAssignedUserName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [questionCommentIsOpen, setQuestionCommentIsOpen] = useState(false);
  const [questionIssueIsOpen, setQuestionIssueIsOpen] = useState(false);
  const [toBeDeletedComment, setToBeDeletedComment] = useState("");

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
      setIsOpen(issueData.status === "open" || issueData.status === "in_progress" || issueData.status === "blocked");

      if (issueData.priority === "low") {
        setIssuePriority("text-green");
      } else if (issueData.priority === "medium") {
        setIssuePriority("text-orange");
      } else if (issueData.priority === "high") {
        setIssuePriority("text-red");
      } else if (issueData.priority === "critical") {
        setIssuePriority("text-red");
      }

      const commentsData = await CommentService.getIssueComments(id);
      setComments(commentsData);
      await loadCommentAuthors(commentsData);
      await loadIssueRelations(issueData);

      setError(null);
    } catch (err) {
      setError("Something went wrong.");
      console.error("Error loading issue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIssueRelations = async (issueData) => {
    const tasks = [
      ProjectService.getProjectById(issueData.projectId)
        .then((projectData) => setProjectName(projectData.project.name))
        .catch(() => setProjectName(issueData.projectId))
    ];

    if (issueData.assignedToId) {
      tasks.push(
        UserService.getUserById(issueData.assignedToId)
          .then((user) => setAssignedUserName(user.username || issueData.assignedToId))
          .catch(() => setAssignedUserName(issueData.assignedToId))
      );
    } else {
      setAssignedUserName("");
    }

    if (issueData.labels?.length) {
      tasks.push(
        LabelService.getProjectLabels(issueData.projectId)
          .then((projectLabels) => {
            setIssueLabels(projectLabels.filter((label) => issueData.labels.includes(label.id)));
          })
          .catch(() => setIssueLabels([]))
      );
    } else {
      setIssueLabels([]);
    }

    await Promise.all(tasks);
  };

  const loadCommentAuthors = async (commentsData) => {
    const uniqueAuthorIds = Array.from(
      new Set((commentsData || []).map((comment) => comment.authorId).filter(Boolean))
    );

    if (uniqueAuthorIds.length === 0) {
      setCommentAuthors({});
      return;
    }

    const authorEntries = await Promise.all(
      uniqueAuthorIds.map(async (authorId) => {
        try {
          const user = await UserService.getUserById(authorId);
          return [authorId, user.username || authorId];
        } catch {
          return [authorId, authorId];
        }
      })
    );

    setCommentAuthors(Object.fromEntries(authorEntries));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsPosting(true);
      const comment = await CommentService.createComment(id, newComment);
      setComments([...comments, comment]);
      if (comment.authorId) {
        setCommentAuthors((currentAuthors) => ({
          ...currentAuthors,
          [comment.authorId]: currentAuthors[comment.authorId] || "You",
        }));
      }
      setNewComment("");
    } catch (err) {
      setErrorMessage("Failed to add comment.");
      console.log(error.message);
      setIsErrorOpen(true);
    } finally {
      setIsPosting(false);
    }
  };

  const openCommentQuestion = (commentId) => {
    setToBeDeletedComment(commentId);
    console.log(commentId)
    setQuestionCommentIsOpen(true);
  }

  const handleDeleteComment = async () => {
    try {
      await CommentService.deleteComment(toBeDeletedComment);
      setComments(comments.filter(c => c.id !== toBeDeletedComment));
    } catch (err) {
      setErrorMessage("Failed to delete comment.");
      setIsErrorOpen(true);
    }
    setQuestionCommentIsOpen(false);
  };

  const handleStatusChange = async () => {
    try {
      const nextStatus = isOpen ? "closed" : "open";
      const updatedIssue = await IssueService.updateIssue(id, { status: nextStatus });
      setIssue(updatedIssue);
      setIsOpen(updatedIssue.status !== "closed" && updatedIssue.status !== "resolved");
    } catch (err) {
      setErrorMessage("Failed to update status.");
      setIsErrorOpen(true);
    }
  };

  const openIssueQuestion = () => {
    setQuestionIssueIsOpen(true);
  }

  const handleDeleteIssue = async () => {
    try {
      await IssueService.deleteIssue(id);
      navigate("/projects");
    } catch (err) {
      setErrorMessage("Failed to delete project");
      setIsErrorOpen(true);
    }
    setQuestionIssueIsOpen(false);
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
        title={"Error!"}
      />
      <PopupCard
        isOpen={questionCommentIsOpen}
        message={"Delete this comment?"}
        onClose={() => setQuestionCommentIsOpen(false)}
        innerClassName="confirm-card-message"
        title={"Are you sure!"}
        onConfirm={handleDeleteComment}
      />
      <PopupCard
        isOpen={questionIssueIsOpen}
        message={"Delete this Issue?"}
        onClose={() => setQuestionIssueIsOpen(false)}
        innerClassName="confirm-card-message"
        title={"Are you sure!"}
        onConfirm={handleDeleteIssue}
      />
      <CustomButton
        onClick={() => navigate(`/projects/${issue.projectId}`)}
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
            <p><strong>Project:</strong> {projectName || issue.projectId}</p>
            {issue.assignedToId && <p><strong>Assigned to:</strong> {assignedUserName || issue.assignedToId}</p>}
            {issueLabels.length > 0 && (
              <div className="project-labels-summary">
                <strong>Labels:</strong>
                <div className="label-chip-list compact">
                  {issueLabels.map((label) => (
                    <span key={label.id} className="label-chip" style={{ backgroundColor: label.color }}>
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="issue-details-right">
          <div className="issue-data">
            <div className="issue-inner-data">
              <strong>Priority:</strong>
              <p 
                className={issuePriority}>
                {issue.priority}
              </p>
            </div>
            <div className="issue-inner-data">
              <strong>Status:</strong>
              <p 
                className={(isOpen ? "text-active" : "text-deactive")}>
                {issue.status}
              </p>
            </div>
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
              onClick={() => navigate(`/issues/${id}/assign`)}
              className={"assign-people-button"}
              text={"Assign People"}
            />
            <CustomButton
              onClick={() => openIssueQuestion(true)}
              className={"delete-button"}
              text={"Delete Issue"}
            />
            <CustomButton
              onClick={handleStatusChange}
              className={(isOpen ? 
                "change-status-button-activate" : 
                "change-status-button-deactivate"
              )}
              text={(isOpen ? "Close" : "Reopen")}
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
              <p><strong>{commentAuthors[comment.authorId] || comment.authorId}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
              <p>{comment.content}</p>
              <CustomButton
                type="button"
                onClick={() => openCommentQuestion(comment.id)}
                className={"delete-button"}
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
