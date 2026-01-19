// =============================================================================
// PARTICLE CLASS
// =============================================================================
// This class represents a single particle in our simulation.
// Think of it like a blueprint for creating particles - each particle will have
// its own position, velocity, charge, and other properties.
//
// In object-oriented programming, a "class" is like a template or cookie cutter.
// We define it once, then we can create many "instances" (actual particles) from it.
// Each instance has its own unique data but follows the same structure.
// =============================================================================

class Particle {
    // -------------------------------------------------------------------------
    // CONSTRUCTOR - This special method runs when we create a new particle
    // -------------------------------------------------------------------------
    // The constructor initializes (sets up) all the properties for a new particle.
    // Think of it like filling out a form when a particle is "born".
    //
    // Parameters (inputs):
    //   x: The starting X coordinate on the canvas (horizontal position, in pixels)
    //   y: The starting Y coordinate on the canvas (vertical position, in pixels)
    //   charge: The electrical charge of the particle
    //           -1 = negative charge (like an electron - will be colored blue)
    //            0 = neutral (no charge - will be colored green)
    //           +1 = positive charge (like a proton - will be colored red)
    // -------------------------------------------------------------------------
    constructor(x, y, charge = 0) {
        // ---------------------------------------------------------------------
        // POSITION PROPERTIES - Where is the particle?
        // ---------------------------------------------------------------------
        // These store the particle's location on the canvas in pixels
        this.x = x;  // Horizontal position (0 = left edge of canvas)
        this.y = y;  // Vertical position (0 = top edge of canvas)
        
        // ---------------------------------------------------------------------
        // VELOCITY PROPERTIES - How fast and in what direction is it moving?
        // ---------------------------------------------------------------------
        // Velocity is the rate of change of position (speed with direction)
        // Measured in pixels per frame
        //
        // Math.random() generates a random decimal between 0 and 1
        // Example: Math.random() might return 0.7, 0.3, 0.9, etc.
        //
        // (Math.random() - 0.5) shifts the range to be between -0.5 and +0.5
        // Example: 0.7 - 0.5 = 0.2,  0.3 - 0.5 = -0.2
        //
        // Multiplying by 2 makes the range -1 to +1
        // This gives particles random starting velocities in both directions
        this.vx = (Math.random() - 0.5) * 2; // X velocity (horizontal speed)
        this.vy = (Math.random() - 0.5) * 2; // Y velocity (vertical speed)
        
        // ---------------------------------------------------------------------
        // ACCELERATION PROPERTIES - How is the velocity changing?
        // ---------------------------------------------------------------------
        // Acceleration is the rate of change of velocity
        // Measured in pixels per frame per frame
        //
        // These start at 0 and will be calculated each frame based on the
        // forces acting on the particle (from other particles)
        //
        // Think of it like: velocity = how fast you're going right now
        //                   acceleration = how much you're speeding up or slowing down
        this.ax = 0;  // X acceleration (horizontal change in speed)
        this.ay = 0;  // Y acceleration (vertical change in speed)
        
        // ---------------------------------------------------------------------
        // PHYSICAL PROPERTIES - What are the particle's characteristics?
        // ---------------------------------------------------------------------
        
        // Charge: Determines how the particle interacts with others
        // - Like charges repel (positive repels positive, negative repels negative)
        // - Opposite charges attract (positive attracts negative)
        // - Neutral particles (charge = 0) don't interact electromagnetically
        this.charge = charge;
        
        // Mass: How much "stuff" the particle is made of
        // In physics, F = ma (Force = mass × acceleration)
        // More mass means the same force produces less acceleration
        // We simplify by making all particles have mass = 1
        this.mass = 1;
        
        // Radius: How big the particle looks on screen (in pixels)
        // This is just for visual display - it doesn't affect the physics
        // calculations (we treat particles as point masses in the equations)
        this.radius = 8;
    }
    
