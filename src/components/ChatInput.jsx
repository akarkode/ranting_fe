import { useRef } from "react";

export default function ChatInput({
  input,
  setInput,
  onSend,
  fileMeta,
  setFileMeta,
  onFileChange,
  uploading,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  };

  return (
    <>
      {uploading && (
        <div className="pending-file-preview">
          <span>📜 Uploading file...</span>
          <div className="spinner"></div>
        </div>
      )}
      {fileMeta && !uploading && (
        <div className="pending-file-preview">
          <span>📜 {fileMeta.filename}</span>
          <button onClick={() => setFileMeta(null)} title="Remove file">
            ✕
          </button>
        </div>
      )}

      <div className="input-box">
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
          type="button"
          disabled={uploading} 
        >
          ➕
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder="Ask anything..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={uploading}
        />
        <button
          className="send-btn"
          onClick={onSend}
          disabled={uploading || !input.trim() && !fileMeta}
        >
          ➤
        </button>
      </div>
    </>
  );
}
