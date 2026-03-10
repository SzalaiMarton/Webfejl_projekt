import React from "react";

function LoginButton({ type, disabled, onClick, className }) {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      Login
    </button>
  );
}

export default LoginButton;