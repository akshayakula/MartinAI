#!/bin/bash
# Script to kill process using port 5001

# Find the process ID
PID=$(lsof -i:5001 -t)

if [ -z "$PID" ]; then
  echo "No process found running on port 5001"
  exit 0
fi

echo "Killing process $PID running on port 5001"
kill -9 $PID
echo "Process killed" 