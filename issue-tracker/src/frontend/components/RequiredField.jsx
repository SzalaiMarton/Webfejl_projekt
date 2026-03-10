import { useState } from "react";

function RequiredField({maxChar, required, placeholder, isValid, type}) {
    const [input, setInput] = useState("")

    isValid = input.length > 0;

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
    }

    return (
        <input 
            maxLength={maxChar} 
            required={required} 
            value={input}
            onInput={handleChange}
            type={type}
            placeholder={placeholder}
        />
    );
}

export default RequiredField;