import RequiredFieldText from "../components/RequiredFieldText";
import PasswordField from "../components/PasswordField";
import LoginButton from "../components/LoginButton";
import RequiredField from "../components/RequiredField";
import PopupCard from "../components/PopupCard";
import { useState } from "react";

function LoginPage() {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSucLoginOpen, setIsSucLoginOpen] = useState(false);

  const handleClick = () => {
    if (!isPasswordValid && !isUsernameValid) {
      setIsErrorOpen(true);
      return;
    }
    else {
      setIsSucLoginOpen(true);
      return;
    }
  };

  return (
    <div className="container">
       <PopupCard 
        isOpen={isErrorOpen}
        message="Login failed"
        onClose={() => setIsErrorOpen(false)}
        innerClassName="error-card-message"
        outerClassName="error-card-container"
      />
      <PopupCard 
        isOpen={isSucLoginOpen}
        message="Login successful!"
        onClose={() => setIsErrorOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
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
