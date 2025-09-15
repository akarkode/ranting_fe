export default function Message({ role, content, fileb64 }) {
  if (fileb64) {
    return (
      <div className={`message ${role}`}>
        {content && <p>{content}</p>}
        <img
          src={`data:image/png;base64,${fileb64}`}
          alt="file"
          style={{ maxWidth: "300px", marginTop: "8px" }}
        />
      </div>
    );
  }
  return (
    <div className={`message ${role}`}>
      <p>{content}</p>
    </div>
  );
}
