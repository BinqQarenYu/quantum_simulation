// =============================================================================
// SIMULATION CLASS
// =============================================================================
// This class manages the entire particle simulation and its visualization.
// Think of it as the "director" of our animated physics show.
//
// The Simulation class is responsible for:
// 1. Managing the canvas (our drawing surface)
// 2. Maintaining the array of particles
// 3. Running the animation loop (the heartbeat of the simulation)
// 4. Rendering everything to the screen (particles, field lines, vectors)
// 5. Tracking performance (FPS - frames per second)
//
// Analogy: If you think of our simulation as a movie:
// - Particles are the actors
// - PhysicsEngine is the script (the rules they follow)
// - Simulation is the director + camera (orchestrates everything and shows it to us)
// =============================================================================

class Simulation {
    // -------------------------------------------------------------------------
    // CONSTRUCTOR - Initialize the simulation
    // -------------------------------------------------------------------------
    // Sets up the canvas, creates the physics engine, and prepares for animation
    //
    // Parameters:
    //   canvasId: The HTML id attribute of the canvas element (e.g., "simulationCanvas")
    // -------------------------------------------------------------------------
    constructor(canvasId) {
        // ---------------------------------------------------------------------
        // CANVAS SETUP
        // ---------------------------------------------------------------------
        // The canvas is an HTML element that we can draw on using JavaScript
        // Think of it like a blank piece of paper where we'll draw our particles
        
        // Get a reference to the canvas element from the HTML document
        // document.getElementById() looks up an element by its id attribute
        this.canvas = document.getElementById(canvasId);
        
        // Get the 2D rendering context - this is our "paintbrush"
        // The context provides methods for drawing shapes, lines, text, etc.
        // '2d' means we're doing 2D graphics (vs '3d' for WebGL)
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to match its display size
        // This prevents blurry rendering
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // ---------------------------------------------------------------------
        // PHYSICS ENGINE
        // ---------------------------------------------------------------------
        // Create a PhysicsEngine instance to handle all force calculations
        // We pass the canvas dimensions so it knows where the boundaries are
        this.physics = new PhysicsEngine(this.canvas.width, this.canvas.height);
        
        // ---------------------------------------------------------------------
        // PARTICLES ARRAY
        // ---------------------------------------------------------------------
        // This array will hold all our Particle objects
        // It starts empty - we'll add particles later
        this.particles = [];
        
        // ---------------------------------------------------------------------
        // ANIMATION STATE
        // ---------------------------------------------------------------------
        // Controls whether the simulation is running or paused
        // true = simulation is running
        // false = simulation is paused (frozen in time)
        this.isRunning = false;
        
        // ---------------------------------------------------------------------
        // TIME TRACKING
        // ---------------------------------------------------------------------
        // For calculating delta time (time between frames)
        // Delta time makes our simulation frame-rate independent
        //
        // Why do we need this?
        // Different computers run at different speeds. If we don't account for
        // the time between frames, the simulation would run faster on fast computers
        // and slower on slow computers. Delta time fixes this!
        //
        // lastTime stores the timestamp of the previous frame
        // We'll compare it to the current frame's timestamp to calculate dt
        this.lastTime = 0;
        
        // ---------------------------------------------------------------------
        // FPS TRACKING (Frames Per Second)
        // ---------------------------------------------------------------------
        // FPS tells us how smoothly the animation is running
        // 60 FPS = smooth (one frame every 16.67ms)
        // 30 FPS = acceptable (one frame every 33.33ms)
        // <30 FPS = choppy (simulation is struggling)
        //
        // We track FPS to:
        // - Show the user how well it's performing
        // - Debug performance issues
        // - Verify our target of 60 FPS
        
        // Array to store recent frame times for calculating average FPS
        this.frameTimes = [];
        
        // Maximum number of frame times to keep
        // We use a rolling average of the last 60 frames
        // This smooths out FPS fluctuations and gives a more stable reading
        this.frameTimesMaxLength = 60;
        
        // Current FPS value (will be updated each frame)
        this.fps = 0;
        
        // ---------------------------------------------------------------------
        // VISUAL OPTIONS
        // ---------------------------------------------------------------------
        // These flags control what gets drawn on the canvas
        // Users can toggle these on/off via the UI
        
        // Should we draw field lines showing forces between particles?
        this.showFieldLines = true;
        
        // Should we draw velocity vectors (arrows) on particles?
        this.showVelocityVectors = true;
    }
    
