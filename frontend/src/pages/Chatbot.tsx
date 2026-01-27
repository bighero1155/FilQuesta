/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma:2b",
          messages: [
            {
              role: "system",
              content:
                "You are EduGuide AI, a helpful study assistant. Always explain concepts concisely and briefly for fast replies.",
            },
            { role: "user", content: input },
          ],
          stream: false,
        }),
      });

      const data = await response.json();

      const aiReply =
        data.message?.content?.[0]?.text ||
        data.message?.content ||
        "⚠️ AI did not return a response";

      const botMsg: Message = { role: "assistant", content: aiReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botMsg: Message = {
        role: "assistant",
        content: "⚠️ Could not connect to Ollama server.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="btn btn-primary rounded-circle"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 9999,
          fontSize: "24px",
        }}
        onClick={toggleChat}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="card shadow-lg"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "380px",
            height: "420px",
            zIndex: 10000,
            borderRadius: "10px",
          }}
        >
          <div className="card-header bg-primary text-white p-2 d-flex justify-content-between align-items-center">
            <strong>EduGuide AI</strong>
            <button
              className="btn-close btn-close-white"
              onClick={toggleChat}
            ></button>
          </div>

          <div
            className="card-body p-3"
            style={{ maxHeight: "320px", overflowY: "auto", fontSize: "14px" }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted py-4">
                <div style={{ fontSize: "40px" }}>🤖</div>
                <p>Hello! How can I help you?</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 mb-2 rounded shadow-sm ${
                    msg.role === "user"
                      ? "bg-light text-end border"
                      : "bg-secondary text-white"
                  }`}
                >
                  <small className="d-block text-muted mb-1">
                    {msg.role === "user" ? "You" : "AI"}
                  </small>
                  {msg.role === "assistant" ? (
                    <span>🤖 {msg.content}</span>
                  ) : (
                    <span>🙋 {msg.content}</span>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="p-2 mb-2 rounded bg-secondary text-white">
                <small className="d-block text-muted mb-1">AI</small>
                <div className="d-flex align-items-center">
                  <span role="img" aria-label="thinking">
                    🤔
                  </span>
                  <div className="typing-indicator ms-2">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-footer p-2 bg-light">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? "⏳" : "📤"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Typing Indicator Styles */}
      <style>
        {`
          .typing-indicator {
            display: flex;
            gap: 4px;
            align-items: center;
          }
          .typing-indicator span {
            width: 6px;
            height: 6px;
            background-color: #fff;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite;
          }
          .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
          }
          .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.6;
            }
            40% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
