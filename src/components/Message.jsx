import "../styles/Message.css";

export default function Message({ role, content, fileb64 }) {
  return (
    <div className={`message ${role}`}>
      {content && <p>{content}</p>}
      {fileb64 && (
        <img
          src={`data:image/png;base64,${fileb64}`}
          alt="generated"
          className="message-image"
        />
      )}
    </div>
  );
}
