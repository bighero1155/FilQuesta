// src/components/Classroom/ClassroomMessages.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../auth/axiosInstance";
import { getImageUrl } from "../../services/cosmeticService";

interface Message {
  message_id: string | number;
  classroom_id: number;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  message: string;
  timestamp: string;
}

interface ClassroomMessagesProps {
  classroomId: number;
  classroomTitle: string;
}

const ClassroomMessages: React.FC<ClassroomMessagesProps> = ({
  classroomId,
  classroomTitle,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Define loadMessages before using it in useEffect
  const loadMessages = useCallback(async () => {
    try {
      // ✅ Skip global loading screen for polling requests
      const response = await axios.get(`/classrooms/${classroomId}/messages`, {
        skipLoading: true
      } as any);
      
      // Normalize avatar URLs for all messages using centralized getImageUrl
      const normalizedMessages = response.data.map((msg: Message) => ({
        ...msg,
        avatar: msg.avatar ? getImageUrl(msg.avatar) : undefined
      }));
      
      setMessages(normalizedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setFetchingMessages(false);
    }
  }, [classroomId]);

  // Load messages from API
  useEffect(() => {
    loadMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [classroomId, loadMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);

    try {
      // ✅ Skip global loading screen since we have local loading state
      const response = await axios.post(
        `/classrooms/${classroomId}/messages`, 
        {
          user_id: user.user_id,
          message: newMessage.trim(),
        },
        {
          skipLoading: true
        } as any
      );

      // Normalize avatar URL for the new message using centralized getImageUrl
      const normalizedMessage = {
        ...response.data,
        avatar: response.data.avatar ? getImageUrl(response.data.avatar) : undefined
      };

      // Add the new message to the list
      setMessages((prev) => [...prev, normalizedMessage]);
      setNewMessage("");
    } catch (error: any) {
      console.error("Failed to send message:", error);
      alert(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (fetchingMessages) {
    return (
      <>
        <style>{styles}</style>
        <div className="messages-container">
          <div className="messages-header">
            <h3>💬 {classroomTitle}</h3>
            <small>Classroom Chat</small>
          </div>
          <div className="messages-body">
            <div className="empty-messages">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading messages...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="messages-container">
        {/* Header */}
        <div className="messages-header">
          <h3>💬 {classroomTitle}</h3>
          <small>Classroom Chat • {messages.length} messages</small>
        </div>

        {/* Messages Body */}
        <div className="messages-body">
          {messages.length === 0 ? (
            <div className="empty-messages">
              <div className="empty-messages-icon">💬</div>
              <h4>No messages yet</h4>
              <p>Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.user_id === user?.user_id;
              const initials = `${msg.first_name?.charAt(0) || ''}${msg.last_name?.charAt(0) || ''}`;

              return (
                <div
                  key={msg.message_id}
                  className={`message-item ${isOwnMessage ? "own-message" : ""}`}
                >
                  <div className="message-avatar">
                    {msg.avatar ? (
                      <img 
                        src={msg.avatar} 
                        alt={msg.username}
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('span')) {
                            const span = document.createElement('span');
                            span.textContent = initials || '?';
                            parent.appendChild(span);
                          }
                        }}
                      />
                    ) : (
                      <span>{initials || '?'}</span>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {isOwnMessage ? "You" : `${msg.first_name} ${msg.last_name}`}
                      </span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-bubble">{msg.message}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="messages-input-container">
          <form onSubmit={handleSendMessage} className="messages-input-form">
            <input
              type="text"
              className="messages-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="messages-send-btn"
              disabled={loading || !newMessage.trim()}
            >
              {loading ? "Sending..." : "Send 📤"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = `
  .messages-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 600px;
    max-height: 70vh;
  }

  .messages-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    text-align: center;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  }

  .messages-header h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: bold;
  }

  .messages-header small {
    opacity: 0.9;
    font-size: 0.85rem;
  }

  .messages-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .messages-body::-webkit-scrollbar {
    width: 8px;
  }

  .messages-body::-webkit-scrollbar-track {
    background: #e9ecef;
    border-radius: 10px;
  }

  .messages-body::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }

  .message-item {
    display: flex;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
  }

  .message-item.own-message {
    flex-direction: row-reverse;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    flex-shrink: 0;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .message-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .message-avatar span {
    user-select: none;
  }

  .message-content {
    max-width: 70%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
  }

  .message-sender {
    font-weight: bold;
    color: #333;
  }

  .message-time {
    color: #6c757d;
    font-size: 0.75rem;
  }

  .message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    word-wrap: break-word;
    line-height: 1.5;
  }

  .own-message .message-bubble {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  }

  .own-message .message-content {
    align-items: flex-end;
  }

  .messages-input-container {
    padding: 20px;
    background: white;
    border-top: 2px solid #e9ecef;
  }

  .messages-input-form {
    display: flex;
    gap: 12px;
  }

  .messages-input {
    flex: 1;
    padding: 12px 18px;
    border: 2px solid #e9ecef;
    border-radius: 25px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .messages-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .messages-send-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .messages-send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .messages-send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .empty-messages {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6c757d;
    text-align: center;
    padding: 40px;
  }

  .empty-messages-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .messages-container {
      height: 500px;
    }

    .message-content {
      max-width: 80%;
    }

    .messages-header h3 {
      font-size: 1.1rem;
    }

    .message-bubble {
      padding: 10px 14px;
      font-size: 0.9rem;
    }

    .messages-input {
      font-size: 0.9rem;
      padding: 10px 16px;
    }

    .messages-send-btn {
      padding: 10px 20px;
    }
  }
`;

export default ClassroomMessages;