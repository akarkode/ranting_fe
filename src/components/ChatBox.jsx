import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sendMessage, getHistory } from "../api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);
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
        console.error("Gagal ambil history:", err);
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
    if (!input.trim() && !file) return;
    const userMsg = {
      role: "user",
      content: input,
      file: file
        ? {
            name: file.name,
            type: file.type,
            b64: await toBase64(file),
          }
        : null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setFile(null);
    setIsTyping(true);

    try {
      await sendMessage(
        input,
        file,
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
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
            {m.content && (
              <ReactMarkdown components={renderers}>{m.content}</ReactMarkdown>
            )}
            {m.file && (
              <div className="file-preview">
                {m.file.type.startsWith("image/") ? (
                  <img
                    src={m.file.b64}
                    alt={m.file.name || "image"}
                    style={{ maxWidth: "200px", borderRadius: "8px" }}
                  />
                ) : (
                  <a
                    href={m.file.b64}
                    download={m.file.name}
                    className="file-link"
                  >
                    📎 {m.file.name}
                  </a>
                )}
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
          placeholder="Tanyakan apa saja..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() && !file}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
