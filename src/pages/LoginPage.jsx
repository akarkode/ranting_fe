const loginUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL;

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = loginUrl;
  };

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
      </div>
    </div>
  );
}
