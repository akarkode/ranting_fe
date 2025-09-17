import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getToken } from "./auth";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import "./style.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={isLoggedIn ? <ChatPage /> : <LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
