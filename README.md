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

## For Beginners

### 📚 Learning Resources

This project is extensively commented to help beginners learn programming and physics! Every line of code has clear explanations.

#### **Start Here:**
1. **Read EXPLANATION.md** - Comprehensive guide covering:
   - How the entire application works
   - Key programming concepts (OOP, animation loops, event handling)
   - Physics explained in simple terms
   - Common questions answered
   - Complete glossary of terms

2. **Explore the Code** - Each file has detailed comments:
   - `particle.js` - Learn about classes and objects
   - `physics.js` - Understand Coulomb's Law and forces
   - `simulation.js` - Discover animation loops and canvas
   - `main.js` - See how UI connects to code
   - `index.html` - Learn HTML structure and semantic tags
   - `styles.css` - Master CSS, flexbox, and glassmorphism

### 🎯 What You'll Learn

#### **Programming Concepts:**
- **Object-Oriented Programming**: Classes, objects, methods, properties
- **Event Handling**: How user interactions work (clicks, sliders)
- **Animation Loops**: Creating smooth 60 FPS animations
- **Canvas API**: Drawing graphics with JavaScript
- **DOM Manipulation**: Updating webpage content dynamically
- **Modern JavaScript**: Arrow functions, const/let, template literals

#### **Physics Concepts:**
- **Coulomb's Law**: Electromagnetic forces between charges
- **Newton's Laws**: Force, mass, and acceleration
- **Kinematics**: Motion equations (velocity, position)
- **Energy Conservation**: Kinetic and potential energy
- **Vector Mathematics**: Working with direction and magnitude

#### **Web Development:**
- **HTML5**: Semantic elements, forms, canvas
- **CSS3**: Flexbox, gradients, animations, responsive design
- **Design Patterns**: Glassmorphism, modern UI/UX

### 🚀 Getting Started Guide

#### **Prerequisites:**
- Basic understanding of variables and functions
- Text editor (VS Code, Sublime Text, or any editor)
- Web browser (Chrome, Firefox, Safari, Edge)
- Curiosity and willingness to experiment!

#### **How to Run:**
1. Download or clone this repository
2. Open `index.html` in your web browser
3. That's it! No installation or build process needed

#### **How to Learn:**
1. **Start with EXPLANATION.md** for the big picture
2. **Read code comments** starting with `particle.js`
3. **Experiment**: Change values and see what happens!
4. **Break it**: Try modifying code - breaking things teaches you how they work
5. **Build features**: Add your own enhancements

### 💡 Experiment Ideas

Try these modifications to learn by doing:

#### **Easy Changes:**
- Change particle colors in `particle.js` (line where colors are set)
- Adjust starting particle count in `main.js`
- Modify force strength default value
- Change canvas background color in `styles.css`

#### **Intermediate Challenges:**
- Add a fourth particle type with different color
- Implement a "gravity" mode that pulls particles down
- Add a particle counter that shows each charge type separately
- Create keyboard shortcuts (spacebar = pause, R = reset)

#### **Advanced Projects:**
- Implement particle trails (draw fading lines showing paths)
- Add mouse interaction (click to add particles)
- Create preset configurations (orbits, collisions)
- Add particle-particle collisions (not just wall bouncing)

### 📖 External Learning Resources

#### **JavaScript:**
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) - Comprehensive tutorial
- [JavaScript.info](https://javascript.info/) - Modern JavaScript from basics to advanced
- [freeCodeCamp](https://www.freecodecamp.org/) - Interactive coding challenges

#### **Canvas API:**
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) - Official canvas guide
- [HTML5 Canvas Deep Dive](http://joshondesign.com/p/books/canvasdeepdive/toc.html) - Free ebook

#### **Physics:**
- [Khan Academy Physics](https://www.khanacademy.org/science/physics) - Free video courses
- [The Physics Classroom](https://www.physicsclassroom.com/) - Clear physics explanations
- [HyperPhysics](http://hyperphysics.phy-astr.gsu.edu/) - Physics concepts reference

#### **Web Development:**
- [MDN Learn Web Development](https://developer.mozilla.org/en-US/docs/Learn) - Complete web dev path
- [CSS-Tricks](https://css-tricks.com/) - Modern CSS tutorials and tips
- [Web.dev](https://web.dev/learn) - Google's web development course

### ❓ Troubleshooting

#### **Simulation is slow/choppy:**
- Reduce particle count (use slider)
- Close other browser tabs
- Try a different browser
- Check FPS display - aim for 55-60 FPS

#### **Particles escape the canvas:**
- This shouldn't happen! If it does, it's a bug in boundary handling
- Check `physics.js` boundary collision code
- Ensure canvas width/height are set correctly

#### **Nothing displays on screen:**
- Open browser console (F12) to check for errors
- Verify all JavaScript files loaded (check Network tab)
- Ensure files are in same directory
- Try a different browser

#### **Controls don't work:**
- Check browser console for errors
- Verify JavaScript files loaded in correct order
- Make sure IDs in HTML match those in JavaScript

### 🤝 Contributing

Want to improve the code or comments?
- Fix typos or unclear explanations
- Add more beginner-friendly examples
- Suggest better analogies or diagrams
- Report bugs or confusing sections

All feedback helps make this a better learning resource!

### 📝 License

This project is open source and available for learning purposes. Feel free to modify, share, and build upon it!