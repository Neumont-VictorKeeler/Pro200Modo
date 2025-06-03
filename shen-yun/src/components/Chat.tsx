"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  type: "user" | "bot";
  text: string;
}

const socket: Socket = io("http://localhost:3001", {
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
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
      setMessages((prev) => prev.filter((msg) => msg.text !== "I'm thinking..."));
      setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
      setWaitingForResponse(false);
    });

    socket.on("connect_error", (err) => console.error("Connection Error:", err));
    socket.on("reconnect_attempt", () => console.log("Attempting to reconnect..."));

    return () => {
      socket.off("message");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect_attempt");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { type: "user", text: message }]);
      socket.emit("message", message);
      setMessage("");
      setWaitingForResponse(true);

      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", text: "I'm thinking..." }]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      <div
        ref={chatRef}
        className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[75vh] bg-white shadow-inner rounded-b-lg"
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.type === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-lg break-words shadow-md ${
                  msg.type === "bot"
                    ? "bg-[#E873CB] text-[#FAFFEB]"
                    : "bg-[#68B3DF] text-white"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-[#f0f0f0] shadow-lg flex max-w-3xl mx-auto w-full rounded-t-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !waitingForResponse && sendMessage()}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#68B3DF] text-black"
        />
        <Button
          onClick={sendMessage}
          className="ml-2 bg-[#68B3DF] text-white px-4 py-2 rounded-lg hover:bg-[#579ec4] transition-all"
          disabled={waitingForResponse}
        >
          Send
        </Button>
      </div>
    </div>
  );
}