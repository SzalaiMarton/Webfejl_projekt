import Modal from "react-modal";

const ErrorCard = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
    style={{
      overlay: {background: 'transparent'},
    }}
    shouldCloseOnEsc={true}
    preventScroll={true}
    isOpen={isOpen}
    className="error-card-container"
    >
      <div className="error-card-message">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default ErrorCard;