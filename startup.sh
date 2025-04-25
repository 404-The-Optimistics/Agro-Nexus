#!/bin/bash

# Debug information
echo "Starting deployment script"
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Debug: List installed packages
echo "Installed packages:"
pip list

# Debug: List files in current directory
echo "Files in current directory:"
ls -la

# Start the application
echo "Starting application..."
gunicorn --bind=0.0.0.0:8000 --access-logfile=- --error-logfile=- --log-level=debug app:app 