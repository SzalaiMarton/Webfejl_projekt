import { useState, useEffect } from "react";
 
import "../styles/design.css";
import "../styles/tokens.css";
 
function InputField({
  id = "",
  errorsEnabled = true,
  maxLength = 0,
  isRequired = false,
  placeholderText = "",
  textValue = "",
  verify = null,
  disabled = false,
  type = "text",
  onChange = null,
}) {
  const [errors, setErrors] = useState([]);
  const [value, setValue] = useState(textValue);
 
  useEffect(() => {
    setValue(textValue);
  }, [textValue]);
 
  useEffect(() => {
    const newErrors = verify ? verify(value) : [];
    setErrors(Array.isArray(newErrors) ? newErrors : []);
  }, [value, verify]);
 
  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    onChange(v);
  };
 
  return (
    <div className="input-field">
      <input
        id={id}
        maxLength={maxLength || undefined}
        required={isRequired}
        type={type}
        placeholder={placeholderText}
        value={value}
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
 
      {(errorsEnabled && errors.length === 0) || !errorsEnabled ? (
        <p></p>
      ) : null}
    </div>
  );
}
 
export default InputField;