const loginUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL;

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = loginUrl;
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">Ranting AI Assistant</h1>
        <p className="subtitle">Your smart companion for chat, files, and creativity</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>

        {/* Footer branding */}
        <div
          className="login-footer"
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Powered by{" "}
          <a
            href="https://akarkode.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff", textDecoration: "underline" }}
          >
            Akarkode
          </a>{" "}
          © {currentYear}
        </div>
      </div>
    </div>
  );
}
