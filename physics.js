// =============================================================================
// PHYSICS ENGINE CLASS
// =============================================================================
// This class is the "brain" of our simulation - it handles all the physics
// calculations that make particles move realistically.
//
// The PhysicsEngine is responsible for:
// 1. Calculating forces between particles (Coulomb's Law for electrostatics)
// 2. Applying those forces to particles
// 3. Handling boundary collisions (particles bouncing off walls)
// 4. Tracking total energy in the system
//
// Think of it like the rules of a board game - the PhysicsEngine enforces
// the laws of physics that govern how particles interact.
// =============================================================================

class PhysicsEngine {
    // -------------------------------------------------------------------------
    // CONSTRUCTOR - Set up the physics simulation parameters
    // -------------------------------------------------------------------------
    // The constructor initializes the physics constants and settings
    // These values determine how strong forces are and how the simulation behaves
    //
    // Parameters:
    //   width: The width of the simulation area (canvas width in pixels)
    //   height: The height of the simulation area (canvas height in pixels)
    // -------------------------------------------------------------------------
    constructor(width, height) {
        // Store the simulation boundaries
        // These tell us where the "walls" are so particles can bounce off them
        this.width = width;
        this.height = height;
        
        // ---------------------------------------------------------------------
        // COULOMB'S CONSTANT (k)
        // ---------------------------------------------------------------------
        // In real physics, Coulomb's constant is k ≈ 8.99 × 10⁹ N⋅m²/C²
        // But we're in a simulation with pixels and game physics, so we scale it down
        // to values that create visually interesting motion
        //
        // Think of this as the "strength" of electrical forces
        // - Higher values = stronger forces = more dramatic interactions
        // - Lower values = weaker forces = gentler interactions
        //
        // We use 5000 as a starting value that creates nice visual effects
        // You can adjust this to see how it affects the simulation!
        this.coulombConstant = 5000;
        
        // ---------------------------------------------------------------------
        // MINIMUM DISTANCE (collision prevention)
        // ---------------------------------------------------------------------
        // When particles get very close, the force formula F = k×q1×q2/r²
        // would give us HUGE forces (dividing by a tiny r² makes F enormous!)
        // This can cause:
        // - Particles shooting off at light speed (not realistic)
        // - Numerical instability (NaN values, simulation breaking)
        // - Particles passing through each other
        //
        // Solution: We set a minimum distance - if particles are closer than this,
        // we pretend they're this far apart for force calculations
        //
        // Think of it like particles have a "personal space bubble" - they can
        // get close but not TOO close
        this.minDistance = 20;  // 20 pixels minimum separation
        
        // ---------------------------------------------------------------------
        // MAXIMUM FORCE (force capping)
        // ---------------------------------------------------------------------
        // Even with minDistance, forces can sometimes get too large
        // Maximum force prevents particles from accelerating too quickly
        //
        // Why cap forces?
        // - Prevents particles from moving so fast they "teleport" across the screen
        // - Keeps the simulation stable and predictable
        // - Makes the visualization easier to follow
        //
        // This is like a "speed limiter" on the forces
        this.maxForce = 100;    // Maximum force magnitude
        
        // ---------------------------------------------------------------------
        // DAMPING (energy dissipation)
        // ---------------------------------------------------------------------
        // In a perfect physics simulation, energy is conserved forever
        // Particles would bounce around eternally without slowing down
        //
        // Damping simulates:
        // - Air resistance / friction
        // - Energy dissipation
        // - Eventually reaching a stable state
        //
        // How it works:
        // - Each frame, we multiply velocity by damping (0.995)
        // - velocity × 0.995 = velocity loses 0.5% of its value
        // - Over time, this causes particles to gradually slow down
        // - It's subtle enough to not be obvious, but prevents endless chaos
        //
        // Value explanation:
        // - 1.0 = no damping (perfect conservation, chaos forever)
        // - 0.995 = very light damping (current setting)
        // - 0.9 = heavy damping (particles slow down quickly)
        // - 0.0 = instant stop (not realistic)
        this.damping = 0.995;
    }
    
