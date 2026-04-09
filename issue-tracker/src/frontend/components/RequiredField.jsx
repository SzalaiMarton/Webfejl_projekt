import { useState, useEffect } from "react";

function RequiredField({maxChar, required, placeholder, isValid, onValidate, type, value, onChange, disabled}) {
    const [input, setInput] = useState(value || "");

    useEffect(() => {
        if (value !== undefined) {
            setInput(value);
        }
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);
        
        const isInputValid = val.length > 0;
        if (onValidate) {
            onValidate(isInputValid);
        }
        if (isValid) {
            isValid(isInputValid);
        }

        if (onChange) {
            onChange(e);
        }
    }

    return (
        <input 
            maxLength={maxChar} 
            required={required} 
            value={input}
            onInput={handleChange}
            type={type || "text"}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}

export default RequiredField;