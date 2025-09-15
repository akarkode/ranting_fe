import { useEffect, useRef } from "react";

export default function ChatMessages({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="messages">
      {messages.map((m, i) => (
        <div key={i} className={`message ${m.role}`}>
          {m.content}
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
  );
}