    // -------------------------------------------------------------------------
    // UPDATE METHOD - Calculate new position based on physics
    // -------------------------------------------------------------------------
    // This method is called once per animation frame (typically 60 times per second)
    // It updates the particle's position and velocity based on the forces acting on it
    //
    // Parameter:
    //   dt: "delta time" - the time elapsed since the last frame (in seconds)
    //       This is typically 1/60 ≈ 0.0167 seconds for 60 FPS
    //       Using dt makes the simulation frame-rate independent
    // -------------------------------------------------------------------------
    update(dt) {
        // -----------------------------------------------------------------
        // STEP 1: Update velocity based on acceleration
        // -----------------------------------------------------------------
        // This implements the kinematic equation: v = v₀ + a×t
        // Where: v = new velocity
        //        v₀ = old velocity (current vx or vy)
        //        a = acceleration (ax or ay) 
        //        t = time interval (dt)
        //
        // In plain English: "New speed = old speed + (acceleration × time)"
        // Example: If vx = 2 and ax = 1 and dt = 0.1, then new vx = 2 + 1×0.1 = 2.1
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        
        // -----------------------------------------------------------------
        // STEP 2: Update position based on velocity
        // -----------------------------------------------------------------
        // This implements the kinematic equation: x = x₀ + v×t
        // Where: x = new position
        //        x₀ = old position (current x or y)
        //        v = velocity (vx or vy)
        //        t = time interval (dt)
        //
        // In plain English: "New position = old position + (velocity × time)"
        // Example: If x = 100 and vx = 50 and dt = 0.1, then new x = 100 + 50×0.1 = 105
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // -----------------------------------------------------------------
        // STEP 3: Reset acceleration to zero
        // -----------------------------------------------------------------
        // Important! We reset acceleration after using it because:
        // 1. Acceleration is calculated fresh each frame based on current forces
        // 2. The PhysicsEngine will calculate new acceleration values next frame
        // 3. If we don't reset it, acceleration would accumulate incorrectly
        //
        // Think of it like: forces can change every moment, so we need to
        // recalculate acceleration from scratch each frame
        this.ax = 0;
        this.ay = 0;
    }
    
    // -------------------------------------------------------------------------
    // APPLY FORCE METHOD - Apply a force to this particle
    // -------------------------------------------------------------------------
    // This method takes a force and converts it to acceleration using Newton's
    // Second Law of Motion: F = ma, which rearranges to a = F/m
    //
    // Parameters:
    //   fx: Force in the X direction (horizontal push/pull)
    //   fy: Force in the Y direction (vertical push/pull)
    //
    // Why separate from update()?
    // - applyForce() is called multiple times per frame (once per interacting particle)
    // - update() is called once per frame after all forces are applied
    // - This separation follows the physics simulation pattern:
    //   1. Calculate all forces → 2. Sum them up → 3. Update motion
    // -------------------------------------------------------------------------
    applyForce(fx, fy) {
        // -----------------------------------------------------------------
        // Apply Newton's Second Law: a = F / m
        // -----------------------------------------------------------------
        // Since all our particles have mass = 1, this simplifies to a = F
        // But we write it as F/m to show the physics clearly
        //
        // We use += (add and assign) because multiple forces can act on one particle:
        // - Particle A might push it left
        // - Particle B might pull it right
        // - Particle C might push it down
        // All these forces add up (vector addition) to determine total acceleration
        //
        // Example: If fx = 10 and mass = 1, then ax increases by 10
        //          If fx = -5 (force to the left), ax decreases by 5
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }
    
