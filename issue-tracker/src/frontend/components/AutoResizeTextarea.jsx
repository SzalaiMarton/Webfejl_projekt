import { useRef, useEffect } from "react";

function AutoResizeTextarea({placeholder, className, maxChar, value, onChange, disabled, style}) {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current && value) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      onInput={handleInput}
      placeholder={placeholder}
      className={className}
      maxLength={maxChar}
      value={value || ""}
      disabled={disabled}
      style={style}
    />
  );
}

export default AutoResizeTextarea;