    // -------------------------------------------------------------------------
    // INITIALIZE PARTICLES - Create particles with random positions and charges
    // -------------------------------------------------------------------------
    // This method creates a specified number of particles and distributes them
    // randomly across the canvas with random charges
    //
    // Parameter:
    //   count: How many particles to create
    // -------------------------------------------------------------------------
    initializeParticles(count) {
        // Clear the existing particles array
        // This removes all old particles so we start fresh
        this.particles = [];
        
        // Create 'count' number of particles
        for (let i = 0; i < count; i++) {
            // -----------------------------------------------------------------
            // RANDOM POSITION
            // -----------------------------------------------------------------
            // Place particle at a random location on the canvas
            //
            // Math.random() returns a value between 0 and 1
            // Math.random() * canvas.width gives us a value between 0 and canvas width
            // This ensures particles spawn inside the visible canvas area
            //
            // We add some padding (50 pixels) to keep particles away from edges
            const x = 50 + Math.random() * (this.canvas.width - 100);
            const y = 50 + Math.random() * (this.canvas.height - 100);
            
            // -----------------------------------------------------------------
            // RANDOM CHARGE
            // -----------------------------------------------------------------
            // We want approximately:
            // - 40% positive charges (+1)
            // - 40% negative charges (-1)
            // - 20% neutral charges (0)
            //
            // How this works:
            // Math.random() gives us 0 to 1
            // - If random < 0.4 (40% chance): charge = 1 (positive)
            // - If random < 0.8 (next 40%): charge = -1 (negative)
            // - Otherwise (remaining 20%): charge = 0 (neutral)
            let charge;
            const random = Math.random();
            if (random < 0.4) {
                charge = 1;   // Positive (40% of particles)
            } else if (random < 0.8) {
                charge = -1;  // Negative (40% of particles)
            } else {
                charge = 0;   // Neutral (20% of particles)
            }
            
            // Create a new Particle with the random position and charge
            // Add it to our particles array
            this.particles.push(new Particle(x, y, charge));
        }
    }
    
    // -------------------------------------------------------------------------
    // START - Begin the animation loop
    // -------------------------------------------------------------------------
    // This method kicks off the simulation animation
    // It's like pressing the "play" button
    // -------------------------------------------------------------------------
    start() {
        // Set the running flag to true
        this.isRunning = true;
        
        // Reset lastTime so delta time calculation starts fresh
        // We set it to the current time
        // performance.now() gives us a high-resolution timestamp in milliseconds
        this.lastTime = performance.now();
        
        // Start the animation loop
        // We call animate() which will then call itself repeatedly
        // This creates an infinite loop that runs until we call stop()
        this.animate();
    }
    
    // -------------------------------------------------------------------------
    // STOP - Pause the animation loop
    // -------------------------------------------------------------------------
    // This method pauses the simulation
    // It's like pressing the "pause" button
    // -------------------------------------------------------------------------
    stop() {
        // Set the running flag to false
        // The animate() method checks this flag and won't continue if it's false
        this.isRunning = false;
    }
    
