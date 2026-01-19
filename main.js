// =============================================================================
// APP CLASS - The Entry Point and Controller
// =============================================================================
// This class is the "entry point" of our application - it's where everything
// starts when the page loads.
//
// Think of the App class as the control panel operator:
// - It creates the simulation
// - It connects UI buttons and sliders to the simulation
// - It updates the display with statistics
// - It responds to user interactions
//
// The App class bridges the gap between:
// - The HTML/CSS user interface (what the user sees and clicks)
// - The JavaScript simulation logic (the physics and animation)
//
// Analogy: If the Simulation is like a TV show, the App class is the remote
// control that lets the user play, pause, change channels (particle count), etc.
// =============================================================================

class App {
    // -------------------------------------------------------------------------
    // CONSTRUCTOR - Initialize the application
    // -------------------------------------------------------------------------
    // The constructor is called once when the page loads
    // It sets up the simulation and connects all the UI controls
    // -------------------------------------------------------------------------
    constructor() {
        // ---------------------------------------------------------------------
        // CREATE THE SIMULATION
        // ---------------------------------------------------------------------
        // Create a new Simulation instance
        // We pass 'simulationCanvas' which is the id of the <canvas> element in HTML
        // This tells the simulation which canvas to draw on
        this.simulation = new Simulation('simulationCanvas');
        
        // Initialize with 30 particles to start
        // This is a good default - not too few (boring) or too many (laggy)
        this.simulation.initializeParticles(30);
        
        // Start the animation loop
        // This begins the endless cycle of physics updates and rendering
        this.simulation.start();
        
        // ---------------------------------------------------------------------
        // CONNECT UI CONTROLS
        // ---------------------------------------------------------------------
        // Set up all the buttons, sliders, and other interactive elements
        // This method connects HTML elements to JavaScript functions
        this.setupControls();
        
        // ---------------------------------------------------------------------
        // START STATISTICS UPDATE LOOP
        // ---------------------------------------------------------------------
        // Set up a timer to update the statistics display every 100 milliseconds
        // This shows particle count, energy, velocity, and FPS to the user
        this.updateStatsLoop();
    }
    
