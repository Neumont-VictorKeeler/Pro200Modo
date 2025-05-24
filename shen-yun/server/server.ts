import { Server } from "socket.io";
import { createServer } from "http";
import axios from "axios"; // HTTP client to interact with Ollama

const httpServer = createServer(); // Standalone HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Update with your frontend base URL
        methods: ["GET", "POST"],
    },
});

// Ollama's API URL (change this if necessary)
const OLLAMA_API_URL = "http://localhost:11434"; // Replace with the exposed port

// Example function to send data to Ollama API
async function sendMessageToOllama(message: string) {
    try {
        const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
            model: "deepseek-r1:7b",
            prompt: message,
            stream: false,
        });
        

        // Return the response from Ollama API
        return response.data;
    } catch (error) {
        console.error("Error contacting Ollama:", error);
        throw error; // Rethrow to handle it on the Socket.io side
    }
}

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", async (msg) => {
        console.log("Message received: " + msg);

        try {
            // Send the received message to Ollama API
            const ollamaResponse = await sendMessageToOllama(msg);

            // Emit the response from Ollama back to the frontend
            console.log("Response from Ollama:", ollamaResponse);
            socket.emit("message", ollamaResponse); // Use `socket.emit` to target the individual client
        } catch (error) {
            // Handle any errors by emitting an error message to the frontend
            socket.emit("message", { error: "Error processing message." });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

httpServer.listen(3001, () => {
    console.log("Socket.io server running on port 3001");
});
