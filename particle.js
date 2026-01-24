class Particle {
    constructor(x, y, charge = 0, type = 'free') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.ax = 0;
        this.ay = 0;
        this.charge = charge; // -1 (negative), 0 (neutral), 1 (positive)
        this.mass = 1;
        this.type = type; // 'electron', 'proton', 'neutron', 'quark', 'free'
        
        // Type-specific properties
        if (type === 'electron') {
            this.radius = 4;
            this.mass = 0.1;
            this.charge = -1;
            this.orbitalRadius = 0;
            this.orbitalAngle = 0;
            this.orbitalSpeed = 0.02;
            this.nucleus = null;
        } else if (type === 'proton') {
            this.radius = 8;
            this.mass = 1836;
            this.charge = 1;
            this.quarks = [];
        } else if (type === 'neutron') {
            this.radius = 8;
            this.mass = 1839;
            this.charge = 0;
            this.quarks = [];
        } else if (type === 'quark') {
            this.radius = 2;
            this.mass = 0.3;
            this.parent = null;
            this.localAngle = Math.random() * Math.PI * 2;
            this.localRadius = 5;
        } else {
            this.radius = 8;
        }
        
        // Damping factor for stability
        this.damping = 0.99;
    }

    update(dt = 1) {
        if (this.type === 'electron' && this.nucleus) {
            // Orbital motion around nucleus
            this.orbitalAngle += this.orbitalSpeed * dt;
            this.x = this.nucleus.x + Math.cos(this.orbitalAngle) * this.orbitalRadius;
            this.y = this.nucleus.y + Math.sin(this.orbitalAngle) * this.orbitalRadius;
        } else if (this.type === 'quark' && this.parent) {
            // Quarks orbit within their parent nucleon
            this.localAngle += 0.05 * dt;
            this.x = this.parent.x + Math.cos(this.localAngle) * this.localRadius;
            this.y = this.parent.y + Math.sin(this.localAngle) * this.localRadius;
        } else if (this.isNucleus) {
            // Nucleus particles stay in formation at center
            // Don't move, just reset forces
        } else {
            // Normal physics for free particles
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
            
            // Apply damping
            this.vx *= this.damping;
            this.vy *= this.damping;
            
            // Update position from velocity
            this.x += this.vx * dt;
            this.y += this.vy * dt;
        }
        
        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
    }

    applyForce(fx, fy) {
        // F = ma, so a = F/m
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }

    checkBoundary(width, height) {
        // Elastic collision with boundaries
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = Math.abs(this.vx);
        } else if (this.x + this.radius > width) {
            this.x = width - this.radius;
            this.vx = -Math.abs(this.vx);
        }
        
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy);
        } else if (this.y + this.radius > height) {
            this.y = height - this.radius;
            this.vy = -Math.abs(this.vy);
        }
    }

    display(ctx, zoomLevel = 1) {
        let color, glowColor;
        
        if (this.type === 'electron') {
            color = '#00ffff';
            glowColor = 'rgba(0, 255, 255, ';
        } else if (this.type === 'proton') {
            color = '#ff4444';
            glowColor = 'rgba(255, 68, 68, ';
        } else if (this.type === 'neutron') {
            color = '#cccccc';
            glowColor = 'rgba(204, 204, 204, ';
        } else if (this.type === 'quark') {
            // Different colors for up and down quarks
            if (this.quarkType === 'up') {
                color = '#ff00ff'; // Magenta for up quark
            } else {
                color = '#00ff00'; // Green for down quark
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add quark label
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${8 / zoomLevel}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.quarkType === 'up' ? 'u' : 'd', this.x, this.y);
            return;
        } else {
            // Free particles
            if (this.charge > 0) {
                color = '#ff4444';
                glowColor = 'rgba(255, 68, 68, ';
            } else if (this.charge < 0) {
                color = '#4444ff';
                glowColor = 'rgba(68, 68, 255, ';
            } else {
                color = '#44ff44';
                glowColor = 'rgba(68, 255, 68, ';
            }
        }
        
        // Draw glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, glowColor + '0.8)');
        gradient.addColorStop(0.5, glowColor + '0.4)');
        gradient.addColorStop(1, glowColor + '0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw particle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw particle label
        if (this.type === 'electron' || this.type === 'proton' || this.type === 'neutron') {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${10 / zoomLevel}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (this.type === 'electron') ctx.fillText('e⁻', this.x, this.y);
            if (this.type === 'proton') ctx.fillText('p⁺', this.x, this.y);
            if (this.type === 'neutron') ctx.fillText('n', this.x, this.y);
            
            // Add descriptive label next to particle
            ctx.font = `bold ${11 / zoomLevel}px Arial`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            const labelY = this.y + this.radius + 15;
            let labelText = '';
            if (this.type === 'electron') labelText = 'Electron';
            if (this.type === 'proton') labelText = 'Proton';
            if (this.type === 'neutron') labelText = 'Neutron';
            
            const textWidth = ctx.measureText(labelText).width;
            ctx.fillRect(this.x - textWidth/2 - 4, labelY - 8, textWidth + 8, 14);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(labelText, this.x, labelY);
        }
        
        // Draw velocity vector for free particles
        if (this.type === 'free') {
            const scale = 5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2 / zoomLevel;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.vx * scale, this.y + this.vy * scale);
            ctx.stroke();
            
            // Add charge label
            ctx.font = `bold ${10 / zoomLevel}px Arial`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            const labelY = this.y + this.radius + 13;
            let labelText = '';
            if (this.charge > 0) labelText = 'Positive';
            else if (this.charge < 0) labelText = 'Negative';
            else labelText = 'Neutral';
            
            const textWidth = ctx.measureText(labelText).width;
            ctx.fillRect(this.x - textWidth/2 - 3, labelY - 7, textWidth + 6, 12);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(labelText, this.x, labelY);
        }
    }

    getKineticEnergy() {
        const v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        return 0.5 * this.mass * v * v;
    }

    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
}
