from flask import Flask, request, render_template, Blueprint, session
import os
from dotenv import load_dotenv
from config import Config

def create_app():
    app = Flask(__name__)
    load_dotenv()
    
    # Load configuration
    app.config.from_object(Config)
    
    @app.route('/test')
    def test():
        return 'Application is running!'
    
    # Register blueprints
    try:
        from test import bp2
        from test2 import bp1
        app.register_blueprint(bp1, url_prefix='/')
        app.register_blueprint(bp2, url_prefix='/')
        print("Blueprints registered successfully")
    except Exception as e:
        print(f"Error registering blueprints: {str(e)}")
    
    return app

# Create the application instance
app = create_app()

# Ensure the app exists
if not app:
    raise RuntimeError("Failed to create Flask application")