import Modal from "react-modal";

const PopupCard = ({ message, isOpen, onClose, innerClassName, outerClassName }) => {
  if (!isOpen) return null;

  return (
    <Modal
    style={{
      overlay: {background: 'transparent'},
    }}
    shouldCloseOnEsc={true}
    preventScroll={true}
    isOpen={isOpen}
    className={outerClassName}
    >
      <popupmessage className={innerClassName}>
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </popupmessage>
    </Modal>
  );
};

export default PopupCard;