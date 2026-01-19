# Quantum Particle Simulation

Visually simulated particles so humans can understand how they work, from their fundamental interactions, fields, and mathematical dimensions.

## Features

### Visual Simulation
- Real-time particle physics simulation with interactive canvas
- Particles with positive (red), negative (blue), and neutral (green) charges
- Visual field lines showing attractive and repulsive forces
- Velocity vectors displayed for each particle
- Glowing particle effects for enhanced visualization

### Mathematical Physics Engine
- **Coulomb's Law**: Electrostatic force calculations between charged particles
- **Newton's Second Law**: Force to acceleration conversion (F = ma)
- **Kinematic Equations**: Position and velocity updates
- **Energy Conservation**: Kinetic and potential energy tracking
- **Elastic Collisions**: Boundary reflection physics
- **Damping**: Energy dissipation for stable simulation

### UI Panel Features
- **Mathematical Formulas Display**: Real-time display of physics equations
- **Live Statistics**: 
  - Total particle count
  - Total system energy
  - Average particle velocity
  - Frame rate monitoring
- **Interactive Controls**:
  - Pause/Resume simulation
  - Reset particles
  - Adjust particle count (5-100 particles)
  - Adjust force strength
- **Color-coded Legend**: Visual guide for particle types

## How to Use

1. Open `index.html` in a web browser
2. Watch particles interact based on their charges:
   - Like charges repel (red-red, blue-blue)
   - Opposite charges attract (red-blue)
3. Use controls to modify simulation:
   - Adjust particle count slider
   - Modify force strength
   - Pause to observe particle positions
   - Reset to generate new particle configuration

## Physics Implementation

### Fundamental Interactions
The simulation implements electromagnetic interactions using Coulomb's Law:
```
F = k × (q₁ × q₂) / r²
```

### Field Visualization
- Green lines: Attractive forces between opposite charges
- Red lines: Repulsive forces between like charges
- Line opacity indicates interaction strength

### Mathematical Dimensions
All formulas used in the simulation are displayed in the right panel:
- Force calculations
- Acceleration and velocity updates
- Position integration
- Energy computations

## Technical Details
- Pure HTML/CSS/JavaScript implementation
- Canvas-based 2D rendering
- Real-time physics simulation at 60 FPS
- Responsive UI with modern glassmorphism design
- No external dependencies required