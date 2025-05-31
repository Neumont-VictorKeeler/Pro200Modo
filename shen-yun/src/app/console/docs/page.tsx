"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ConversationCard from "@/components/ConversationCard";

interface Conversation {
    id: string;
    title: string;
    description: string;
}

export default function DocsPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, `users/${user.uid}/conversations`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convos = snapshot.docs.map((doc) => {
                const data = doc.data();
                return { id: doc.id, title: data.title, description: data.description };
            });
            setConversations(convos);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col bg-[#202C39]">
                {/* Navbar */}
                <div className="w-full">
                    <Navbar />
                </div>

                <main className="p-6 flex-grow">
                    <h1 className="text-2xl text-[#FAFFEB] mb-4">Saved Conversations</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {conversations.length > 0 ? (
                            conversations.map((conv) => (
                                <ConversationCard key={conv.id} id={conv.id} title={conv.title} description={conv.description} />
                            ))
                        ) : (
                            <p className="text-[#FAFFEB]">No saved conversations yet.</p>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}