import RequiredFieldText from "../components/RequiredFieldText";
import PasswordField from "../components/PasswordField";
import LoginButton from "../components/LoginButton";
import RequiredField from "../components/RequiredField";
import ErrorCard from "../components/ErrorCard";
import { useState } from "react";

function LoginPage() {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleClick = () => {
    if (!isPasswordValid && !isUsernameValid) {
      setIsErrorOpen(true);
      return;
    }
    else {
      alert("login successful!");
    }
  };

  return (
    <div className="container">
       <ErrorCard 
        isOpen={isErrorOpen}
        message="Login failed"
        onClose={() => setIsErrorOpen(false)}
      />
      <div className="login-form">
        <div>
          <h2>Login</h2>
          <p>Please log in to access your account.</p>
          <div className="login-form-username">
            <titlebar>
              <label>Username:</label>
              <RequiredFieldText/>
            </titlebar>
            <RequiredField 
            placeholder="Enter username"
            isValid={(isValid) => setIsUsernameValid(isValid)}
            />
          </div>
          <div className="login-form-password">
            <div>
              <titlebar>
                <label>Password:</label>
                <RequiredFieldText/>
              </titlebar>
              <PasswordField 
              placeholder="Enter password"
              isValid={(isValid) => setIsPasswordValid(isValid)}
              />
            </div>
          </div>
          <LoginButton onClick={handleClick}/>
        </div>
      </div>
     
    </div>
  );
}

export default LoginPage;
