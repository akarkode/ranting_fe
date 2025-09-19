import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { isLoggedIn } from "./auth";
import { useToast } from "./context/ToastContext";
import "./styles/globals.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AppRoutes() {
  const { addToast } = useToast();
  const loggedIn = isLoggedIn();
  const location = useLocation();

  useEffect(() => {
    if (!loggedIn && location.pathname === "/") {
      addToast("⚠️ Please login to continue", "warning");
    }
  }, [loggedIn, addToast, location]);

  return (
    <Routes>
      <Route path="/" element={loggedIn ? <ChatPage /> : <LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="global-loading">
            <div className="spinner" />
            <p>Loading app...</p>
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
