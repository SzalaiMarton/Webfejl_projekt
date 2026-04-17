import Modal from "react-modal";

const PopupCard = ({ message, isOpen, onClose, innerClassName, title, onConfirm, confirmText = 'Yes', cancelText = 'No' }) => {
  return (
    <Modal
      style={{
        overlay: { background: 'rgba(0, 0, 0, 0.5)' },
      }}
      shouldCloseOnEsc={true}
      preventScroll={true}
      isOpen={isOpen}
      className="popup-card-container"
      ariaHideApp={false}
      onRequestClose={onClose}
    >
      <div className={innerClassName}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {onConfirm ? (
            <>
              <button onClick={onConfirm}>{confirmText}</button>
              <button onClick={onClose}>{cancelText}</button>
            </>
          ) : (
            <button onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PopupCard;