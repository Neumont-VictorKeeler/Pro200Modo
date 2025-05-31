"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import axios from 'axios';
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";


export default function ChatPage() {
    interface Message {
        text: string;
        sender: string;
    }

    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const chatRef = useRef<HTMLDivElement>(null);

    const sendMessage = async () => {
        if (!input.trim() || waitingForResponse) return;

        setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);
        setInput("");
        setWaitingForResponse(true);

        try {
            const response = await axios.post("/api/chat", { prompt: input });
            setMessages((prevMessages) => [...prevMessages, { text: response.data.text, sender: "bot" }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error fetching response from OpenAI", sender: "bot" }]);
        } finally {
            setWaitingForResponse(false);
        }
    };

    const saveChat = async () => {
        const generatedTitle = title.trim()
            ? title
            : `Chat on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;

        const userMessages = messages.filter(msg => msg.sender === "user").map(msg => msg.text);
        const generatedDescription = description.trim()
            ? description
            : userMessages.length > 0
                ? userMessages.join(" ").slice(0, 150) + "..."
                : "No user input available.";

        if (user) {
            try {
                await addDoc(collection(db, `users/${user.uid}/conversations`), {
                    title: generatedTitle,
                    description: generatedDescription,
                    messages,
                    createdAt: new Date(),
                });

                setTitle("");
                setDescription("");
                alert("Chat saved successfully!");
                router.push("/console/docs"); // Redirect to the docs page
            } catch (error) {
                console.error("Error saving chat:", error);
                alert("Error saving chat.");
            }
        }
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ text: "Hello, I'm MODO! What idea would you like to start building today?", sender: "bot" }]);
        }
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <ProtectedRoute>
            <div className="bg-[#202C39] min-h-screen flex flex-col items-center">
                <div className="w-full">
                    <Navbar />
                </div>
                
                {/* Chat Container */}
                <Card className="w-full max-w-2xl h-[75vh] p-6 rounded-2xl shadow-lg flex flex-col mt-6 overflow-hidden bg-[#1E2A38] border-[#68B3DF] border-2">
                    <div className="flex flex-col flex-1 space-y-4 overflow-y-auto p-4 scrollbar-hide" ref={chatRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`rounded-xl px-4 py-2 max-w-lg break-words ${msg.sender === "bot" ? "bg-[#E873CB] text-[#FAFFEB]" : "bg-[#68B3DF] text-[#FAFFEB]"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 space-y-2">
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Document Title..."
                            className="bg-white text-black w-full p-2 rounded-md"
                        />
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Document description..."
                            className="bg-white text-black w-full p-2 rounded-md"
                        />
                    </div>
                </Card>

                <div className="p-4 bg-[#FAFFEB] rounded-full m-4 flex max-w-5xl mx-auto w-[100%]">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
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
                    <Button onClick={saveChat} className="ml-2 bg-[green] text-white">
                        Save Chat
                    </Button>
                </div>
                {/* Chat Messages (Scrollable) */}
            </div>
        </ProtectedRoute>
    );
}