class Simulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.physics = new PhysicsEngine();
        this.isPaused = false;
        this.forceMultiplier = 1.0;
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        this.maxFieldLineDistance = 200; // Maximum distance to draw field lines
        
        this.setupCanvas();
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Update particle boundary references
        this.particles.forEach(p => {
            p.canvasWidth = this.canvas.width;
            p.canvasHeight = this.canvas.height;
        });
    }
    
    // Initialize particles with random positions and charges
    initializeParticles(count) {
        this.particles = [];
        const padding = 30;
        
        for (let i = 0; i < count; i++) {
            const x = padding + Math.random() * (this.canvas.width - 2 * padding);
            const y = padding + Math.random() * (this.canvas.height - 2 * padding);
            
            // Charge distribution: 40% positive, 40% negative, 20% neutral
            let charge;
            const rand = Math.random();
            if (rand < 0.4) {
                charge = 1; // Positive
            } else if (rand < 0.8) {
                charge = -1; // Negative
            } else {
                charge = 0; // Neutral
            }
            
            this.particles.push(new Particle(x, y, charge, this.canvas.width, this.canvas.height));
        }
    }
    
    // Draw field lines between interacting particles
    drawFieldLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // Skip if either particle is neutral
                if (p1.charge === 0 || p2.charge === 0) continue;
                
                // Calculate distance
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only draw lines within max distance
                if (distance > this.maxFieldLineDistance) continue;
                
                // Calculate opacity based on distance
                const opacity = 1 - (distance / this.maxFieldLineDistance);
                
                // Determine line color based on interaction
                // Same sign = repulsive (red), opposite sign = attractive (green)
                const isAttractive = (p1.charge * p2.charge) < 0;
                const color = isAttractive ? `rgba(68, 255, 68, ${opacity * 0.3})` : `rgba(255, 68, 68, ${opacity * 0.3})`;
                
                // Draw line
                this.ctx.save();
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    }
    
    // Update simulation state
    update(deltaTime) {
        if (this.isPaused) return;
        
        // Limit delta time to prevent instability
        const dt = Math.min(deltaTime, 0.033); // Cap at ~30 FPS equivalent
        
        // Apply forces
        this.physics.applyForces(this.particles, this.forceMultiplier);
        
        // Update particles
        this.particles.forEach(p => {
            p.updateVelocity(dt);
            p.updatePosition(dt);
        });
    }
    
    // Render simulation
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field lines
        this.drawFieldLines();
        
        // Render particles
        this.particles.forEach(p => {
            p.render(this.ctx);
            p.renderVelocity(this.ctx);
        });
    }
    
    // Animation loop
    animate(currentTime) {
        // Calculate delta time in seconds
        const deltaTime = this.lastTime ? (currentTime - this.lastTime) / 1000 : 0;
        this.lastTime = currentTime;
        
        // Update FPS counter
        this.frameCount++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= 1.0) {
            this.fps = Math.round(this.frameCount / this.fpsTime);
            this.frameCount = 0;
            this.fpsTime = 0;
        }
        
        // Update and render
        this.update(deltaTime);
        this.render();
        
        // Continue animation loop
        requestAnimationFrame((time) => this.animate(time));
    }
    
    // Start simulation
    start() {
        this.lastTime = 0;
        requestAnimationFrame((time) => this.animate(time));
    }
    
    // Pause/resume simulation
    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }
    
    // Reset simulation
    reset(particleCount) {
        this.initializeParticles(particleCount);
    }
    
    // Set force multiplier
    setForceMultiplier(multiplier) {
        this.forceMultiplier = multiplier;
    }
    
    // Get statistics
    getStats() {
        const energy = this.physics.calculateTotalEnergy(this.particles);
        const avgVelocity = this.physics.calculateAverageVelocity(this.particles);
        
        return {
            particleCount: this.particles.length,
            totalEnergy: energy.total.toFixed(2),
            avgVelocity: avgVelocity.toFixed(2),
            fps: this.fps
        };
    }
}
