import { useState, useEffect } from "react";
import { getProfile } from "../api";
import { clearToken } from "../auth";
import { LogOut } from "lucide-react";
import ChatBox from "../components/ChatBox";
import "../styles/ChatPage.css";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        if (res && res.status === 200) {
          setUser(res.data);
        } else {
          console.error("Failed to load user profile");
        }
      } catch (err) {
        console.error("Error fetch user:", err);
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

  const getAvatarUrl = (user) => {
    if (user.picture) return user.picture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=0D8ABC&color=fff&rounded=true`;
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand">🌿 Ranting AI</div>

        <div className="sidebar-content">
          <p className="comingsoon">+ New Chat (soon)</p>
        </div>

        <div className="profile">
          <img
            className="avatar"
            src={getAvatarUrl(user)}
            alt={user.name}
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || "User"
              )}&background=0D8ABC&color=fff&rounded=true`;
            }}
          />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              clearToken();
              window.location.href = "/";
            }}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>

        <footer className="sidebar-footer">
          Powered by{" "}
          <a
            href="https://akarkode.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Akarkode
          </a>{" "}
          © {currentYear}
        </footer>
      </aside>

      {/* Main */}
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
