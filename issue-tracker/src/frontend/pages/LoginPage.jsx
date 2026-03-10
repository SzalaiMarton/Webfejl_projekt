import RequiredFieldText from "../components/RequiredFieldText";
import PasswordField from "../components/PasswordField";

function LoginPage() {
  return (
    <div className="container">
      <form className="login-form">
        <div>
          <h2>Login</h2>
          <p>Please log in to access your account.</p>
          <div className="login-form-username">
            <titlebar>
              <label>Username:</label>
              <RequiredFieldText/>
            </titlebar>
            <input 
              maxLength={17} 
              required={true} 
              type="text" 
              placeholder="Enter username" />
          </div>
          <div className="login-form-password">
            <div>
              <titlebar>
                <label>Password:</label>
                <RequiredFieldText/>
              </titlebar>
              <PasswordField placeholder="Enter password"/>
            </div>
          </div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
