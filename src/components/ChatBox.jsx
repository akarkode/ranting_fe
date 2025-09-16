import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sendMessage, getHistory, uploadFile } from "../api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistory();
        if (history && Array.isArray(history)) {
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() && !fileMeta) return;

    const userMsg = {
      role: "user",
      content: input,
      filename: fileMeta ? fileMeta.filename : null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      await sendMessage(
        input,
        fileMeta, // pass metadata (with file_id) instead of raw file
        (chunk) => {
          setIsTyping(false);
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
      setIsTyping(false);
      console.error("Chat error:", err);
    } finally {
      setFileMeta(null);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setUploading(true);
      try {
        const uploaded = await uploadFile(selectedFile);
        setFileMeta(uploaded); // { file_id, file_type, extension, filename }
      } catch (err) {
        console.error("File upload failed:", err);
        alert("File upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const [copied, setCopied] = useState(false);
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");

      const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };

      return !inline && match ? (
        <div style={{ position: "relative" }}>
          <button
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              fontSize: "12px",
              padding: "4px 8px",
              background: copied ? "#22c55e" : "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.role === "user" && m.filename && (
              <div
                className="file-label"
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                📎 {m.filename}
              </div>
            )}

            {m.content && (
              <ReactMarkdown components={renderers}>{m.content}</ReactMarkdown>
            )}
            {m.file && m.role === "assistant" && (
              <div className="file-preview">
                {m.file.type.startsWith("image/") ? (
                  <img
                    src={m.file.b64}
                    alt={m.file.name || "image"}
                    style={{ maxWidth: "200px", borderRadius: "8px" }}
                  />
                ) : null}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File upload state */}
      {uploading && (
        <div
          className="pending-file-preview"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span>📎 Uploading file...</span>
          <div className="spinner"></div>
        </div>
      )}
      {fileMeta && !uploading && (
        <div
          className="pending-file-preview"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span>📎 {fileMeta.filename}</span>
          <button
            onClick={() => setFileMeta(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#f87171",
              fontSize: "14px",
              cursor: "pointer",
            }}
            title="Remove file"
          >
            ✕
          </button>
        </div>
      )}

      <div className="input-box">
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
          type="button"
        >
          ➕
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder="Ask anything..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() && !fileMeta}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
