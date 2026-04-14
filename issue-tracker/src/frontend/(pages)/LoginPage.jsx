import CustomButton from "../components/CustomButton.jsx";
import PopupCard from "../components/PopupCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService.js";
import InputField from "../components/InputField.jsx";
import TitleBar from "../components/TitleBar.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const formId = "login-form";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Login failed");
  const [isLoading, setIsLoading] = useState(false);

  const verifyEmail = (value) => {
    if (value.length === 0) { return []; }
    
    const errors = [];
    if (!value.includes('@')) {
      errors.push("Please enter a valid email");
    }
    setIsEmailValid(errors.length === 0 && value.length > 0);
    return errors;
  };

  const verifyPassword = (value) => {
    if (value.length === 0) { return []; }
    
    const errors = [];
    if (value.length < 1) {
      errors.push("Password is required");
    }
    setIsPasswordValid(errors.length === 0 && value.length > 0);
    return errors;
  };

  const handleLogin = async () => {
    if (!isEmailValid || !isPasswordValid) {
      setErrorMessage("Please fill in all fields correctly");
      setIsErrorOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.login(email, password);
      
      navigate("/dashboard");
      /*setTimeout(() => {
        navigate("/dashboard");
      }, 2000);*/
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
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
      {/*<PopupCard 
        isOpen={isSucLoginOpen}
        message="Login successful!"
        onClose={() => setIsSucLoginOpen(false)}
        innerClassName="suc-login-card-message"
        outerClassName="suc-login-card-container"
        title={"Success!"}
      />*/}
      <div className="form-container">
        <form id={formId}>
          <h2>Login</h2>
          <p>Please log in to access your account.</p>
          <div className="form-container-field">
            <TitleBar
              id={formId}
              title={"Email:"}
              isRequired={true}
            />
            <InputField 
              id={formId+"-email"}
              placeholderText="Enter email"
              textValue={(value) => setEmail(value)}
              verify={verifyEmail}
              disabled={isLoading}
              isRequired={true}
              errorsEnabled={true}
            />
          </div>
          <div className="form-container-field">
            <TitleBar
              id={formId}
              title={"Password:"}
              isRequired={true}
            />
            <InputField 
              id={formId+"-password"}
              placeholderText="Enter password"
              textValue={(value) => setPassword(value)}
              verify={verifyPassword}
              disabled={isLoading}
              isRequired={true}
              type="password"
              errorsEnabled={false}
            />
          </div>
          <div>
            <CustomButton 
              id={formId}
              disabled={isLoading}
              text={"Login"}
              onClick={handleLogin}
            />
          </div>
          {isLoading && <p style={{ textAlign: "center" }}>Logging in...</p>}

          <div style={{ textAlign: "center" }}>
            <p>
              Don't have an account?{" "}
              <a 
                href="/register" 
                style={{ 
                  color: "#007bff", 
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
