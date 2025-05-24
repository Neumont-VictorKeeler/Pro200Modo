"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";

interface Message {
  type: "user" | "bot";
  text: string;
}

// Establish socket connection outside component to avoid multiple instances
const socket: Socket = io("http://localhost:3001", {
  reconnectionAttempts: 5, // Retry up to 5 times
  reconnectionDelay: 2000, // Wait 2 seconds before retry
});

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server ✅"));
    socket.on("disconnect", () => console.log("Disconnected from server ❌"));
    socket.on("message", (data: { response: string }) => {
      // Remove "I'm thinking..." if it's still in the messages
      setMessages((prev) => prev.filter((msg) => msg.text !== "I'm thinking..."));
      
      // Add the actual response
      setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
      setWaitingForResponse(false);
    });
  
    socket.on("connect_error", (err) => console.error("Connection Error:", err));
    socket.on("reconnect_attempt", () => console.log("Attempting to reconnect..."));
  
    return () => {
      socket.removeListener("message");
      socket.removeListener("connect");
      socket.removeListener("disconnect");
      socket.removeListener("connect_error");
      socket.removeListener("reconnect_attempt");
    };
  }, []);
  

  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { type: "user", text: message }]);
      socket.emit("message", message);
      setMessage("");
      setWaitingForResponse(true);

      setTimeout(() => {
        setMessages((prevMessages: Message[]) => [
          ...prevMessages,
          { type: "bot", text: "I'm thinking..." },
        ]);
      }, 1000);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div ref={chatRef} className="flex-1 p-6 space-y-4 h-full overflow-y-auto max-h-[70vh]">
        {messages.map((msg, index) => (
          <div key={index} className="flex justify-start">
            <div
              className={`rounded-xl px-4 py-2 max-w-lg break-words ${
                msg.type === "bot"
                  ? "bg-[#E873CB] text-[#FAFFEB]  self-right"
                  : "bg-[#68B3DF] text-[#FAFFEB]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#FAFFEB] rounded-full m-4 flex max-w-2xl mx-auto w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !waitingForResponse && sendMessage()}
          placeholder="Type Here..."
          className="bg-transparent w-full outline-none px-4 text-black"
        />
        <Button
          onClick={sendMessage}
          className="ml-2 bg-[#68B3DF] text-white"
          disabled={waitingForResponse}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
