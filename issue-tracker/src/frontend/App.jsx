import AppRouter from "./router/AppRouter.jsx"
import { StoreProvider } from "./services/StoreContext.jsx";
import { AuthProvider } from "./services/AuthContext.jsx";

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
