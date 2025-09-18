import "./../styles/LoginPage.css";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_URL}/v1/google/login`;
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">🌿 Ranting AI Assistant</h1>
        <p className="subtitle">
          Your smart companion for chat, files, and creativity
        </p>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>

        <footer className="login-footer">
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
      </div>
    </div>
  );
}
