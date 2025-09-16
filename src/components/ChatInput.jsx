import { useState, useEffect } from "react";
import { getProfile, sendMessage, uploadFile } from "../api";
import { clearToken } from "../auth";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({
    name: "Guest User",
    email: "-",
    avatar: "",
  });
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        if (res && res.status === 200) {
          setUser(res.data);
        }
      } catch {
        setUser({ name: "Guest User", email: "-", avatar: "" });
      }
    };
    fetchUser();
  }, []);

  const handleSend = async (input, file = null) => {
    if (!input.trim() && !file) return;

    let fileMeta = null;
    if (file) {
      try {
        fileMeta = await uploadFile(file);
      } catch (err) {
        console.error("Gagal upload file:", err);
        return;
      }
    }

    const userMsg = {
      role: "user",
      content: input,
      file: file ? { name: file.name, type: file.type } : null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      await sendMessage(
        input,
        fileMeta,
        (chunk) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + chunk },
              ];
            }
            return [...prev, { role: "assistant", content: chunk }];
          });
        },
        (fileb64) => {
          setIsTyping(false);
          if (fileb64) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "[Image Generated]",
                file: { b64: fileb64, type: "image/png" },
              },
            ]);
          }
        }
      );
    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand">🌿 Ranting AI</div>
        <div className="sidebar-content">
          <p className="comingsoon">+ New Chat (soon)</p>
        </div>
        <div className="profile">
          <img className="avatar" src={user.avatar || "..."} alt="avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button className="logout-btn" onClick={clearToken}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
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

        <div className="chatbox">
          <ChatMessages messages={messages} isTyping={isTyping} />
          {/* ChatInput sekarang bisa kirim (input, file) */}
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
