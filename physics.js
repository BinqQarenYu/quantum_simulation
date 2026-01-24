class PhysicsEngine {
    constructor() {
        // Coulomb's constant (scaled for simulation)
        this.k = 500;
        this.forceMultiplier = 1.0;
        this.minDistance = 20; // Prevent singularity
    }

    calculateForce(p1, p2) {
        // Calculate distance
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Prevent division by zero and singularities
        if (distance < this.minDistance) {
            distance = this.minDistance;
        }
        
        // Coulomb's Law: F = k * (q1 * q2) / r^2
        const forceMagnitude = (this.k * p1.charge * p2.charge * this.forceMultiplier) / (distance * distance);
        
        // Calculate force components (normalize direction)
        const fx = (forceMagnitude * dx) / distance;
        const fy = (forceMagnitude * dy) / distance;
        
        return { fx, fy, distance };
    }

    applyForces(particles) {
        // Apply forces between all particle pairs
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                // Skip if both particles are neutral
                if (p1.charge === 0 && p2.charge === 0) continue;
                
                const { fx, fy } = this.calculateForce(p1, p2);
                
                // Apply equal and opposite forces (Newton's 3rd Law)
                p1.applyForce(fx, fy);
                p2.applyForce(-fx, -fy);
            }
        }
    }

    updateParticles(particles, canvasWidth, canvasHeight, dt = 1) {
        // Update each particle
        for (let particle of particles) {
            particle.update(dt);
            particle.checkBoundary(canvasWidth, canvasHeight);
        }
    }

    calculateTotalEnergy(particles) {
        let kineticEnergy = 0;
        let potentialEnergy = 0;
        
        // Calculate kinetic energy
        for (let particle of particles) {
            kineticEnergy += particle.getKineticEnergy();
        }
        
        // Calculate potential energy
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                if (p1.charge === 0 && p2.charge === 0) continue;
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // PE = k * (q1 * q2) / r
                potentialEnergy += (this.k * p1.charge * p2.charge * this.forceMultiplier) / distance;
            }
        }
        
        return {
            kinetic: kineticEnergy,
            potential: potentialEnergy,
            total: kineticEnergy + potentialEnergy
        };
    }

    setForceMultiplier(value) {
        this.forceMultiplier = value;
    }
}