    // -------------------------------------------------------------------------
    // SETUP CONTROLS - Connect UI elements to simulation functions
    // -------------------------------------------------------------------------
    // This method finds all the interactive elements in the HTML (buttons, sliders)
    // and attaches "event listeners" to them
    //
    // What's an event listener?
    // It's like a "watch dog" that waits for something to happen (a click, a slide)
    // and then calls a function in response
    //
    // Example: When user clicks the "pause" button → call the pause function
    // -------------------------------------------------------------------------
    setupControls() {
        // ---------------------------------------------------------------------
        // PAUSE/RESUME BUTTON
        // ---------------------------------------------------------------------
        // This button toggles between pausing and resuming the simulation
        //
        // DOM (Document Object Model):
        // The DOM is how JavaScript sees and interacts with HTML elements
        // document.getElementById() finds an element by its id attribute
        const pauseBtn = document.getElementById('pauseBtn');
        
        // addEventListener() attaches a function to an event
        // 'click' = the event we're listening for (when user clicks the button)
        // () => { ... } = arrow function (the code to run when clicked)
        //
        // Arrow functions are a modern JavaScript syntax for writing functions:
        // Old way: function() { ... }
        // New way: () => { ... }
        pauseBtn.addEventListener('click', () => {
            // Check if simulation is currently running
            if (this.simulation.isRunning) {
                // If running, stop it
                this.simulation.stop();
                // Update button text to show what will happen on next click
                pauseBtn.textContent = 'Resume';
            } else {
                // If paused, start it
                this.simulation.start();
                // Update button text
                pauseBtn.textContent = 'Pause';
            }
        });
        
        // ---------------------------------------------------------------------
        // RESET BUTTON
        // ---------------------------------------------------------------------
        // This button recreates all particles with new random positions
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.addEventListener('click', () => {
            // Get current particle count from the slider
            // We want to reset with the same number of particles
            const count = parseInt(document.getElementById('particleCount').value);
            
            // Reinitialize particles (this clears old ones and creates new ones)
            this.simulation.initializeParticles(count);
            
            // Make sure simulation is running after reset
            // (in case it was paused, we want to see the new particles move)
            if (!this.simulation.isRunning) {
                this.simulation.start();
                pauseBtn.textContent = 'Pause';
            }
        });
        
        // ---------------------------------------------------------------------
        // PARTICLE COUNT SLIDER
        // ---------------------------------------------------------------------
        // This slider lets the user adjust how many particles are in the simulation
        // Range: 5 to 100 particles
        const particleCountSlider = document.getElementById('particleCount');
        const particleCountValue = document.getElementById('particleCountValue');
        
        // 'input' event fires continuously as the slider is dragged
        // This gives immediate visual feedback
        particleCountSlider.addEventListener('input', () => {
            // Get the current value from the slider
            // value is a string, so we use parseInt() to convert to a number
            const count = parseInt(particleCountSlider.value);
            
            // Update the display showing the current value
            // This shows "30" or "50", etc. next to the slider
            particleCountValue.textContent = count;
            
            // Recreate particles with the new count
            this.simulation.initializeParticles(count);
        });
        
        // ---------------------------------------------------------------------
        // FORCE STRENGTH SLIDER
        // ---------------------------------------------------------------------
        // This slider adjusts the Coulomb's constant (strength of forces)
        // Higher values = stronger interactions (more dramatic)
        // Lower values = weaker interactions (gentler)
        const forceStrengthSlider = document.getElementById('forceStrength');
        const forceStrengthValue = document.getElementById('forceStrengthValue');
        
        forceStrengthSlider.addEventListener('input', () => {
            // Get the slider value and convert to number
            // parseFloat() handles decimal numbers (unlike parseInt)
            const strength = parseFloat(forceStrengthSlider.value);
            
            // Update the display
            // toFixed(0) formats the number with 0 decimal places
            // So 5000.0 becomes "5000"
            forceStrengthValue.textContent = strength.toFixed(0);
            
            // Update the physics engine's Coulomb's constant
            this.simulation.updateCoulombConstant(strength);
        });
        
        // ---------------------------------------------------------------------
        // FIELD LINES TOGGLE CHECKBOX
        // ---------------------------------------------------------------------
        // This checkbox turns field lines on/off
        // Field lines show the forces between particles as colored lines
        const fieldLinesToggle = document.getElementById('fieldLinesToggle');
        
        // 'change' event fires when checkbox state changes (checked/unchecked)
        fieldLinesToggle.addEventListener('change', () => {
            // checked property is true if checkbox is checked, false if unchecked
            // We set the simulation's showFieldLines property to match
            this.simulation.showFieldLines = fieldLinesToggle.checked;
        });
        
        // ---------------------------------------------------------------------
        // VELOCITY VECTORS TOGGLE CHECKBOX
        // ---------------------------------------------------------------------
        // This checkbox turns velocity arrows on/off
        // Arrows show which direction and how fast each particle is moving
        const velocityToggle = document.getElementById('velocityToggle');
        velocityToggle.addEventListener('change', () => {
            this.simulation.showVelocityVectors = velocityToggle.checked;
        });
    }
    
