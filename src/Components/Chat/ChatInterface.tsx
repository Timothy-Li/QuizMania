import React, { useState, useEffect } from "react";
// import socket io client
import { useSocket } from "../../Context/SocketContext";
import "./chat.css";

export default function Chat() {
  // Get the socket connection from the context
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // Listen for messages from the server
  // This isn't good, as listener is being set up every time the chat component renders, causing multiple listeners to be added
  // We should set up the listener inside a useEffect hook to ensure it only runs once when the component mounts
  useEffect(() => {
    // useEffect stays the same from previous commmit, just add the socket check
    if (!socket) return;

    socket.on("receive-message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  // Add a message to the chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage("");

      // Emit the message to the server
      // Event name must match on server side and client side. Payload is message state
      socket.emit("message", message);
    }
  };

  return (
    <div className="chat-container">
      <form onSubmit={handleSendMessage} className="chat-form">
        <label htmlFor="message-input">Message</label>
        <input
          type="text"
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" id="send-button">
          Send
        </button>
      </form>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
