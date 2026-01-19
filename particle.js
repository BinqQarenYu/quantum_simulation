class Particle {
    constructor(x, y, charge, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.ax = 0;
        this.ay = 0;
        this.charge = charge; // -1, 0, or 1
        this.mass = 1;
        this.radius = 6;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Color based on charge
        if (charge > 0) {
            this.color = '#ff4444'; // Red for positive
        } else if (charge < 0) {
            this.color = '#4444ff'; // Blue for negative
        } else {
            this.color = '#44ff44'; // Green for neutral
        }
    }
    
    // Calculate kinetic energy
    getKineticEnergy() {
        const v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        return 0.5 * this.mass * v * v;
    }
    
    // Update velocity based on acceleration
    updateVelocity(dt) {
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        
        // Apply damping
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    // Update position based on velocity
    updatePosition(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Check boundary collisions
        this.checkBoundaries();
    }
    
    // Check and handle boundary collisions
    checkBoundaries() {
        const restitution = 0.8; // Energy loss on collision
        
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = Math.abs(this.vx) * restitution;
        } else if (this.x + this.radius > this.canvasWidth) {
            this.x = this.canvasWidth - this.radius;
            this.vx = -Math.abs(this.vx) * restitution;
        }
        
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy) * restitution;
        } else if (this.y + this.radius > this.canvasHeight) {
            this.y = this.canvasHeight - this.radius;
            this.vy = -Math.abs(this.vy) * restitution;
        }
    }
    
    // Reset acceleration
    resetAcceleration() {
        this.ax = 0;
        this.ay = 0;
    }
    
    // Apply force to particle
    applyForce(fx, fy) {
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }
    
    // Render particle with glow effect
    render(ctx) {
        // Draw glow effect
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Draw inner highlight
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(this.x - 2, this.y - 2, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        
        ctx.restore();
    }
    
    // Render velocity vector
    renderVelocity(ctx) {
        const scale = 5; // Scale factor for visibility
        const vx = this.vx * scale;
        const vy = this.vy * scale;
        const length = Math.sqrt(vx * vx + vy * vy);
        
        if (length > 0.5) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            
            // Draw velocity line
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + vx, this.y + vy);
            ctx.stroke();
            
            // Draw arrowhead
            const angle = Math.atan2(vy, vx);
            const arrowSize = 6;
            ctx.beginPath();
            ctx.moveTo(this.x + vx, this.y + vy);
            ctx.lineTo(
                this.x + vx - arrowSize * Math.cos(angle - Math.PI / 6),
                this.y + vy - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(this.x + vx, this.y + vy);
            ctx.lineTo(
                this.x + vx - arrowSize * Math.cos(angle + Math.PI / 6),
                this.y + vy - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
            
            ctx.restore();
        }
    }
}
