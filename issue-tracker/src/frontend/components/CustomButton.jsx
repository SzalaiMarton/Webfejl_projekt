function CustomButton({ id = "", type, disabled, onClick, className, text, style = undefined }) {
  return (
    <button
      id={id}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      {text}
    </button>
  );
}

export default CustomButton;