    // -------------------------------------------------------------------------
    // UPDATE STATS LOOP - Continuously update the statistics display
    // -------------------------------------------------------------------------
    // This method creates a repeating timer that updates the stats panel
    // It runs independently of the animation loop (different timing)
    //
    // Why separate from the animation loop?
    // - Animation loop runs at 60 FPS (every 16ms) - very fast!
    // - We don't need to update text that fast (humans can't read that quickly)
    // - Updating text is expensive (causes browser reflow/repaint)
    // - So we update stats only 10 times per second (every 100ms) - much more efficient
    // -------------------------------------------------------------------------
    updateStatsLoop() {
        // Get references to all the HTML elements that display statistics
        // These are <span> elements in the UI panel where we'll put numbers
        const particleCountDisplay = document.getElementById('particleCountDisplay');
        const totalEnergyDisplay = document.getElementById('totalEnergyDisplay');
        const avgVelocityDisplay = document.getElementById('avgVelocityDisplay');
        const fpsDisplay = document.getElementById('fpsDisplay');
        
        // ---------------------------------------------------------------------
        // Define the update function
        // ---------------------------------------------------------------------
        // This function gets the current statistics from the simulation
        // and updates the HTML to display them
        const updateStats = () => {
            // Get statistics object from simulation
            // This returns { particleCount, totalEnergy, averageVelocity, fps }
            const stats = this.simulation.getStats();
            
            // Update each display element
            // textContent sets the text inside an HTML element
            // It's like writing into a box on the webpage
            
            // Particle count is just a whole number
            particleCountDisplay.textContent = stats.particleCount;
            
            // Energy is formatted to 2 decimal places
            // toFixed(2) rounds to 2 decimals: 12345.6789 → "12345.68"
            totalEnergyDisplay.textContent = stats.totalEnergy.toFixed(2);
            
            // Average velocity is formatted to 2 decimal places
            avgVelocityDisplay.textContent = stats.averageVelocity.toFixed(2);
            
            // FPS is already rounded (from simulation), just display it
            fpsDisplay.textContent = stats.fps;
        };
        
        // ---------------------------------------------------------------------
        // Set up the repeating timer
        // ---------------------------------------------------------------------
        // setInterval() calls a function repeatedly at a specified interval
        // 
        // Parameters:
        //   updateStats - the function to call
        //   100 - the interval in milliseconds (100ms = 0.1 seconds = 10 times per second)
        //
        // How setInterval works:
        // - Browser sets a timer for 100ms
        // - When timer expires, call updateStats()
        // - Immediately set another 100ms timer
        // - Repeat forever (until page closes or we call clearInterval)
        //
        // This is different from the animation loop:
        // - Animation loop: requestAnimationFrame (synced to screen refresh, ~60 FPS)
        // - Stats loop: setInterval (fixed 10 times per second)
        setInterval(updateStats, 100);
        
        // Call updateStats immediately (don't wait 100ms for first update)
        // This ensures stats are displayed right away when page loads
        updateStats();
    }
}

// =============================================================================
// APPLICATION STARTUP
// =============================================================================
// This code runs when the page finishes loading
// It's the entry point that kicks everything off
// =============================================================================

// Wait for the page to fully load before starting
// 'DOMContentLoaded' event fires when HTML is parsed and DOM is ready
// (but before images/stylesheets are fully loaded)
//
// Why wait?
// - We need the HTML elements (canvas, buttons, etc.) to exist before we can use them
// - If we try to get elements before DOM is ready, getElementById() returns null
// - This causes errors and the app won't work
//
// Think of it like: "Wait for the stage to be built before the actors enter"
document.addEventListener('DOMContentLoaded', () => {
    // Create the App instance
    // This calls the constructor, which:
    // 1. Creates the simulation
    // 2. Sets up UI controls
    // 3. Starts the animation
    // 4. Starts the stats update loop
    //
    // From this point forward, the app is running!
    // The animation loop keeps running until the user closes the tab
    new App();
});

// =============================================================================
// GLOSSARY - Key Terms Explained
// =============================================================================
//
// DOM (Document Object Model):
//   The browser's representation of the HTML page as a tree of objects.
//   JavaScript uses the DOM to read and modify the webpage.
//
// Event Listener:
//   A function that "listens" for specific events (clicks, key presses, etc.)
//   and runs code in response. Like a doorbell that triggers an action.
//
// Callback:
//   A function passed as an argument to another function.
//   Example: addEventListener('click', callbackFunction)
//   The callback is called when the event happens.
//
// Arrow Function:
//   Modern JavaScript syntax for writing functions: () => { }
//   Shorter than traditional function syntax and handles 'this' differently.
//
// setInterval():
//   Browser function that calls a function repeatedly at fixed intervals.
//   Like a metronome ticking at a steady pace.
//
// requestAnimationFrame():
//   Browser function optimized for animations.
//   Calls your function before the next screen repaint (~60 times/second).
//
// Properties vs Methods:
//   Property: A value stored in an object (this.simulation)
//   Method: A function that belongs to an object (this.setupControls())
//
// =============================================================================
