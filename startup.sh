#!/bin/bash

# Make sure we're in the right directory
cd /home/site/wwwroot

# Make sure Python can find the modules
export PYTHONPATH=/home/site/wwwroot

# Start gunicorn with proper settings
gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 4 wsgi:app 