    // -------------------------------------------------------------------------
    // APPLY COULOMB'S LAW - Calculate electric forces between all particles
    // -------------------------------------------------------------------------
    // This is the heart of the simulation!
    // 
    // Coulomb's Law describes the force between two charged particles:
    //
    //     F = k × (q₁ × q₂) / r²
    //
    // Let's break this down:
    // - F = the force (how strong is the push/pull?)
    // - k = Coulomb's constant (strength of electromagnetic force)
    // - q₁ = charge of particle 1 (-1, 0, or +1)
    // - q₂ = charge of particle 2 (-1, 0, or +1)
    // - r² = distance squared (how far apart are they?)
    //
    // KEY INSIGHTS:
    // 
    // 1. Sign of the force (attract vs repel):
    //    - Same charges (++ or --): q₁×q₂ is positive → repel (push away)
    //    - Opposite charges (+- or -+): q₁×q₂ is negative → attract (pull together)
    //    - Neutral (0): q₁×q₂ is zero → no force
    //
    // 2. Distance effect (the "squared" is important!):
    //    - Double the distance → force becomes 1/4 as strong
    //    - Triple the distance → force becomes 1/9 as strong
    //    - Close particles → VERY strong forces
    //    - Distant particles → weak forces
    //
    // 3. This is just like gravity, except:
    //    - Gravity always attracts (masses are always positive)
    //    - Electromagnetic force can attract OR repel (charges can be + or -)
    //
    // Parameter:
    //   particles: Array of all Particle objects in the simulation
    // -------------------------------------------------------------------------
    applyCoulombForce(particles) {
        // -----------------------------------------------------------------
        // NESTED LOOP - Compare every particle with every other particle
        // -----------------------------------------------------------------
        // We need to check each particle against every other particle
        // This is an O(n²) algorithm - it gets slower as we add more particles
        //
        // Example with 3 particles:
        // - Particle 0 checks against: 1, 2
        // - Particle 1 checks against: 2
        // - Particle 2: (no more checks needed, we already checked 0-2 and 1-2)
        //
        // We use i and j as counters (indices into the particles array)
        for (let i = 0; i < particles.length; i++) {
            // Start j at i+1 to avoid checking a particle against itself
            // and to avoid duplicate checks (we don't need both i-j and j-i)
            for (let j = i + 1; j < particles.length; j++) {
                // Get references to the two particles we're comparing
                // This makes the code more readable than particles[i] everywhere
                const p1 = particles[i];
                const p2 = particles[j];
                
                // -------------------------------------------------------------
                // STEP 1: Calculate the distance vector (dx, dy)
                // -------------------------------------------------------------
                // The distance vector points from particle 1 to particle 2
                // It tells us both:
                // - How far apart they are (magnitude)
                // - What direction to apply the force (direction)
                //
                // Visualization:
                //   p1 at (100, 100)    
                //          \
                //           \  <- distance vector (dx, dy)
                //            \
                //             p2 at (150, 200)
                //
                // dx = p2.x - p1.x = 150 - 100 = 50 (50 pixels to the right)
                // dy = p2.y - p1.y = 200 - 100 = 100 (100 pixels down)
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                
                // -------------------------------------------------------------
                // STEP 2: Calculate distance (magnitude of the distance vector)
                // -------------------------------------------------------------
                // Using the Pythagorean theorem: distance = √(dx² + dy²)
                //
                // Example from above:
                // distance = √(50² + 100²) = √(2500 + 10000) = √12500 ≈ 111.8 pixels
                //
                // This is the actual straight-line distance between the particles
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // -------------------------------------------------------------
                // STEP 3: Enforce minimum distance (prevent singularities)
                // -------------------------------------------------------------
                // If particles are too close, cap the distance at minDistance
                // This prevents division by a tiny number (which would give huge forces)
                //
                // A "singularity" in physics is when a value goes to infinity
                // In our case: as distance → 0, force = k×q₁×q₂/r² → infinity!
                // This would break our simulation
                //
                // Solution: if distance < 20, pretend it's 20
                if (distance < this.minDistance) {
                    distance = this.minDistance;
                }
                
                // -------------------------------------------------------------
                // STEP 4: Calculate force magnitude using Coulomb's Law
                // -------------------------------------------------------------
                // F = k × (q₁ × q₂) / r²
                //
                // Breaking it down:
                // - this.coulombConstant is k (5000)
                // - p1.charge is q₁ (-1, 0, or 1)
                // - p2.charge is q₂ (-1, 0, or 1)
                // - distance * distance is r²
                //
                // The sign of forceMagnitude tells us attract vs repel:
                // - Positive: repulsive force (same charges)
                // - Negative: attractive force (opposite charges)
                // - Zero: no force (at least one particle is neutral)
                let forceMagnitude = this.coulombConstant * p1.charge * p2.charge / (distance * distance);
                
                // -------------------------------------------------------------
                // STEP 5: Cap the force at maximum value
                // -------------------------------------------------------------
                // Prevent forces from getting too large
                // This keeps the simulation stable
                //
                // We check the absolute value (magnitude without sign)
                // Then cap it and restore the original sign
                if (Math.abs(forceMagnitude) > this.maxForce) {
                    // Math.sign(x) returns:
                    //  1 if x > 0 (repulsive force)
                    // -1 if x < 0 (attractive force)
                    //  0 if x = 0 (no force)
                    forceMagnitude = this.maxForce * Math.sign(forceMagnitude);
                }
                
                // -------------------------------------------------------------
                // STEP 6: Calculate the unit vector (direction)
                // -------------------------------------------------------------
                // A "unit vector" is a vector with length 1 that points in a direction
                // We need this to know which way to apply the force
                //
                // To get a unit vector: divide each component by the total distance
                // unitX = dx / distance
                // unitY = dy / distance
                //
                // Why? This "normalizes" the vector to length 1 while keeping direction
                //
                // Example: if dx = 50 and dy = 100 and distance = 111.8
                // unitX = 50 / 111.8 ≈ 0.447
                // unitY = 100 / 111.8 ≈ 0.894
                // Check: √(0.447² + 0.894²) ≈ 1.0 ✓ (it's a unit vector!)
                const unitX = dx / distance;
                const unitY = dy / distance;
                
                // -------------------------------------------------------------
                // STEP 7: Calculate force components (fx, fy)
                // -------------------------------------------------------------
                // Force is a vector (it has both magnitude and direction)
                // We need to split it into X and Y components
                //
                // force vector = magnitude × direction (unit vector)
                // fx = forceMagnitude × unitX
                // fy = forceMagnitude × unitY
                //
                // This gives us the force to apply in each axis
                const fx = forceMagnitude * unitX;
                const fy = forceMagnitude * unitY;
                
                // -------------------------------------------------------------
                // STEP 8: Apply forces to both particles
                // -------------------------------------------------------------
                // Newton's Third Law: "For every action, there's an equal and opposite reaction"
                //
                // If particle 1 pushes particle 2 to the right,
                // then particle 2 pushes particle 1 to the left with equal force
                //
                // That's why:
                // - p1 gets force (fx, fy)
                // - p2 gets force (-fx, -fy) - the opposite direction!
                //
                // The forces are equal in magnitude but opposite in direction
                p1.applyForce(fx, fy);      // Apply force to particle 1
                p2.applyForce(-fx, -fy);    // Apply opposite force to particle 2
            }
        }
    }
    
