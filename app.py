from flask import Flask, request, render_template, Blueprint, session
from test import bp2
from test2 import bp1
import os
from dotenv import load_dotenv


def create_app():
    app = Flask(__name__)
    load_dotenv()
    SECRET_KEY = os.getenv("SECRET_KEY")
    app.secret_key = SECRET_KEY

    #registering the blueprints
    app.register_blueprint(bp1, url_prefix='/')
    app.register_blueprint(bp2, url_prefix='/')
    return app