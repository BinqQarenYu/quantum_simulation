class PhysicsEngine {
    constructor() {
        this.k = 500; // Scaled Coulomb constant for better visualization
        this.minDistance = 20; // Minimum distance to prevent singularities
        this.maxForce = 5; // Maximum force to prevent instability
    }
    
    // Calculate Coulomb force between two particles
    calculateCoulombForce(p1, p2) {
        // Calculate distance
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Prevent singularities
        if (distance < this.minDistance) {
            distance = this.minDistance;
        }
        
        // Coulomb's Law: F = k * (q1 * q2) / r^2
        let forceMagnitude = (this.k * p1.charge * p2.charge) / (distance * distance);
        
        // Apply maximum force limit
        if (Math.abs(forceMagnitude) > this.maxForce) {
            forceMagnitude = Math.sign(forceMagnitude) * this.maxForce;
        }
        
        // Calculate force components
        const fx = forceMagnitude * (dx / distance);
        const fy = forceMagnitude * (dy / distance);
        
        return { fx, fy, distance };
    }
    
    // Calculate potential energy between two particles
    calculatePotentialEnergy(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Prevent singularities
        if (distance < this.minDistance) {
            distance = this.minDistance;
        }
        
        // Potential Energy: PE = k * (q1 * q2) / r
        return (this.k * p1.charge * p2.charge) / distance;
    }
    
    // Apply forces to all particles
    applyForces(particles, forceMultiplier = 1.0) {
        // Reset accelerations
        particles.forEach(p => p.resetAcceleration());
        
        // Calculate forces between all pairs
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                // Skip if either particle is neutral
                if (p1.charge === 0 || p2.charge === 0) continue;
                
                const { fx, fy } = this.calculateCoulombForce(p1, p2);
                
                // Apply force with multiplier
                p1.applyForce(fx * forceMultiplier, fy * forceMultiplier);
                p2.applyForce(-fx * forceMultiplier, -fy * forceMultiplier);
            }
        }
    }
    
    // Calculate total system energy
    calculateTotalEnergy(particles) {
        let kineticEnergy = 0;
        let potentialEnergy = 0;
        
        // Sum kinetic energy
        particles.forEach(p => {
            kineticEnergy += p.getKineticEnergy();
        });
        
        // Sum potential energy (only count each pair once)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                if (p1.charge !== 0 && p2.charge !== 0) {
                    potentialEnergy += this.calculatePotentialEnergy(p1, p2);
                }
            }
        }
        
        return {
            kinetic: kineticEnergy,
            potential: potentialEnergy,
            total: kineticEnergy + potentialEnergy
        };
    }
    
    // Calculate average velocity
    calculateAverageVelocity(particles) {
        if (particles.length === 0) return 0;
        
        let totalVelocity = 0;
        particles.forEach(p => {
            const v = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            totalVelocity += v;
        });
        
        return totalVelocity / particles.length;
    }
}