    // -------------------------------------------------------------------------
    // HANDLE BOUNDARIES - Make particles bounce off walls
    // -------------------------------------------------------------------------
    // When a particle hits the edge of the canvas, we need to:
    // 1. Keep it inside the boundaries (don't let it escape!)
    // 2. Make it bounce (reverse its velocity)
    //
    // This simulates "elastic collisions" with the walls
    //
    // Parameter:
    //   particles: Array of all Particle objects
    // -------------------------------------------------------------------------
    handleBoundaries(particles) {
        // Loop through each particle
        for (const particle of particles) {
            // -------------------------------------------------------------
            // LEFT AND RIGHT WALLS (X boundaries)
            // -------------------------------------------------------------
            // Left wall is at x = 0
            // Right wall is at x = this.width
            //
            // Check if particle has hit or passed through the left wall
            if (particle.x - particle.radius < 0) {
                // Put the particle back inside (at the edge)
                // particle.radius is how far the edge of the particle extends from center
                // So the leftmost point should be at x = particle.radius
                particle.x = particle.radius;
                
                // Reverse the X velocity to make it bounce
                // If vx = 5 (moving right), new vx = -5 (moving left)
                // If vx = -3 (moving left), new vx = 3 (moving right)
                particle.vx *= -1;
                
                // Apply damping to the bounce
                // This simulates energy loss in the collision
                // The particle bounces back but slightly slower
                // Think of it like a ball that loses a tiny bit of bounce each hit
                particle.vx *= this.damping;
                particle.vy *= this.damping;
            }
            
            // Check if particle has hit or passed through the right wall
            if (particle.x + particle.radius > this.width) {
                // Put particle back inside
                particle.x = this.width - particle.radius;
                
                // Reverse and dampen the X velocity
                particle.vx *= -1;
                particle.vx *= this.damping;
                particle.vy *= this.damping;
            }
            
            // -------------------------------------------------------------
            // TOP AND BOTTOM WALLS (Y boundaries)
            // -------------------------------------------------------------
            // Top wall is at y = 0
            // Bottom wall is at y = this.height
            //
            // Check if particle has hit or passed through the top wall
            if (particle.y - particle.radius < 0) {
                // Put particle back inside
                particle.y = particle.radius;
                
                // Reverse and dampen the Y velocity
                particle.vy *= -1;
                particle.vx *= this.damping;
                particle.vy *= this.damping;
            }
            
            // Check if particle has hit or passed through the bottom wall
            if (particle.y + particle.radius > this.height) {
                // Put particle back inside
                particle.y = this.height - particle.radius;
                
                // Reverse and dampen the Y velocity
                particle.vy *= -1;
                particle.vx *= this.damping;
                particle.vy *= this.damping;
            }
        }
    }
    
