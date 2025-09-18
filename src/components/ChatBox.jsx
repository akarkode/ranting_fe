import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sendMessage, getHistory, uploadFile } from "../api";
import TypingIndicator from "./TypingIndicator";
import "../styles/ChatBox.css";

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
        if (Array.isArray(history)) setMessages(history);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() && !fileMeta) return;

    const userMsg = {
      role: "user",
      content: input,
      filename: fileMeta?.filename || null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      await sendMessage(
        input,
        fileMeta,
        (chunk) => {
          setIsTyping(false);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
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
      alert("⚠️ Failed to send message. Please try again.");
    } finally {
      setFileMeta(null);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setUploading(true);
    try {
      const uploaded = await uploadFile(selectedFile);
      setFileMeta(uploaded);
    } catch (err) {
      console.error("File upload failed:", err);
      alert("⚠️ File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const MarkdownComponents = {
    code({ inline, className, children, ...props }) {
      const [copied, setCopied] = useState(false);
      const match = /language-(\w+)/.exec(className || "");
      const code = String(children).replace(/\n$/, "");

      const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };

      return !inline && match ? (
        <div className="code-block">
          <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>{children}</code>
      );
    },
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.role === "user" && m.filename && (
              <div className="file-label">📜 {m.filename}</div>
            )}
            {m.content && (
              <ReactMarkdown components={MarkdownComponents}>{m.content}</ReactMarkdown>
            )}
            {m.file && m.role === "assistant" && (
              <div className="file-preview">
                {m.file.type.startsWith("image/") && (
                  <img src={m.file.b64} alt="generated" />
                )}
              </div>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {uploading && (
        <div className="pending-file-preview">
          <span>📜 Uploading file...</span>
          <div className="spinner"></div>
        </div>
      )}
      {fileMeta && !uploading && (
        <div className="pending-file-preview">
          <span>📜 {fileMeta.filename}</span>
          <button onClick={() => setFileMeta(null)} title="Remove file">✕</button>
        </div>
      )}

      <div className="input-box">
        <button className="upload-btn" onClick={() => fileInputRef.current.click()} type="button">
          ➕
        </button>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder="Ask anything..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button className="send-btn" onClick={handleSend} disabled={!input.trim() && !fileMeta}>
          ➤
        </button>
      </div>
    </div>
  );
}
