FROM ubuntu:latest

# Install dependencies


RUN apt update && apt install -y curl netcat-openbsd

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh


# Expose Ollama API port
EXPOSE 11434

# Set environment variable to bind Ollama to all network interfaces
ENV OLLAMA_HOST=0.0.0.0:11434

# Start Ollama and pull the DeepSeek model
CMD ["bash", "-c", "ollama serve & while ! nc -z localhost 11434; do echo 'Waiting for Ollama to start...'; sleep 1; done && ollama pull deepseek-r1:7b"]

