import { useEffect, useState } from "react";
import Modal from "react-modal";
import LabelService from "../services/LabelService.js";
import CustomButton from "./CustomButton.jsx";
import PopupCard from "./PopupCard.jsx";

const DEFAULT_COLOR = "#2563eb";

function ProjectLabelsModal({ isOpen, onClose, projectId, labels, onLabelsChange }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [questionIsOpen, setQuestionIsOpen] = useState(false);
  const [toBeDeletedLabel, setToBeDeletedLabel] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setColor(DEFAULT_COLOR);
      setErrorMessage("");
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleCreateLabel = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      setErrorMessage("");
      const createdLabel = await LabelService.createLabel(projectId, name.trim(), color);
      onLabelsChange((currentLabels = []) => {
        if (currentLabels.some((label) => label.id === createdLabel.id)) {
          return currentLabels;
        }

        return [...currentLabels, createdLabel];
      });
      setName("");
      setColor(DEFAULT_COLOR);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create label.");
    } finally {
      setIsSaving(false);
    }
  };

  const openQuestion = (labelId) => {
    setToBeDeletedLabel(labelId);
    setQuestionIsOpen(true);
  }

  const handleDeleteLabel = async () => {
    try {
      setErrorMessage("");
      await LabelService.deleteLabel(toBeDeletedLabel);
      onLabelsChange((labels || []).filter((label) => label.id !== toBeDeletedLabel));
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete label.");
    }
    setQuestionIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      shouldCloseOnEsc={true}
      preventScroll={true}
      className="label-manager-modal"
      overlayClassName="label-manager-overlay"
    >
    <PopupCard
      innerClassName={"confirm-card-message"}
      isOpen={questionIsOpen}
      message={"Delete this label?"}
      title={"Are you sure?"}
      onConfirm={handleDeleteLabel}
      onClose={() => setQuestionIsOpen(false)}
    />
      <div className="label-manager-card">
        <div className="label-manager-header">
          <div>
            <h2>Project Labels</h2>
            <p>Pick from existing labels or create a new one here.</p>
          </div>
          <button 
          type="button" 
          onClick={onClose} 
          className="label-manager-close">
            Close
          </button>
        </div>

        {errorMessage ? <p className="label-manager-error">{errorMessage}</p> : null}

        <div className="label-manager-section">
          <h3>Current labels</h3>
          {labels && labels.length > 0 ? (
            <div className="label-chip-list">
              {labels.map((label) => (
                <div key={label.id} className="label-chip-row">
                  <span className="label-chip" style={{ backgroundColor: label.color }}>
                    {label.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => openQuestion(label.id)}
                    className="label-chip-delete"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No labels yet.</p>
          )}
        </div>

        <form onSubmit={handleCreateLabel} className="label-manager-form">
          <h3>Create label</h3>
          <label htmlFor="label-name">Name</label>
          <input
            id="label-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Bug, urgent, frontend..."
            disabled={isSaving}
          />

          <label htmlFor="label-color">Color</label>
          <input
            style={{height:"30px", width:"30px"}}
            id="label-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            disabled={isSaving}
          />
          <CustomButton
            type="submit"
            className="post-button"
            text={isSaving ? "Saving..." : "Create Label"}
            disabled={isSaving || !name.trim()}
          />
        </form>
      </div>
    </Modal>
  );
}

export default ProjectLabelsModal;
