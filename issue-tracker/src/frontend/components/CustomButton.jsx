function CustomButton({ id = "", type, disabled, onClick, className, text }) {
  return (
    <button
      id={id}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
}

export default CustomButton;