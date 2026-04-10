function CustomButton({ type, disabled, onClick, className, text }) {
  return (
    <button
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