    // -------------------------------------------------------------------------
    // DRAW METHOD - Render the particle on the canvas
    // -------------------------------------------------------------------------
    // This method draws the particle as a colored circle on the HTML canvas
    // It also adds visual effects like glowing based on the particle's charge
    //
    // Parameter:
    //   ctx: The canvas "context" - think of it as a paintbrush we use to draw
    //        It's an object that has methods like fillCircle(), fillRect(), etc.
    //        We get this from the canvas element in the HTML
    // -------------------------------------------------------------------------
    draw(ctx) {
        // -----------------------------------------------------------------
        // STEP 1: Set the color based on charge
        // -----------------------------------------------------------------
        // We use different colors to help visualize what type of particle it is
        let color;
        
        if (this.charge > 0) {
            // Positive charge = RED (like protons)
            // RGB color: rgb(255, 100, 100) means full red, some green/blue for brightness
            color = 'rgb(255, 100, 100)';
        } else if (this.charge < 0) {
            // Negative charge = BLUE (like electrons)
            // RGB color: rgb(100, 100, 255) means some red/green, full blue
            color = 'rgb(100, 100, 255)';
        } else {
            // Neutral charge = GREEN
            // RGB color: rgb(100, 255, 100) means some red, full green, some blue
            color = 'rgb(100, 255, 100)';
        }
        
        // -----------------------------------------------------------------
        // STEP 2: Draw a glowing effect (optional aesthetic enhancement)
        // -----------------------------------------------------------------
        // This makes charged particles "glow" to show their energy
        // We only add glow if the particle has a charge (not neutral)
        if (this.charge !== 0) {
            // Start a new drawing path (like picking up the pen)
            ctx.beginPath();
            
            // Create a radial gradient (color that fades from center to edge)
            // Parameters: (centerX, centerY, innerRadius, centerX, centerY, outerRadius)
            // The gradient goes from the particle center (radius 0) to 3× the particle size
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,              // Inner circle (at particle center, radius 0)
                this.x, this.y, this.radius * 3 // Outer circle (3× particle size)
            );
            
            // Add color stops to the gradient
            // Think of this like: at 0% of the way (center), what color? at 100% (edge), what color?
            // 
            // addColorStop(position, color) where position is 0.0 to 1.0
            // rgba(r, g, b, alpha) where alpha is transparency: 0 = invisible, 1 = solid
            gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.5)'));  // 50% transparent at center
            gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0)'));    // Fully transparent at edge
            
            // Set the fill style to our gradient
            ctx.fillStyle = gradient;
            
            // Draw a circle for the glow effect
            // arc(x, y, radius, startAngle, endAngle)
            // Angles are in radians: 0 to 2π makes a complete circle
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            
            // Fill the circle with the gradient (creates the glow)
            ctx.fill();
        }
        
        // -----------------------------------------------------------------
        // STEP 3: Draw the main particle circle
        // -----------------------------------------------------------------
        // Start a new path for the main particle body
        ctx.beginPath();
        
        // Set the fill color to our particle color (solid, not transparent)
        ctx.fillStyle = color;
        
        // Draw a circle at the particle's position
        // Math.PI * 2 is 360 degrees in radians (a complete circle)
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Fill the circle with the color
        ctx.fill();
        
        // -----------------------------------------------------------------
        // STEP 4: Add a border around the particle
        // -----------------------------------------------------------------
        // This makes the particle easier to see against the background
        ctx.strokeStyle = 'white';  // White outline
        ctx.lineWidth = 2;          // 2 pixels thick
        ctx.stroke();               // Draw the outline
    }
    
    // -------------------------------------------------------------------------
    // DRAW VELOCITY VECTOR METHOD - Show the particle's velocity as an arrow
    // -------------------------------------------------------------------------
    // This is a debugging/educational visualization feature
    // It draws an arrow showing which direction the particle is moving and how fast
    //
    // Parameter:
    //   ctx: The canvas context (our "paintbrush")
    // -------------------------------------------------------------------------
    drawVelocity(ctx) {
        // -----------------------------------------------------------------
        // Calculate the velocity magnitude (total speed)
        // -----------------------------------------------------------------
        // The velocity vector is (vx, vy)
        // Its magnitude (length) is calculated using the Pythagorean theorem:
        // speed = √(vx² + vy²)
        //
        // Example: If vx = 3 and vy = 4, then speed = √(9 + 16) = √25 = 5
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        // -----------------------------------------------------------------
        // Only draw if the particle is actually moving
        // -----------------------------------------------------------------
        // If speed is very small (< 0.1), the arrow would be too tiny to see
        // So we skip drawing it to avoid clutter
        if (speed < 0.1) return;
        
        // -----------------------------------------------------------------
        // Scale the velocity for visualization
        // -----------------------------------------------------------------
        // We multiply by 10 to make the arrows visible
        // Without scaling, velocities of 2-3 pixels per frame would be too small to see
        const scale = 10;
        
        // Calculate the end point of the arrow
        // Start at particle position (this.x, this.y)
        // Extend in the direction of velocity
        const endX = this.x + this.vx * scale;
        const endY = this.y + this.vy * scale;
        
        // -----------------------------------------------------------------
        // Draw the arrow line
        // -----------------------------------------------------------------
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';  // White, 70% opaque
        ctx.lineWidth = 2;
        
        // moveTo(x, y) - move the "pen" without drawing
        // lineTo(x, y) - draw a line from current position to (x, y)
        ctx.moveTo(this.x, this.y);   // Start at particle center
        ctx.lineTo(endX, endY);        // Draw line to end point
        ctx.stroke();                  // Render the line
        
        // -----------------------------------------------------------------
        // Draw the arrowhead
        // -----------------------------------------------------------------
        // To make it clear which direction the arrow points, we add a triangle at the end
        
        // Calculate the angle of the velocity vector
        // Math.atan2(y, x) returns the angle in radians
        // It tells us the direction the particle is moving
        const angle = Math.atan2(this.vy, this.vx);
        
        // Size of the arrowhead
        const arrowSize = 8;
        
        // Calculate the two back corners of the arrowhead triangle
        // The arrowhead points in the direction of motion (angle)
        // The two back corners are at angle ± 150° (or ± 2.6 radians)
        //
        // Think of the arrowhead as a triangle:
        //    *  <- tip (at endX, endY)
        //   / \
        //  *---* <- these are the two back points we calculate
        const backLeft = {
            x: endX - arrowSize * Math.cos(angle - Math.PI / 6),
            y: endY - arrowSize * Math.sin(angle - Math.PI / 6)
        };
        const backRight = {
            x: endX - arrowSize * Math.cos(angle + Math.PI / 6),
            y: endY - arrowSize * Math.sin(angle + Math.PI / 6)
        };
        
        // Draw the arrowhead triangle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.moveTo(endX, endY);              // Tip of arrow
        ctx.lineTo(backLeft.x, backLeft.y);  // Back left corner
        ctx.lineTo(backRight.x, backRight.y);// Back right corner
        ctx.closePath();                     // Connect back to tip
        ctx.fill();                          // Fill the triangle
    }
    
    // -------------------------------------------------------------------------
    // GET KINETIC ENERGY METHOD - Calculate the particle's kinetic energy
    // -------------------------------------------------------------------------
    // Kinetic energy is the energy of motion
    // A faster particle has more kinetic energy
    // The formula is: KE = ½ × m × v²
    //
    // Where:
    //   m = mass
    //   v = speed (magnitude of velocity vector)
    //
    // Returns: The kinetic energy value
    // -------------------------------------------------------------------------
    getKineticEnergy() {
        // Calculate the speed (magnitude of velocity vector)
        // This is the same calculation as in drawVelocity()
        // speed = √(vx² + vy²)
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        // Apply the kinetic energy formula: KE = ½ × m × v²
        // 0.5 is the same as ½
        // We square the speed (speed * speed)
        // Since mass = 1 for all particles, this simplifies to: KE = 0.5 × speed²
        return 0.5 * this.mass * speed * speed;
    }
}
