#!/bin/bash
cd /home/site/wwwroot
gunicorn --config gunicorn_config.py app:app 