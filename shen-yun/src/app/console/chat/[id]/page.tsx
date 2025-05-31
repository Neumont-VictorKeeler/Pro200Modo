"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthProvider";

interface Message {
    text: string;
    sender: string;
}

interface Conversation {
    title: string;
    description: string;
    messages: Message[];
}

export default function ChatDetailPage() {
    const { id } = useParams();
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!id || !user) return;

        const fetchConversation = async () => {
            const docRef = doc(db, `users/${user.uid}/conversations`, id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setConversation(docSnap.data() as Conversation);
            } else {
                console.error("No such document!");
            }
        };

        fetchConversation();
    }, [id, user]);

    if (!conversation) {
        return <div>Loading...</div>;
    }

    return (
        <ProtectedRoute>
            <div className="bg-[#202C39] min-h-screen flex flex-col items-center">
                <div className="w-full">
                    <Navbar />
                </div>
                <div className="w-full max-w-2xl p-6 mt-6 bg-[#1E2A38] rounded-2xl shadow-lg">
                    <h1 className="text-2xl text-[#FAFFEB] mb-4">{conversation.title || "Untitled Chat"}</h1>
                    <p className="text-[#FAFFEB] mb-4">{conversation.description || "No description available."}</p>
                    <div className="space-y-4">
                        {conversation.messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`rounded-xl px-4 py-2 max-w-lg break-words ${msg.sender === "bot" ? "bg-[#E873CB] text-[#FAFFEB]" : "bg-[#68B3DF] text-[#FAFFEB]"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
