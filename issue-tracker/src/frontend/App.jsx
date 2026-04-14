import AppRouter from "./router/AppRouter.jsx"
import { StoreProvider } from "./services/StoreContext.jsx";

function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}

export default App;