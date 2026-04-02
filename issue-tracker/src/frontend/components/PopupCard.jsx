import Modal from "react-modal";

const PopupCard = ({ message, isOpen, onClose, innerClassName, outerClassName, title }) => {
  return (
    <Modal
      style={{
        overlay: { background: 'rgba(0, 0, 0, 0.5)' },
      }}
      shouldCloseOnEsc={true}
      preventScroll={true}
      isOpen={isOpen}
      className={outerClassName}
      ariaHideApp={false}
      onRequestClose={onClose}
    >
      <div className={innerClassName}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default PopupCard;