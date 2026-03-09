import React from "react";

function LoginPage() {
  return (
    <div className="container">
      <form className="login-form">
        <h2>Login</h2>
        <p>Please log in to access your account.</p>
        <div className="login-form-username">
          <label>Username:</label>
          <input type="text" placeholder="Enter username" />
        </div>
        <div className="login-form-password">
          <label>Password:</label>
          <input type="password" placeholder="Enter password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
