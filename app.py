from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    return 'AgroNexus is running!'

@app.route('/test')
def test():
    return 'Test endpoint is working!'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)