import { useState, useEffect } from "react";

import "../styles/design.css"
import "../styles/tokens.css"

function InputField({ id = "", errorsEnabled = true, maxLength, isRequired, placeholderText, textValue, verify, disabled = false, type = "text" }) {
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    textValue(value);
  };

  useEffect(() => {
    const newErrors = verify ? verify(inputValue) : [];
    setErrors(Array.isArray(newErrors) ? newErrors : []);
  }, [inputValue, verify]);

  return (
    <div className="input-field">
      <input
        id={id}
        maxLength={maxLength}
        required={isRequired}
        type={type}
        placeholder={placeholderText}
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
        
      />

      {errorsEnabled && errors.length > 0 && (
        <ul>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {(errorsEnabled && (errors.length === 0 || errors.length === 0 && inputValue.length > 0)) && (
        <p></p>
      )}

      {!errorsEnabled && (
        <p></p>
      )}
    
    </div>
  );
}

export default InputField;
