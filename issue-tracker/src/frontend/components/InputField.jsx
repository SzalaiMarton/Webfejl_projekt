import { useState, useEffect } from "react";

import "../styles/design.css"
import "../styles/tokens.css"

function InputField({ maxLength, isRequired, placeholderText, input, verify, disabled = false, type = "text" }) {
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    input(value);
  };

  useEffect(() => {
    const newErrors = verify ? verify(inputValue) : [];
    setErrors(Array.isArray(newErrors) ? newErrors : []);
  }, [inputValue, verify]);

  return (
    <div className="input-field">
      <input
        maxLength={maxLength}
        required={isRequired}
        type={type}
        placeholder={placeholderText}
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
      />

      {errors.length > 0 && (
        <ul>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {errors.length === 0 && inputValue.length > 0 && (
        <p></p>
      )}
    </div>
  );
}

export default InputField;
