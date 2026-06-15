import { AppRouter } from "./routes/AppRouter";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => (
  <ToastProvider>
    <AppRouter />
  </ToastProvider>
);

export default App;
