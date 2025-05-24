import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ message: "Missing OpenAI API key" }, { status: 500 });
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                "model": "gpt-4o-mini",
                messages: [{ role: "system", content:
                        "I ask one question at a time until answered. I'll share an idea, and you’ll ask questions to refine its design and specifications." },
                    { role: "user", content: prompt }],
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        return NextResponse.json({ text: response.data.choices[0].message.content });
    } catch (error: any) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
        return NextResponse.json({ message: "Error fetching response from OpenAI" }, { status: 500 });
    }
}
