import { useRef } from "react";

function AutoResizeTextarea({placeholder, className, maxChar}) {
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      onInput={handleInput}
      placeholder={placeholder}
      className={className}
      maxLength={maxChar}
    />
  );
}

export default AutoResizeTextarea;