import { useEffect, useRef } from "react";
import TypingIndicator from "./TypingIndicator";
import Message from "./Message";
import "../styles/ChatMessages.css";

export default function ChatMessages({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="messages">
      {messages.map((m, i) => (
        <Message key={i} role={m.role} content={m.content} fileb64={m.file?.b64} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
