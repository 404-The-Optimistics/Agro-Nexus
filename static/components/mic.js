
    // Function to start voice recognition
    const micButton = document.getElementById('micButton');
  
    micButton.addEventListener('click', () => {
      // Initialize speech recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'hi-IN'; // Set language to Hindi
  
      recognition.start();
  
      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Farmer said:', transcript);
  
        // Use Google Translate API or any other translation service to translate Hindi to English
        const translatedText = await translateToEnglish(transcript);
        console.log('Translated:', translatedText);
  
        // Navigate based on the translation
        navigateBasedOnCommand(translatedText);
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    });
  
    // Function to translate Hindi to English
    async function translateToEnglish(text) {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=hi|en`);
      const data = await response.json();
      return data.responseData.translatedText;
    }
  
    // Function to navigate based on the command
    function navigateBasedOnCommand(command) {
      if (command.toLowerCase().includes("price")) { //fasal ka daam jaanna hai
        window.location.href = '/predict_price';
      } else if (command.toLowerCase().includes("crop suggestion")) { //fasal ka sujaav chahiye
        window.location.href = '/crop_rec';
      } else if (command.toLowerCase().includes("disease")) { // fasal ki beemari jaanni hai
        window.location.href = '/submit';
      } else if (command.toLowerCase().includes("height")) { // fasal ki uchai jaani hai
        window.location.href = '/height';
      } else {
        alert('Sorry, I could not understand the command.');
      }
    }
  