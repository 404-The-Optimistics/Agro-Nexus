document.addEventListener('DOMContentLoaded', () => {
    // Register the GSAP plugins
    gsap.registerPlugin(ScrollToPlugin);

    // Make sure all elements are visible
    document.querySelectorAll('.form-group, .input-row, input, select, label').forEach(el => {
        el.style.opacity = 1;
        el.style.visibility = 'visible';
        if (el.tagName === 'DIV') {
            el.style.display = 'block';
        }
    });

    // Reset any transform that might be hiding elements
    document.querySelectorAll('.container, .form-group').forEach(el => {
        el.style.transform = 'none';
    });

    // Button pulse animation
    gsap.to('.predict-btn', {
        boxShadow: '0 0 15px rgba(93, 110, 73, 0.6)',
        scale: 1.03,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Soil Moisture Slider
    const moistureInput = document.getElementById('moisture');
    const moistureValue = document.querySelector('.moisture-value');

    moistureInput.addEventListener('input', (e) => {
        const value = parseFloat(moistureInput.value);
        moistureValue.textContent = `${value}%`;
        
        // Change color based on moisture value
        let textColor;
        
        if (value < 20) textColor = '#f44336'; // Very dry
        else if (value < 40) textColor = '#ff9800'; // Dry
        else if (value < 60) textColor = '#4caf50'; // Optimal
        else if (value < 80) textColor = '#2196f3'; // Moist
        else textColor = '#9c27b0'; // Very moist
        
        moistureValue.style.color = textColor;
    });

    // Set initial moisture value
    if (moistureInput.value) {
        moistureValue.textContent = `${moistureInput.value}%`;
    }

    // Form Submission
    const form = document.getElementById('irrigationForm');
    const resultContainer = document.getElementById('result-container');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const soilType = document.getElementById('soil_type').value;
        const moisture = parseFloat(document.getElementById('moisture').value);
        const cropType = document.getElementById('crop_type').value;
        const growthStage = document.getElementById('growth_stage').value;
        const temperature = parseFloat(document.getElementById('temperature').value);
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        
        // Calculate irrigation needs
        const irrigationResult = calculateIrrigation(soilType, moisture, cropType, growthStage, temperature, rainfall);
        
        // Display results
        displayResults(irrigationResult);
        
        // Scroll to results
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: resultContainer, offsetY: 20 },
            ease: 'power2.inOut'
        });
    });
    
    // Calculate irrigation needs based on inputs
    function calculateIrrigation(soilType, moisture, cropType, growthStage, temperature, rainfall) {
        // Base irrigation needs by crop type (mm per week)
        const cropBaseNeeds = {
            'rice': 150,
            'wheat': 100,
            'maize': 120,
            'cotton': 110,
            'sugarcane': 180,
            'potato': 90,
            'soybean': 80,
            'pulses': 70,
            'vegetables': 100,
            'fruits': 130
        };
        
        // Growth stage multipliers
        const growthMultipliers = {
            'seedling': 0.7,
            'vegetative': 1.0,
            'flowering': 1.3,
            'fruiting': 1.2,
            'ripening': 0.9,
            'harvesting': 0.5
        };
        
        // Soil type water retention factors
        const soilFactors = {
            'clay': 1.3,    // Clay retains more water
            'sandy': 0.7,   // Sandy soil needs more irrigation
            'loamy': 1.0,   // Loamy is balanced
            'silt': 1.1,    // Silt retains water well
            'black': 1.2,   // Black soil has good retention
            'red': 0.9      // Red soil has moderate retention
        };
        
        // Temperature adjustment factor (higher temp = more irrigation)
        const tempFactor = 1 + ((temperature - 20) * 0.02);
        
        // Moisture adjustment (lower moisture = more irrigation needed)
        const moistureFactor = 1 + ((100 - moisture) * 0.01);
        
        // Calculate base irrigation need
        let baseIrrigation = cropBaseNeeds[cropType] || 100;
        
        // Apply growth stage multiplier
        baseIrrigation *= growthMultipliers[growthStage] || 1.0;
        
        // Apply soil factor
        baseIrrigation *= soilFactors[soilType] || 1.0;
        
        // Apply temperature and moisture factors
        baseIrrigation *= tempFactor * moistureFactor;
        
        // Subtract expected rainfall
        baseIrrigation -= rainfall;
        
        // Ensure minimum irrigation of 0
        baseIrrigation = Math.max(0, baseIrrigation);
        
        // Round to 1 decimal place
        baseIrrigation = Math.round(baseIrrigation * 10) / 10;
        
        // Determine irrigation frequency based on soil type and crop
        let frequency = "Every 3-5 days";
        if (soilType === 'sandy') {
            frequency = "Every 1-2 days";
        } else if (soilType === 'clay') {
            frequency = "Every 5-7 days";
        }
        
        // Determine best irrigation time based on temperature
        let bestTime = "Early morning or evening";
        if (temperature > 30) {
            bestTime = "Early morning only";
        } else if (temperature < 15) {
            bestTime = "Mid-morning to afternoon";
        }
        
        // Determine irrigation method based on crop and soil
        let method = "Drip irrigation";
        if (cropType === 'rice') {
            method = "Flood irrigation";
        } else if (cropType === 'wheat' || cropType === 'maize') {
            method = "Sprinkler irrigation";
        }
        
        return {
            amount: baseIrrigation,
            frequency: frequency,
            bestTime: bestTime,
            method: method
        };
    }
    
    // Display results in the UI
    function displayResults(result) {
        // Show the result container
        resultContainer.style.display = 'block';
        
        // Animate the irrigation value
        const irrigationValue = document.getElementById('irrigation-value');
        const targetValue = result.amount;
        
        gsap.to(irrigationValue, {
            innerHTML: targetValue,
            duration: 1.5,
            snap: { innerHTML: 1 },
            ease: 'power2.out'
        });
        
        // Update other details
        document.getElementById('frequency-value').textContent = result.frequency;
        document.getElementById('time-value').textContent = result.bestTime;
        document.getElementById('method-value').textContent = result.method;
        
        // Add a subtle animation to the result container
        gsap.from(resultContainer, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
    }
}); 