    // -------------------------------------------------------------------------
    // ANIMATE - The main animation loop (the heartbeat of the simulation)
    // -------------------------------------------------------------------------
    // This is the most important method in the Simulation class!
    // It gets called repeatedly (typically 60 times per second) and:
    // 1. Calculates how much time has passed (delta time)
    // 2. Updates physics (applies forces, moves particles)
    // 3. Clears the canvas
    // 4. Draws everything (particles, field lines, vectors)
    // 5. Calculates FPS
    // 6. Schedules itself to run again
    //
    // Think of it like a flipbook:
    // - Each call to animate() is one page in the flipbook
    // - We draw the current state of the simulation
    // - Then flip to the next page (call animate() again)
    // - Flipping fast enough (60 times/second) creates smooth motion!
    //
    // Parameter:
    //   currentTime: The current timestamp in milliseconds (provided by requestAnimationFrame)
    // -------------------------------------------------------------------------
    animate(currentTime = 0) {
        // ---------------------------------------------------------------------
        // CHECK IF WE SHOULD CONTINUE
        // ---------------------------------------------------------------------
        // If the simulation is paused (isRunning = false), don't continue
        // This allows us to pause the animation
        if (!this.isRunning) return;
        
        // ---------------------------------------------------------------------
        // CALCULATE DELTA TIME (dt)
        // ---------------------------------------------------------------------
        // Delta time is the time elapsed since the last frame
        // This is crucial for frame-rate independent physics!
        //
        // Example:
        // - Fast computer: 60 FPS → frames come every 16.67ms → dt = 0.0167 seconds
        // - Slow computer: 30 FPS → frames come every 33.33ms → dt = 0.0333 seconds
        //
        // By using dt in our physics calculations, both computers see the same
        // simulation speed, just with different smoothness
        //
        // currentTime - this.lastTime gives us milliseconds since last frame
        // Dividing by 1000 converts to seconds (physics formulas use seconds)
        const dt = (currentTime - this.lastTime) / 1000;
        
        // Store current time for next frame's calculation
        this.lastTime = currentTime;
        
        // Prevent huge dt values
        // If the tab was in the background or the computer froze briefly,
        // dt could be very large (seconds!), which would make particles
        // "teleport" huge distances in one frame
        // We cap dt at 0.1 seconds (10 FPS minimum) to prevent this
        const clampedDt = Math.min(dt, 0.1);
        
        // ---------------------------------------------------------------------
        // UPDATE PHYSICS
        // ---------------------------------------------------------------------
        // This is where the magic happens!
        
        // STEP 1: Calculate and apply forces between all particles
        // This uses Coulomb's Law to determine how particles push/pull each other
        this.physics.applyCoulombForce(this.particles);
        
        // STEP 2: Update each particle's position based on its velocity
        // This moves the particles according to the forces applied
        for (const particle of this.particles) {
            particle.update(clampedDt);
        }
        
        // STEP 3: Handle boundary collisions
        // Make particles bounce off the walls of the canvas
        this.physics.handleBoundaries(this.particles);
        
        // ---------------------------------------------------------------------
        // RENDER (DRAW) EVERYTHING
        // ---------------------------------------------------------------------
        // Clear the canvas and draw the current state
        
        // Clear the entire canvas to black
        // This erases the previous frame so we can draw the new one
        // It's like erasing a whiteboard before drawing again
        this.ctx.fillStyle = '#000000';  // Black color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field lines (if enabled)
        // These show the forces between particles as colored lines
        if (this.showFieldLines) {
            this.drawFieldLines();
        }
        
        // Draw velocity vectors (if enabled)
        // These show arrows indicating particle motion
        if (this.showVelocityVectors) {
            for (const particle of this.particles) {
                particle.drawVelocity(this.ctx);
            }
        }
        
        // Draw all particles
        // This draws the colored circles representing each particle
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }
        
        // ---------------------------------------------------------------------
        // CALCULATE FPS (Frames Per Second)
        // ---------------------------------------------------------------------
        // FPS shows us how smoothly the animation is running
        // We calculate it by tracking how long each frame takes
        
        // Add the current frame's delta time to our array
        this.frameTimes.push(dt);
        
        // Keep only the most recent frames (rolling average)
        // If we have more than 60 frame times, remove the oldest
        if (this.frameTimes.length > this.frameTimesMaxLength) {
            this.frameTimes.shift();  // Remove first (oldest) element
        }
        
        // Calculate average frame time
        // Sum all frame times and divide by the count
        const avgFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
        
        // Convert average frame time to FPS
        // FPS = 1 / frameTime
        // Example: if average frame time is 0.0167 seconds, FPS = 1 / 0.0167 = 60
        // We use Math.max to prevent division by zero
        this.fps = Math.round(1 / Math.max(avgFrameTime, 0.001));
        
