#!/bin/bash

# Make sure we're in the right directory
cd /home/site/wwwroot

# Set up Python environment variables
export PYTHONPATH=/home/site/wwwroot
export PYTHON_EGG_CACHE=/tmp

# Create any necessary directories
mkdir -p /tmp

# Debug information
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Files in current directory:"
ls -la

# Start gunicorn with proper settings
exec gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 4 --log-level debug wsgi:app 