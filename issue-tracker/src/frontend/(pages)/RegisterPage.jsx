import CustomButton from "../components/CustomButton.jsx";
import PopupCard from "../components/PopupCard";
import InputField from "../components/InputField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import TitleBar from "../components/TitleBar.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const formId = "register-form";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Registration failed");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyUsername = (value) => {
    if (value.length === 0) {return [];}
    
    const errors = [];
    if (value.trim().length < 3) {
      errors.push("Must be at least 3 characters");
    }
    setIsUsernameValid(errors.length === 0 && value.trim().length > 0);
    return errors;
  };

  const verifyEmail = (value) => {
    if (value.length === 0) {return [];}

    const errors = [];
    if (!value.includes('@')) {
      errors.push("Please enter a valid email");
    }
    setIsEmailValid(errors.length === 0 && value.length > 0);
    return errors;
  };

  const verifyPassword = (value) => {
    if (value.length === 0) {return [];}
    
    const errors = [];
    if (value.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(value)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(value)) errors.push("At least one lowercase letter");
    if (!/[0-9]/.test(value)) errors.push("At least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push("At least one special character");
    setIsPasswordValid(errors.length === 0 && value.length > 0);
    return errors;
  };

  const verifyConfirmPassword = (value) => {
    if (value.length === 0) {return [];}
    
    const errors = [];
    if (value !== password) {
      errors.push("Password doesn't match");
    }
    setIsConfirmPasswordValid(errors.length === 0 && value.length > 0);
    return errors;
  };

  const handleRegister = async () => {
    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      setErrorMessage("Please fill in all fields correctly");
      setIsErrorOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.register(username, email, password);
      setIsSuccessOpen(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <PopupCard 
        isOpen={isErrorOpen}
        message={errorMessage}
        onClose={() => setIsErrorOpen(false)}
        innerClassName="error-card-message"
        outerClassName="error-card-container"
        title={"Error!"}
      />
      <PopupCard 
        isOpen={isSuccessOpen}
        message="Registration successful! Redirecting to login..."
        onClose={() => setIsSuccessOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
        title={"Success!"}
      />
      <div className="form-container">
        <div>
          <h2>Register</h2>
          <p>Create a new account to get started.</p>
          
          <div className="form-container-field">
            <TitleBar
              id={formId}
              title={"Username:"}
              isRequired={true}
            />
            <InputField 
              id={formId}
              placeholderText="Enter username"
              textValue={(value) => setUsername(value)}
              verify={verifyUsername}
              disabled={isLoading}
              isRequired={true}
            />
          </div>

          <div className="form-container-field">
            <TitleBar
              id={formId}
              title={"Email:"}
              isRequired={true}
            />
            <InputField 
              id={formId}
              placeholderText="Enter email"
              textValue={(value) => setEmail(value)}
              verify={verifyEmail}
              disabled={isLoading}
              isRequired={true}
            />
          </div>

          <div className="form-container-field">
              <TitleBar
                id={formId}
                title={"Password:"}
                isRequired={true}
              />
              <InputField 
                id={formId}
                placeholderText="Enter password"
                textValue={(value) => setPassword(value)}
                verify={verifyPassword}
                disabled={isLoading}
                isRequired={true}
                type="password"
              />
          </div>

          <div className="form-container-field">
              <TitleBar
                id={formId}
                title={"Confirm Password:"}
                isRequired={true}
              />
              <InputField 
                id={formId}
                placeholderText="Confirm password"
                textValue={(value) => setConfirmPassword(value)}
                verify={verifyConfirmPassword}
                disabled={isLoading}
                isRequired={true}
                type="password"
              />
          </div>

          <div>
            <CustomButton 
              id={formId}
              onClick={handleRegister} 
              disabled={isLoading}
              text={"Register"}
            >
              {isLoading ? "Registering..." : "Register"}
            </CustomButton>
          </div>

          <div style={{ textAlign: "center" }}>
            <p>
              Already have an account?{" "}
              <a 
                href="/login" 
                style={{ 
                  color: "#007bff", 
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                Login here
              </a>
            </p>
          </div>

          {isLoading && <p style={{ textAlign: "center" }}>Registering...</p>}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