        // ---------------------------------------------------------------------
        // SCHEDULE NEXT FRAME
        // ---------------------------------------------------------------------
        // requestAnimationFrame() is a browser API that:
        // 1. Waits for the next screen refresh (typically 60 Hz = 60 times/second)
        // 2. Calls our animate method again with the current timestamp
        // 3. Is optimized for smooth animations (better than setTimeout/setInterval)
        //
        // Why requestAnimationFrame instead of setInterval?
        // - Syncs with screen refresh rate (no screen tearing)
        // - Pauses when tab is in background (saves CPU/battery)
        // - Better performance (browser optimizes for animation)
        //
        // The arrow function () => this.animate(...) is needed to preserve 'this'
        // We bind the current timestamp so animate() knows when it's being called
        requestAnimationFrame((time) => this.animate(time));
    }
    
    // -------------------------------------------------------------------------
    // DRAW FIELD LINES - Visualize forces between particles
    // -------------------------------------------------------------------------
    // Field lines are visual representations of the electromagnetic forces
    // They help us see which particles are interacting and how strongly
    //
    // How it works:
    // - Draw a line between each pair of interacting particles
    // - Color: Green = attraction (opposite charges), Red = repulsion (like charges)
    // - Opacity: Stronger forces = more opaque lines, Weaker forces = more transparent
    //
    // This is an educational/debugging feature that makes invisible forces visible!
    // -------------------------------------------------------------------------
    drawFieldLines() {
        // Loop through all pairs of particles (same pattern as force calculations)
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // Skip if either particle is neutral
                // Neutral particles (charge = 0) don't have electromagnetic interactions
                if (p1.charge === 0 || p2.charge === 0) continue;
                
                // -----------------------------------------------------------------
                // Calculate distance between particles
                // -----------------------------------------------------------------
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // -----------------------------------------------------------------
                // Calculate force magnitude (same as in PhysicsEngine)
                // -----------------------------------------------------------------
                // This determines how strong the interaction is
                let forceMagnitude = this.physics.coulombConstant * p1.charge * p2.charge / (distance * distance);
                
                // -----------------------------------------------------------------
                // Determine interaction type and line properties
                // -----------------------------------------------------------------
                let color;
                let opacity;
                
                // Check if forces are attracting or repelling
                // q1 × q2 < 0 means opposite charges → attractive (pull together)
                // q1 × q2 > 0 means same charges → repulsive (push apart)
                if (p1.charge * p2.charge < 0) {
                    // ATTRACTIVE FORCE (opposite charges)
                    color = '0, 255, 0';  // Green color (RGB: 0, 255, 0)
                    
                    // Use absolute value because attractive forces are negative
                    // Map force magnitude to opacity (stronger force = more visible)
                    // We use a logarithmic scale so both weak and strong forces are visible
                    // Math.log() makes the opacity change more gradually
                    opacity = Math.min(Math.abs(forceMagnitude) / 50, 1.0);
                } else {
                    // REPULSIVE FORCE (like charges)
                    color = '255, 0, 0';  // Red color (RGB: 255, 0, 0)
                    
                    // Same opacity calculation but for repulsive forces
                    opacity = Math.min(Math.abs(forceMagnitude) / 50, 1.0);
                }
                
                // -----------------------------------------------------------------
                // Draw the line
                // -----------------------------------------------------------------
                // Start drawing a new path
                this.ctx.beginPath();
                
                // Set line color with calculated opacity
                // rgba(r, g, b, alpha) where alpha is transparency (0 = invisible, 1 = opaque)
                this.ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                
                // Set line width (thickness)
                this.ctx.lineWidth = 1;
                
                // Draw a line from particle 1 to particle 2
                this.ctx.moveTo(p1.x, p1.y);  // Start at particle 1
                this.ctx.lineTo(p2.x, p2.y);  // Draw line to particle 2
                
                // Render the line
                this.ctx.stroke();
            }
        }
    }
    
    // -------------------------------------------------------------------------
    // GET STATISTICS - Get current simulation statistics
    // -------------------------------------------------------------------------
    // Returns an object containing various metrics about the simulation
    // This is used by the UI to display information to the user
    //
    // Returns: Object with properties:
    //   - particleCount: Number of particles
    //   - totalEnergy: Total system energy (kinetic + potential)
    //   - averageVelocity: Average speed of all particles
    //   - fps: Current frames per second
    // -------------------------------------------------------------------------
    getStats() {
        // Calculate total energy using the PhysicsEngine
        const totalEnergy = this.physics.calculateTotalEnergy(this.particles);
        
        // -----------------------------------------------------------------
        // Calculate average velocity
        // -----------------------------------------------------------------
        let totalVelocity = 0;
        
        // Sum up the speed (magnitude of velocity) for each particle
        for (const particle of this.particles) {
            // Speed = √(vx² + vy²) using Pythagorean theorem
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            totalVelocity += speed;
        }
        
        // Calculate average by dividing by number of particles
        // Math.max prevents division by zero if there are no particles
        const averageVelocity = totalVelocity / Math.max(this.particles.length, 1);
        
        // Return statistics object
        return {
            particleCount: this.particles.length,
            totalEnergy: totalEnergy,
            averageVelocity: averageVelocity,
            fps: this.fps
        };
    }
    
    // -------------------------------------------------------------------------
    // UPDATE COULOMB CONSTANT - Adjust the strength of electromagnetic forces
    // -------------------------------------------------------------------------
    // This method allows the user to change how strong the forces are
    // Higher values = more dramatic interactions
    // Lower values = gentler interactions
    //
    // Parameter:
    //   value: The new Coulomb's constant value
    // -------------------------------------------------------------------------
    updateCoulombConstant(value) {
        this.physics.coulombConstant = value;
    }
}
