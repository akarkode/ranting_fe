import { clearToken } from "../auth";
import { LogOut } from "lucide-react";
import "../styles/Sidebar.css";

export default function Sidebar({ open, user }) {
  const getAvatarUrl = (user) => {
    if (user.picture) return user.picture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=0D8ABC&color=fff&rounded=true`;
  };

  const currentYear = new Date().getFullYear();

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="brand">🌿 Ranting AI</div>
      <div className="sidebar-content">
        <p className="comingsoon"></p>
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
  );
}
