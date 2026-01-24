class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.physicsEngine = new PhysicsEngine();
        this.isRunning = false;
        this.particleCount = 30;
        this.timeScale = 1.0;
        this.zoomLevel = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // FPS tracking
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.fpsUpdateTime = 0;
        
        this.setupCanvas();
        this.initializeParticles();
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    initializeParticles() {
        this.particles = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Store nucleus position (always centered)
        this.nucleus = { x: centerX, y: centerY };
        
        // Create nucleus at center (protons and neutrons)
        const protonCount = Math.max(2, Math.floor(this.particleCount / 10));
        const neutronCount = Math.max(2, Math.floor(this.particleCount / 10));
        
        // Create protons in tight nucleus formation
        for (let i = 0; i < protonCount; i++) {
            const angle = (i / protonCount) * Math.PI * 2;
            const offset = 12;
            const x = centerX + Math.cos(angle) * offset;
            const y = centerY + Math.sin(angle) * offset;
            const proton = new Particle(x, y, 1, 'proton');
            proton.vx = 0;
            proton.vy = 0;
            proton.isNucleus = true;
            
            // Add quarks to proton (2 up quarks, 1 down quark)
            for (let j = 0; j < 3; j++) {
                const quark = new Particle(x, y, j < 2 ? 2/3 : -1/3, 'quark');
                quark.parent = proton;
                quark.localAngle = (j / 3) * Math.PI * 2;
                quark.quarkType = j < 2 ? 'up' : 'down';
                proton.quarks.push(quark);
                this.particles.push(quark);
            }
            
            this.particles.push(proton);
        }
        
        // Create neutrons in tight nucleus formation
        for (let i = 0; i < neutronCount; i++) {
            const angle = (i / neutronCount) * Math.PI * 2 + Math.PI / neutronCount;
            const offset = 12;
            const x = centerX + Math.cos(angle) * offset;
            const y = centerY + Math.sin(angle) * offset;
            const neutron = new Particle(x, y, 0, 'neutron');
            neutron.vx = 0;
            neutron.vy = 0;
            neutron.isNucleus = true;
            
            // Add quarks to neutron (1 up quark, 2 down quarks)
            for (let j = 0; j < 3; j++) {
                const quark = new Particle(x, y, j < 1 ? 2/3 : -1/3, 'quark');
                quark.parent = neutron;
                quark.localAngle = (j / 3) * Math.PI * 2;
                quark.quarkType = j < 1 ? 'up' : 'down';
                neutron.quarks.push(quark);
                this.particles.push(quark);
            }
            
            this.particles.push(neutron);
        }
        
        // Create electrons in orbital shells
        const electronCount = Math.min(protonCount, Math.floor(this.particleCount - protonCount - neutronCount));
        const shellRadii = [80, 140, 200, 260]; // Different orbital shells
        
        for (let i = 0; i < electronCount; i++) {
            const shellIndex = Math.min(Math.floor(i / 2), shellRadii.length - 1);
            const shell = shellRadii[shellIndex];
            const angle = Math.random() * Math.PI * 2;
            
            const electron = new Particle(centerX, centerY, -1, 'electron');
            electron.nucleus = this.nucleus;
            electron.orbitalRadius = shell;
            electron.orbitalAngle = angle;
            electron.orbitalSpeed = 0.02 / (shellIndex + 1); // Outer shells move slower
            
            this.particles.push(electron);
        }
        
        // Add some free particles
        const freeParticleCount = Math.max(0, this.particleCount - this.particles.length);
        const padding = 50;
        
        for (let i = 0; i < freeParticleCount; i++) {
            const x = padding + Math.random() * (this.canvas.width - 2 * padding);
            const y = padding + Math.random() * (this.canvas.height - 2 * padding);
            
            let charge;
            const rand = Math.random();
            if (rand < 0.4) charge = 1;
            else if (rand < 0.8) charge = -1;
            else charge = 0;
            
            this.particles.push(new Particle(x, y, charge, 'free'));
        }
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    pause() {
        this.isRunning = false;
    }

    reset() {
        this.initializeParticles();
        if (!this.isRunning) {
            this.render();
        }
    }

    setParticleCount(count) {
        this.particleCount = count;
        this.reset();
    }

    setForceStrength(value) {
        this.physicsEngine.setForceMultiplier(value);
    }

    setTimeScale(value) {
        this.timeScale = value;
    }

    setZoom(value) {
        this.zoomLevel = value;
    }

    animate() {
        if (!this.isRunning) return;
        
        // Calculate FPS
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.frameCount++;
        this.fpsUpdateTime += deltaTime;
        
        if (this.fpsUpdateTime >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / this.fpsUpdateTime);
            this.frameCount = 0;
            this.fpsUpdateTime = 0;
        }
        
        // Physics update with time scaling
        this.physicsEngine.applyForces(this.particles);
        this.physicsEngine.updateParticles(this.particles, this.canvas.width, this.canvas.height, this.timeScale);
        
        // Render
        this.render();
        
        requestAnimationFrame(() => this.animate());
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply zoom transformation
        this.ctx.save();
        
        // Center the zoom on the nucleus
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(this.zoomLevel, this.zoomLevel);
        this.ctx.translate(-centerX, -centerY);
        
        // Draw electron orbital paths
        this.drawOrbitalPaths();
        
        // Draw field lines
        this.drawFieldLines();
        
        // Draw nucleus boundary
        if (this.nucleus) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2 / this.zoomLevel;
            this.ctx.beginPath();
            this.ctx.arc(this.nucleus.x, this.nucleus.y, 35, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Label
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = `bold ${12 / this.zoomLevel}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Nucleus', this.nucleus.x, this.nucleus.y - 45);
        }
        
        // Draw particles
        for (let particle of this.particles) {
            particle.display(this.ctx, this.zoomLevel);
        }
        
        this.ctx.restore();
    }
    
    drawOrbitalPaths() {
        if (!this.nucleus) return;
        
        const shells = new Map();
        const shellNames = ['K Shell', 'L Shell', 'M Shell', 'N Shell'];
        let shellIndex = 0;
        
        for (let particle of this.particles) {
            if (particle.type === 'electron') {
                if (!shells.has(particle.orbitalRadius)) {
                    shells.set(particle.orbitalRadius, shellNames[shellIndex % shellNames.length]);
                    shellIndex++;
                }
            }
        }
        
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let [radius, name] of shells) {
            this.ctx.beginPath();
            this.ctx.arc(this.nucleus.x, this.nucleus.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Add shell label
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            this.ctx.font = 'bold 11px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(name, this.nucleus.x + radius, this.nucleus.y - 5);
        }
    }

    drawFieldLines() {
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // Skip neutral particles
                if (p1.charge === 0 && p2.charge === 0) continue;
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only draw lines for nearby particles
                if (distance > 200) continue;
                
                const { fx } = this.physicsEngine.calculateForce(p1, p2);
                
                // Determine line color based on interaction
                if ((p1.charge > 0 && p2.charge > 0) || (p1.charge < 0 && p2.charge < 0)) {
                    // Repulsive force (same charges)
                    this.ctx.strokeStyle = `rgba(255, 100, 100, ${0.3 * (1 - distance / 200)})`;
                } else if (p1.charge * p2.charge < 0) {
                    // Attractive force (opposite charges)
                    this.ctx.strokeStyle = `rgba(100, 255, 100, ${0.3 * (1 - distance / 200)})`;
                } else {
                    continue; // Skip neutral interactions
                }
                
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        }
    }

    getStatistics() {
        const energy = this.physicsEngine.calculateTotalEnergy(this.particles);
        let totalSpeed = 0;
        
        for (let particle of this.particles) {
            totalSpeed += particle.getSpeed();
        }
        
        const avgSpeed = this.particles.length > 0 ? totalSpeed / this.particles.length : 0;
        
        return {
            particleCount: this.particles.length,
            totalEnergy: energy.total.toFixed(2),
            avgVelocity: avgSpeed.toFixed(2),
            fps: this.fps
        };
    }
}
