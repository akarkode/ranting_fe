import { useState, useEffect } from "react";
import { getProfile } from "../api";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import "../styles/ChatPage.css";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (err) {
        if (err.name === "ApiError" && err.status === 401) {
          window.location.href = "/login";
        }
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="chat-layout">
        <div className="loading">Loading user...</div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      <Sidebar open={sidebarOpen} user={user} />
      <div className="main">
        <header className="chat-header">
          <button
            className="menu-btn"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1>Ranting AI Assistant</h1>
        </header>
        <main className="chat-main">
          <ChatBox />
        </main>
      </div>
    </div>
  );
}
