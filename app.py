from flask import Flask, request, render_template, Blueprint, session
from test import bp2
from test2 import bp1
import os
from dotenv import load_dotenv
from config import Config


def create_app():
    app = Flask(__name__)
    load_dotenv()
    
    # Load configuration
    app.config.from_object(Config)
    
    # Register blueprints
    app.register_blueprint(bp1, url_prefix='/')
    app.register_blueprint(bp2, url_prefix='/')
    
    return app