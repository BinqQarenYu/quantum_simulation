class App {
    constructor() {
        this.simulation = null;
        this.isPaused = false;
        this.initialize();
    }

    initialize() {
        // Get DOM elements
        const canvas = document.getElementById('simulationCanvas');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.particleSlider = document.getElementById('particleSlider');
        this.particleSliderValue = document.getElementById('particleSliderValue');
        this.forceSlider = document.getElementById('forceSlider');
        this.forceSliderValue = document.getElementById('forceSliderValue');
        this.timeSlider = document.getElementById('timeSlider');
        this.timeSliderValue = document.getElementById('timeSliderValue');
        this.zoomSlider = document.getElementById('zoomSlider');
        this.zoomSliderValue = document.getElementById('zoomSliderValue');
        
        // Statistics elements
        this.particleCountEl = document.getElementById('particleCount');
        this.totalEnergyEl = document.getElementById('totalEnergy');
        this.avgVelocityEl = document.getElementById('avgVelocity');
        this.fpsEl = document.getElementById('fps');
        
        // Create simulation
        this.simulation = new Simulation(canvas);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start simulation
        this.simulation.start();
        
        // Start statistics update loop
        this.updateStatistics();
    }

    setupEventListeners() {
        // Pause/Resume button
        this.pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            
            if (this.isPaused) {
                this.simulation.pause();
                this.pauseBtn.textContent = 'Resume';
            } else {
                this.simulation.start();
                this.pauseBtn.textContent = 'Pause';
            }
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.simulation.reset();
        });
        
        // Particle count slider
        this.particleSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.particleSliderValue.textContent = value;
            this.simulation.setParticleCount(value);
        });
        
        // Force strength slider
        this.forceSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.forceSliderValue.textContent = value.toFixed(1);
            this.simulation.setForceStrength(value);
        });
        
        // Time scale slider
        this.timeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.timeSliderValue.textContent = value.toFixed(1) + 'x';
            this.simulation.setTimeScale(value);
        });
        
        // Zoom slider
        this.zoomSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.zoomSliderValue.textContent = value.toFixed(1) + 'x';
            this.simulation.setZoom(value);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.simulation.setupCanvas();
            this.simulation.reset();
        });
    }

    updateStatistics() {
        const stats = this.simulation.getStatistics();
        
        this.particleCountEl.textContent = stats.particleCount;
        this.totalEnergyEl.textContent = stats.totalEnergy;
        this.avgVelocityEl.textContent = stats.avgVelocity;
        this.fpsEl.textContent = stats.fps;
        
        requestAnimationFrame(() => this.updateStatistics());
    }

    run() {
        // Application is already running from initialize()
        console.log('Quantum Particle Simulation is running!');
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.run();
});