    // -------------------------------------------------------------------------
    // CALCULATE POTENTIAL ENERGY - Energy due to particle positions
    // -------------------------------------------------------------------------
    // Potential energy is "stored" energy based on the positions of particles
    //
    // Think of it like:
    // - A stretched spring has potential energy (it wants to snap back)
    // - A ball held high has gravitational potential energy (it wants to fall)
    // - Charged particles have electrical potential energy based on their arrangement
    //
    // For electrostatic forces, the potential energy between two particles is:
    //
    //     PE = k × (q₁ × q₂) / r
    //
    // Notice this is similar to the force equation but:
    // - Force uses 1/r² (inverse square)
    // - Potential energy uses 1/r (inverse)
    //
    // Key insights:
    // - Like charges (repelling): positive PE (energy would be released if they move apart)
    // - Opposite charges (attracting): negative PE (energy would be needed to pull them apart)
    // - The total PE tells us how much energy is "stored" in the configuration
    //
    // Parameter:
    //   particles: Array of all Particle objects
    //
    // Returns:
    //   Total potential energy of the system
    // -------------------------------------------------------------------------
    calculatePotentialEnergy(particles) {
        // Start with zero potential energy
        let potentialEnergy = 0;
        
        // Check every pair of particles (same nested loop pattern as applyCoulombForce)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                // Calculate distance between the particles
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Enforce minimum distance (same reason as in force calculation)
                if (distance < this.minDistance) {
                    distance = this.minDistance;
                }
                
                // Calculate potential energy for this pair: PE = k × q₁ × q₂ / r
                // Add it to the running total
                // Note: we use "distance" not "distance squared" for PE (unlike force)
                potentialEnergy += this.coulombConstant * p1.charge * p2.charge / distance;
            }
        }
        
        // Return the total potential energy
        return potentialEnergy;
    }
    
    // -------------------------------------------------------------------------
    // CALCULATE KINETIC ENERGY - Energy due to particle motion
    // -------------------------------------------------------------------------
    // Kinetic energy is the energy of motion
    // A moving particle has kinetic energy: KE = ½ × m × v²
    //
    // This method calculates the TOTAL kinetic energy of all particles
    // by summing up each particle's individual kinetic energy
    //
    // Parameter:
    //   particles: Array of all Particle objects
    //
    // Returns:
    //   Total kinetic energy of the system
    // -------------------------------------------------------------------------
    calculateKineticEnergy(particles) {
        // Start with zero kinetic energy
        let kineticEnergy = 0;
        
        // Add up the kinetic energy from each particle
        for (const particle of particles) {
            // Each particle has a getKineticEnergy() method that returns its KE
            // We just sum them all up
            kineticEnergy += particle.getKineticEnergy();
        }
        
        // Return the total kinetic energy
        return kineticEnergy;
    }
    
    // -------------------------------------------------------------------------
    // CALCULATE TOTAL ENERGY - Sum of kinetic and potential energy
    // -------------------------------------------------------------------------
    // The Law of Conservation of Energy states:
    // "Energy cannot be created or destroyed, only transformed"
    //
    // In our simulation:
    // - Total Energy = Kinetic Energy + Potential Energy
    // - As particles move (KE changes), the PE changes to compensate
    // - The total should stay roughly constant (minor changes due to damping)
    //
    // Example:
    // - Two opposite charges move toward each other:
    //   - They speed up (KE increases)
    //   - They get closer (PE decreases - becomes more negative)
    //   - Total energy stays the same!
    //
    // This method is useful for:
    // - Verifying our simulation is working correctly
    // - Displaying energy info to the user
    // - Debugging (if total energy changes wildly, something's wrong!)
    //
    // Parameter:
    //   particles: Array of all Particle objects
    //
    // Returns:
    //   Total energy of the system (KE + PE)
    // -------------------------------------------------------------------------
    calculateTotalEnergy(particles) {
        // Get kinetic energy (energy of motion)
        const ke = this.calculateKineticEnergy(particles);
        
        // Get potential energy (energy of position/configuration)
        const pe = this.calculatePotentialEnergy(particles);
        
        // Return the sum
        // Note: PE can be negative (attractive forces), so total might be negative too
        return ke + pe;
    }
}
