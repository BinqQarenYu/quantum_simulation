class App {
    constructor() {
        // Initialize simulation
        this.simulation = new Simulation('simulation-canvas');
        
        // Get UI elements
        this.particleCountDisplay = document.getElementById('particle-count');
        this.totalEnergyDisplay = document.getElementById('total-energy');
        this.avgVelocityDisplay = document.getElementById('avg-velocity');
        this.fpsDisplay = document.getElementById('fps');
        
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        this.particleSlider = document.getElementById('particle-slider');
        this.particleValue = document.getElementById('particle-value');
        
        this.forceSlider = document.getElementById('force-slider');
        this.forceValue = document.getElementById('force-value');
        
        // Initialize simulation
        this.currentParticleCount = parseInt(this.particleSlider.value);
        this.simulation.initializeParticles(this.currentParticleCount);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start simulation
        this.simulation.start();
        
        // Start statistics update loop
        this.updateStats();
    }
    
    setupEventListeners() {
        // Pause button
        this.pauseBtn.addEventListener('click', () => {
            const isPaused = this.simulation.togglePause();
            this.pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.simulation.reset(this.currentParticleCount);
        });
        
        // Particle count slider
        this.particleSlider.addEventListener('input', (e) => {
            const count = parseInt(e.target.value);
            this.particleValue.textContent = count;
            this.currentParticleCount = count;
            this.simulation.reset(count);
        });
        
        // Force strength slider
        this.forceSlider.addEventListener('input', (e) => {
            const force = parseFloat(e.target.value);
            this.forceValue.textContent = force.toFixed(1);
            this.simulation.setForceMultiplier(force);
        });
    }
    
    updateStats() {
        const stats = this.simulation.getStats();
        
        this.particleCountDisplay.textContent = stats.particleCount;
        this.totalEnergyDisplay.textContent = stats.totalEnergy;
        this.avgVelocityDisplay.textContent = stats.avgVelocity;
        this.fpsDisplay.textContent = stats.fps;
        
        // Update stats periodically
        requestAnimationFrame(() => this.updateStats());
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
