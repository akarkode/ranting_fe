import { getProfile } from "../api";
import { clearToken } from "../auth";
import { useState, useEffect } from "react";
import ChatBox from "../components/ChatBox";

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
          alert("Gagal memuat profil user");
        }
      } catch (err) {
        console.error("Error fetch user:", err);
        alert("Tidak dapat mengambil data user. Silakan login ulang.");
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

  // Avatar fallback generator
  const getAvatarUrl = (user) => {
    if (user.picture) return user.picture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=0D8ABC&color=fff&rounded=true`;
  };

  return (
    <div className="chat-layout">
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
              e.target.onerror = null; // cegah looping
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || "User"
              )}&background=0D8ABC&color=fff&rounded=true`;
            }}
          />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button className="logout-btn" onClick={clearToken}>
            Logout
          </button>
        </div>
      </aside>

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
