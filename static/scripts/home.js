// Generate cloud elements
function generateClouds() {
    const cloudCount = 6;
    const cloudsContainer = document.getElementById('clouds');
    
    for (let i = 0; i < cloudCount; i++) {
      // Randomize cloud properties
      const size = 50 + Math.random() * 150;
      const top = Math.random() * 100;
      const opacity = 0.4 + Math.random() * 0.3;
      
      // Determine animation class
      let animationClass = '';
      if (i % 3 === 0) {
        animationClass = 'float-slow';
      } else if (i % 3 === 1) {
        animationClass = 'float-medium';
      } else {
        animationClass = 'float-fast';
      }
      
      // Create cloud element
      const cloud = document.createElement('div');
      cloud.className = `cloud ${animationClass}`;
      cloud.style.top = `${top}px`;
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size / 2}px`;
      cloud.style.opacity = opacity;
      cloud.style.animationDelay = `${Math.random() * 40}s`;
      
      cloudsContainer.appendChild(cloud);
    }
  }
  
  // Initialize everything when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Generate cloud animation
    generateClouds();
    
    // Add event listeners for buttons
    const buttons = document.querySelectorAll('.tool-button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        console.log('Button clicked:', this.querySelector('span').textContent);
      });
    });
  });

  // Function to create the animated background
function createAnimatedBackground() {
  // Create the main container
  const animatedBg = document.createElement('div');
  animatedBg.className = 'animated-background';
  document.body.insertBefore(animatedBg, document.body.firstChild);
  
  // Create grass container
  const grassContainer = document.createElement('div');
  grassContainer.className = 'grass-container';
  animatedBg.appendChild(grassContainer);
  
  // Create sun rays
  const sunRays = document.createElement('div');
  sunRays.className = 'sun-rays';
  animatedBg.appendChild(sunRays);
  
  // Create three rows of grass
  for (let row = 0; row < 3; row++) {
    const grassRow = document.createElement('div');
    grassRow.className = 'grass-row';
    grassContainer.appendChild(grassRow);
    
    // Number of grass blades depends on row
    const bladeCount = 20 + (row * 10);
    
    for (let i = 0; i < bladeCount; i++) {
      // Create a grass blade
      const blade = document.createElement('div');
      blade.className = 'grass-blade';
      
      // Randomize grass properties
      const height = 40 + Math.random() * 40;
      const width = 3 + Math.random() * 5;
      const left = (i / bladeCount * 100) + (Math.random() * 2 - 1);
      const delay = Math.random() * 5;
      const duration = 2 + Math.random() * 3;
      
      blade.style.height = `${height}px`;
      blade.style.width = `${width}px`;
      blade.style.left = `${left}%`;
      blade.style.animationDelay = `${delay}s`;
      blade.style.animationDuration = `${duration}s`;
      
      // Add wheat seed to some grass blades
      if (Math.random() > 0.7) {
        const seed = document.createElement('div');
        seed.className = 'wheat-seed';
        seed.style.animationDelay = `${delay + 1}s`;
        blade.appendChild(seed);
      }
      
      grassRow.appendChild(blade);
    }
  }
  
  // Add dust particles
  for (let i = 0; i < 30; i++) {
    const dust = document.createElement('div');
    dust.className = 'dust-particle';
    dust.style.left = `${Math.random() * 100}%`;
    dust.style.top = `${50 + Math.random() * 50}%`;
    dust.style.animationDelay = `${Math.random() * 15}s`;
    dust.style.animationDuration = `${10 + Math.random() * 10}s`;
    animatedBg.appendChild(dust);
  }
  
  // Add occasional rain drops (subtle effect)
  function addRaindrops() {
    // Only add rain sometimes (randomly)
    if (Math.random() > 0.8) {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const raindrop = document.createElement('div');
          raindrop.className = 'rain-drop';
          raindrop.style.left = `${Math.random() * 100}%`;
          raindrop.style.top = '0';
          raindrop.style.animationDelay = `${Math.random() * 3}s`;
          
          animatedBg.appendChild(raindrop);
          
          // Remove the raindrop after animation completes
          setTimeout(() => {
            raindrop.remove();
          }, 5000);
        }, i * 200);
      }
    }
    
    // Schedule next rain
    setTimeout(addRaindrops, 20000 + Math.random() * 40000);
  }
  
  // Start rain cycle
  setTimeout(addRaindrops, 5000);
}

// Initialize everything when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create the animated background
  createAnimatedBackground();
  
  // Keep the existing cloud generation
  generateClouds();
  
  // Other initializations from the original code...
});