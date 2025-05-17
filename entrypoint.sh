#!/bin/sh
ollama serve --host 0.0.0.0 &
until nc -z localhost 11434; do sleep 1; done
ollama pull deepseek-r1:7b
wait