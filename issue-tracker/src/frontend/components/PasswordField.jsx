import { useState } from "react";

import "../styles/global.css"
import "../styles/tokens.css"

function PasswordField({ maxLength, required, placeholder }) {
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // Track focus

  const validateInput = (value) => {
    const newErrors = [];

    if (value.length < 8) {
      newErrors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(value)) {
      newErrors.push("At least one uppercase letter");
    }
    if (!/[a-z]/.test(value)) {
      newErrors.push("At least one lowercase letter");
    }
    if (!/[0-9]/.test(value)) {
      newErrors.push("At least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      newErrors.push("At least one special character");
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    validateInput(value);
  };

  return (
    <div className="password-field">
      <input
        maxLength={maxLength}
        required={required}
        type="password"
        placeholder={placeholder}
        value={input}
        onInput={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {isFocused && errors.length > 0 && (
        <ul>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {isFocused && errors.length === 0 && input.length > 0 && (
        <p>All rules satisfied</p>
      )}
    </div>
  );
}


export default PasswordField;