from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import logging
from datetime import datetime
import requests
import serial


app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyDy-xGUeZtJCkOJrSP0LOAVxZmWNx5iIZk"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

# WeatherAPI.com configuration
WEATHER_API_KEY = "5c4e1379ec8847fea4e101640251704"  # Your WeatherAPI.com key
WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1/current.json"

@app.route('/real-time-data')
def get_real_time_data():
    try:
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        
        if latitude and longitude:
            logger.info(f"Fetching weather data for: {latitude}, {longitude}")
            params = {
                'key': WEATHER_API_KEY,
                'q': f"{latitude},{longitude}",
                'aqi': 'no'
            }

            response = requests.get(WEATHER_API_BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            weather_data = response.json()

            temperature = weather_data['current']['temp_c']
            humidity = weather_data['current']['humidity']
            wind_speed = weather_data['current']['wind_kph'] / 3.6
            rainfall = weather_data['current'].get('precip_mm', 0)

            soil_type = determine_soil_type(float(latitude), float(longitude))

            return jsonify({
                "temperature": round(temperature, 1),
                "humidity": humidity,
                "wind_speed": round(wind_speed, 1),
                "rainfall": round(rainfall, 1),
                "soil_type": soil_type,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "source": "WeatherAPI.com",
                "location": f"{latitude}, {longitude}"
            })
        
        else:
            return jsonify({ "error": "Coordinates not provided and IP-based lookup failed." }), 400

    except Exception as e:
        logger.exception("Unexpected error occurred.")
        return jsonify({ "error": str(e) }), 500

def determine_soil_type(latitude, longitude):
    """
    Determine soil type based on latitude and longitude.
    This is a simplified function - in a real application, you would use a soil database API.
    """
    # Simple rule-based approach based on latitude
    if latitude > 60:  # Northern regions
        return "Sandy"
    elif latitude > 30:  # Temperate regions
        return "Loamy"
    elif latitude > 0:  # Tropical regions
        return "Clay"
    else:  # Southern regions
        return "Red"


moisture_data = "No Value"

# Open serial port (change COM5 to your actual port)
ser = serial.Serial('COM4', 9600, timeout=1)

# Background reader thread
import threading

def read_serial():
    global moisture_data
    while True:
        try:
            data = ser.readline().decode().strip()
            if data.isdigit():
                raw_value = int(data)
                percentage = 100 - ((raw_value / 1024.0) * 100)
                moisture_data = f"{percentage:.1f}"  # Store as string with 1 decimal
                print("Moisture Value (%):", moisture_data)
        except Exception as e:
            print("Serial read error:", e)

threading.Thread(target=read_serial, daemon=True).start()
@app.route('/irrigation')
def irrigation():
    return render_template('simple_irrigation.html', moisture_data=moisture_data)

@app.route('/predict', methods=['POST'])
def predict_irrigation():
    try:
        # Collect data from form
        temperature = request.form.get('temperature')
        rainfall = request.form.get('rainfall')
        humidity = request.form.get('humidity')
        soil_type = request.form.get('soil_type')
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')

        # Compose a prompt for Gemini
        prompt = f"""
Based on the following environmental data:
- Temperature: {temperature}°C
- Rainfall: {rainfall}mm
- Humidity: {humidity}%
- Soil Type: {soil_type}
- Location: Latitude {latitude}, Longitude {longitude}
- Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Generate a 3-day irrigation schedule for a typical crop grown in this environment.
Include ideal times (e.g., early morning, late evening), estimated water quantity per session, and any quick tips if relevant.
Keep the response concise and practical without using bold formatting.
"""


        # Use Gemini to generate the schedule
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)

        irrigation_schedule = response.text
        print(irrigation_schedule)
        # Return the irrigation schedule in the response
        return jsonify({
            "schedule": irrigation_schedule
        })

    except Exception as e:
        logger.exception("Error in /predict")
        return jsonify({ "error": str(e) }), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
