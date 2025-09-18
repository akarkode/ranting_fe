import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { isLoggedIn } from "./auth";
import { useToast } from "./context/ToastContext";
import "./styles/globals.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const { addToast } = useToast();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      addToast("⚠️ Please login to continue", "warning");
    }
  }, [loggedIn, addToast]);

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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={loggedIn ? <ChatPage /> : <LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
