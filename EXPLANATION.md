# Quantum Particle Simulation - Comprehensive Guide for Beginners

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Key Concepts](#key-concepts)
4. [Code Flow](#code-flow)
5. [Physics Explained](#physics-explained)
6. [Common Beginner Questions](#common-beginner-questions)
7. [Glossary](#glossary)

---

## Overview

### What This Application Does

The Quantum Particle Simulation is an interactive web application that visualizes how electrically charged particles interact with each other. Think of it like a miniature universe where particles attract or repel each other based on their electrical charges, just like magnets with north and south poles.

**Key Features:**
- **Real-time Physics**: Particles move according to the laws of physics (Coulomb's Law and Newton's Laws)
- **Visual Feedback**: You can see forces as colored lines and particle motion as arrows
- **Interactive Controls**: Adjust particle count, force strength, pause/resume, and more
- **Educational**: Shows physics formulas and live statistics

**What Makes It "Quantum"?**
While this simulation uses classical physics (not true quantum mechanics), it demonstrates fundamental electromagnetic interactions that are essential to understanding how matter works at all scales - from atoms to galaxies.

### Who Is This For?

This project is designed for:
- **Beginners learning JavaScript**: Extensive comments explain every line of code
- **Students learning physics**: Visual demonstration of Coulomb's Law and energy conservation
- **Web developers**: Example of HTML5 Canvas, animations, and modern UI design
- **Anyone curious about programming**: Step-by-step explanations of how it all works

---

## Project Structure

### File Organization

```
quantum_simulation/
├── index.html          # Page structure and layout
├── styles.css          # Visual styling (colors, layout, glassmorphism)
├── particle.js         # Particle class (individual particle behavior)
├── physics.js          # PhysicsEngine class (force calculations)
├── simulation.js       # Simulation class (animation loop, rendering)
├── main.js            # App class (UI controls, entry point)
├── README.md          # Project overview and usage
└── EXPLANATION.md     # This file - comprehensive guide
```

### What Each File Does

#### **index.html** - The Foundation
- **Purpose**: Defines the structure of the webpage
- **Contains**: Canvas element, buttons, sliders, statistics display, formulas
- **Think of it as**: The skeleton or blueprint of a house

**Key Sections:**
- `<header>`: Title and description
- `<canvas>`: Where particles are drawn (the animation surface)
- Control panel: Buttons, sliders, and information displays

#### **styles.css** - The Aesthetics
- **Purpose**: Makes everything look beautiful and modern
- **Contains**: Colors, spacing, layout rules, glassmorphism effects
- **Think of it as**: The paint, decorations, and furniture

**Key Techniques:**
- **Flexbox**: Layout system for arranging elements
- **Glassmorphism**: Modern "frosted glass" design style
- **Responsive design**: Works on different screen sizes
- **Custom controls**: Styled sliders and buttons

#### **particle.js** - The Actor
- **Purpose**: Defines what a particle is and how it behaves
- **Contains**: Particle class with properties and methods
- **Think of it as**: A blueprint for creating individual particles

**Particle Properties:**
- Position (x, y)
- Velocity (vx, vy) - speed and direction
- Acceleration (ax, ay) - how velocity changes
- Charge (+1, -1, or 0)
- Mass and radius

**Particle Methods:**
- `update()`: Move the particle based on physics
- `applyForce()`: Apply a force to change acceleration
- `draw()`: Render the particle on canvas
- `drawVelocity()`: Show velocity as an arrow
- `getKineticEnergy()`: Calculate motion energy

#### **physics.js** - The Rules
- **Purpose**: Implements the laws of physics that govern particle interactions
- **Contains**: PhysicsEngine class with force calculations
- **Think of it as**: The rulebook for how particles interact

**Physics Engine Responsibilities:**
- **Coulomb's Law**: Calculate electromagnetic forces between particles
- **Boundary handling**: Make particles bounce off walls
- **Energy calculations**: Track kinetic and potential energy
- **Force limiting**: Prevent unrealistic super-fast motion

#### **simulation.js** - The Director
- **Purpose**: Manages the entire simulation and animation
- **Contains**: Simulation class that orchestrates everything
- **Think of it as**: The director of a movie, coordinating all actors

**Simulation Responsibilities:**
- Manage the canvas and drawing context
- Run the animation loop (the heartbeat of the app)
- Update physics and render graphics
- Track FPS (frames per second)
- Calculate and display field lines

#### **main.js** - The Controller
- **Purpose**: Connects user interface to the simulation
- **Contains**: App class that handles user interactions
- **Think of it as**: The remote control for the simulation

**App Responsibilities:**
- Create and initialize the simulation
- Connect buttons and sliders to functions
- Update statistics display
- Respond to user actions (clicks, slides)

---

## Key Concepts

### 1. Object-Oriented Programming (OOP)

**What is OOP?**
Object-Oriented Programming is a way of organizing code using "objects" - bundles of data and functions that work together.

**Key OOP Concepts:**

#### **Classes**
A class is like a blueprint or template. Think of it like a cookie cutter:
- The cookie cutter (class) defines the shape
- Each cookie made with it (object/instance) has that shape but is its own separate cookie

```javascript
// Define a class (the blueprint)
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Create instances (actual particles)
const particle1 = new Particle(100, 200);
const particle2 = new Particle(300, 400);
```

#### **Objects/Instances**
An object is a specific instance created from a class:
- `particle1` and `particle2` are both Particle objects
- Each has its own `x` and `y` values
- They're independent - changing one doesn't affect the other

#### **Properties**
Properties are variables that belong to an object:
```javascript
this.x = 100;        // Position property
this.charge = -1;    // Charge property
```

#### **Methods**
Methods are functions that belong to an object:
```javascript
update(dt) {         // Method to update position
    this.x += this.vx * dt;
}
```

#### **The "this" Keyword**
`this` refers to the current object:
```javascript
this.x = 100;  // Set MY x value
this.y = 200;  // Set MY y value
```

Think of it like: "this particle's x position" vs "that particle's x position"

### 2. The Animation Loop

**What is an Animation Loop?**
An animation is like a flipbook - many slightly different pictures shown quickly creates the illusion of motion. Our animation loop is the process of drawing these pictures.

**The Loop Process:**
```
1. Calculate new positions (physics)
   ↓
2. Clear the old frame (erase canvas)
   ↓
3. Draw the new frame (render particles)
   ↓
4. Wait for next screen refresh
   ↓
5. Repeat (go back to step 1)
```

**How Fast Does It Run?**
- **Target**: 60 FPS (frames per second)
- **What this means**: The loop runs 60 times every second
- **Time per frame**: 1/60 ≈ 0.0167 seconds (16.7 milliseconds)

**requestAnimationFrame**
This is a special browser function optimized for animations:
```javascript
requestAnimationFrame((time) => this.animate(time));
```

**Benefits over setInterval:**
- Syncs with screen refresh (no tearing/stuttering)
- Pauses when tab is hidden (saves battery)
- Better performance (browser optimizes it)

**Delta Time (dt)**
Delta time is the time elapsed since the last frame:
- Fast computer: dt ≈ 0.0167 (60 FPS)
- Slow computer: dt ≈ 0.0333 (30 FPS)

Using dt makes physics frame-rate independent:
```javascript
// Without dt: moves 1 pixel per frame
// Fast computer: 60 pixels/second
// Slow computer: 30 pixels/second (INCONSISTENT!)
this.x += this.vx;

// With dt: moves based on time
// Fast computer: 60 FPS × small dt = 60 pixels/second
// Slow computer: 30 FPS × large dt = 60 pixels/second (CONSISTENT!)
this.x += this.vx * dt;
```

### 3. Canvas API Basics

**What is Canvas?**
The HTML5 Canvas is a blank surface you can draw on using JavaScript. Think of it like:
- A digital whiteboard
- A painter's canvas
- A pixel grid you control with code

**Key Canvas Concepts:**

#### **The Canvas Element**
```html
<canvas id="myCanvas" width="800" height="600"></canvas>
```

#### **The Drawing Context**
The context is your "paintbrush" - it has methods for drawing:
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');  // Get 2D drawing context
```

#### **Drawing Shapes**
```javascript
// Draw a circle
ctx.beginPath();                     // Start a new path
ctx.arc(x, y, radius, 0, Math.PI*2); // Define circle
ctx.fill();                          // Fill with color

// Draw a line
ctx.beginPath();         // Start new path
ctx.moveTo(x1, y1);      // Move to start point
ctx.lineTo(x2, y2);      // Draw line to end point
ctx.stroke();            // Render the line
```

#### **Colors and Styles**
```javascript
ctx.fillStyle = 'red';                    // Solid color
ctx.fillStyle = 'rgb(255, 0, 0)';         // RGB color
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';   // RGB with transparency
ctx.strokeStyle = 'white';                // Line color
ctx.lineWidth = 2;                        // Line thickness
```

#### **Clearing the Canvas**
```javascript
// Clear entire canvas (erase everything)
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Or fill with a color (like our black background)
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

### 4. Event Handling

**What are Events?**
Events are things that happen in the browser:
- User clicks a button → `click` event
- User moves a slider → `input` event
- User presses a key → `keydown` event
- Page finishes loading → `DOMContentLoaded` event

**Event Listeners**
An event listener is code that "listens" for an event and responds:
```javascript
// Listen for button clicks
button.addEventListener('click', () => {
    console.log('Button was clicked!');
});
```

**How Event Listeners Work:**
1. Find the element: `document.getElementById('myButton')`
2. Attach a listener: `element.addEventListener(eventType, function)`
3. Wait for event to happen
4. Run the function when event occurs

**Example from Our App:**
```javascript
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
    if (simulation.isRunning) {
        simulation.stop();      // Pause simulation
        pauseBtn.textContent = 'Resume';
    } else {
        simulation.start();     // Resume simulation
        pauseBtn.textContent = 'Pause';
    }
});
```

**Callback Functions**
The function passed to `addEventListener` is called a "callback":
- It's not called immediately
- It's "called back" later when the event happens
- Think of it like leaving a message: "When X happens, call me back with this function"

### 5. Physics Simulation Concepts

**What is a Physics Simulation?**
A physics simulation uses mathematics to model how objects move and interact in the real world. Our simulation implements:

#### **Coulomb's Law (Electromagnetic Force)**
Formula: `F = k × (q₁ × q₂) / r²`

**What each part means:**
- `F`: Force (how strong is the push/pull?)
- `k`: Coulomb's constant (strength of electromagnetic force)
- `q₁, q₂`: Charges of the two particles
- `r²`: Distance squared

**Key Insights:**
- **Same charges repel**: (+,+) or (-,-) → positive force → push apart
- **Opposite charges attract**: (+,-) or (-,+) → negative force → pull together
- **Distance matters**: Double the distance → force becomes 1/4 as strong
- **Just like gravity**: But can attract OR repel (gravity only attracts)

#### **Newton's Second Law (Force and Acceleration)**
Formula: `F = ma` or rearranged: `a = F/m`

**What it means:**
- Force causes acceleration (change in velocity)
- More force → more acceleration
- More mass → less acceleration (heavier objects are harder to push)

**In our simulation:**
```javascript
// Apply force to particle
particle.ax += fx / particle.mass;
particle.ay += fy / particle.mass;
```

#### **Kinematic Equations (Motion)**
These describe how position and velocity change:

**Velocity update:** `v = v₀ + a×t`
- New velocity = old velocity + (acceleration × time)
- Example: If you're going 10 m/s and accelerate at 2 m/s² for 3 seconds:
  - New velocity = 10 + (2 × 3) = 16 m/s

**Position update:** `x = x₀ + v×t`
- New position = old position + (velocity × time)
- Example: If you're at position 100 and moving 5 m/s for 2 seconds:
  - New position = 100 + (5 × 2) = 110

#### **Energy Conservation**
Energy cannot be created or destroyed, only transformed:

**Kinetic Energy (KE)**: Energy of motion
- Formula: `KE = ½mv²`
- Faster particles have more KE

**Potential Energy (PE)**: Stored energy
- Formula: `PE = k(q₁q₂)/r`
- Based on particle positions/configuration

**Total Energy**: `E = KE + PE`
- Should stay roughly constant (minor changes due to damping)
- When particles speed up (KE increases), they get closer (PE changes)

---

## Code Flow

### Step-by-Step: What Happens When You Open the App

#### **1. Page Load (index.html)**
```
Browser loads index.html
  ↓
Parses HTML structure (creates DOM)
  ↓
Loads and applies styles.css
  ↓
Begins loading JavaScript files in order:
  - particle.js
  - physics.js
  - simulation.js
  - main.js
```

#### **2. JavaScript Initialization (main.js)**
```
main.js loads completely
  ↓
Waits for DOMContentLoaded event
  ↓
Event fires: DOM is ready
  ↓
Creates new App()
  ↓
App constructor runs:
  - Creates Simulation
  - Initializes 30 particles
  - Starts animation loop
  - Sets up UI controls
  - Starts stats update loop
```

#### **3. The Animation Loop (Every Frame)**
```
requestAnimationFrame calls animate()
  ↓
Calculate delta time (time since last frame)
  ↓
PHYSICS UPDATE:
  ├─ Calculate forces between all particle pairs (Coulomb's Law)
  ├─ Apply forces to particles (update acceleration)
  ├─ Update velocities (v = v + a×dt)
  ├─ Update positions (x = x + v×dt)
  └─ Handle boundary collisions (bounce off walls)
  ↓
RENDERING:
  ├─ Clear canvas (erase old frame)
  ├─ Draw field lines (force visualizations)
  ├─ Draw velocity vectors (arrows on particles)
  └─ Draw particles (colored circles)
  ↓
Calculate FPS
  ↓
Schedule next frame (requestAnimationFrame)
  ↓
Repeat forever (60 times per second)
```

#### **4. Statistics Update Loop (Every 100ms)**
```
setInterval triggers every 100ms
  ↓
Get stats from simulation:
  - Particle count
  - Total energy
  - Average velocity
  - FPS
  ↓
Update HTML text content with new values
  ↓
Wait 100ms
  ↓
Repeat
```

#### **5. User Interactions (When User Does Something)**

**Example: User clicks Pause button**
```
User clicks button
  ↓
Browser fires 'click' event
  ↓
Event listener callback runs
  ↓
Check if simulation is running
  ↓
If running:
  - Call simulation.stop()
  - Change button text to "Resume"
If paused:
  - Call simulation.start()
  - Change button text to "Pause"
```

**Example: User moves slider**
```
User drags slider
  ↓
Browser fires 'input' event continuously
  ↓
Event listener callback runs
  ↓
Read slider value
  ↓
Update display text
  ↓
Reinitialize particles with new count
  (or update force constant, depending on slider)
```

### Detailed Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION STARTUP                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
           ┌─────────────────┐
           │   Load HTML     │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │   Load CSS      │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  Load JS Files  │
           │  (in order)     │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  DOMContent     │
           │  Loaded Event   │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  Create App()   │
           └────────┬────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Create   │ │  Setup   │ │  Start   │
│Simulation│ │ Controls │ │  Stats   │
│          │ │          │ │  Loop    │
└─────┬────┘ └────┬─────┘ └────┬─────┘
      │           │            │
      │           │            └──► Updates every 100ms
      │           │
      │           └──► Waits for user interactions
      │
      ▼
┌─────────────────┐
│ Animation Loop  │◄──────┐
│ (60 FPS)        │       │
└────────┬────────┘       │
         │                │
    ┌────┼─────┬──────────┼─────┐
    │    │     │          │     │
    ▼    ▼     ▼          ▼     │
 ┌────┐┌────┐┌────┐   ┌────┐   │
 │Phys││Upd-││Rend│   │Calc│   │
 │ics││ate ││ er │   │FPS │   │
 └────┘└────┘└────┘   └──┬─┘   │
                         │     │
                         ▼     │
                  ┌──────────────┐
                  │requestAnima- │
                  │tion Frame    │
                  └──────┬───────┘
                         │
                         └───────┘
```

---

## Physics Explained

### Coulomb's Law in Simple Terms

**The Basic Idea:**
Charged particles (particles with electrical charge) exert forces on each other:
- **Like charges** (both positive or both negative) **repel** (push away)
- **Opposite charges** (one positive, one negative) **attract** (pull together)
- **Neutral particles** (zero charge) don't interact electromagnetically

**The Formula:**
```
F = k × (q₁ × q₂) / r²
```

**Breaking It Down:**

1. **k (Coulomb's constant)**
   - Think of it as the "strength setting" for electromagnetic forces
   - In real physics: k ≈ 8.99 × 10⁹ N⋅m²/C²
   - In our simulation: k = 5000 (scaled for visual effect)

2. **q₁ and q₂ (charges)**
   - Charge of particle 1 and particle 2
   - In our simulation: -1, 0, or +1
   - The product (q₁ × q₂) determines attract vs repel:
     - (+1) × (+1) = +1 (positive → repel)
     - (-1) × (-1) = +1 (positive → repel)
     - (+1) × (-1) = -1 (negative → attract)
     - (-1) × (+1) = -1 (negative → attract)
     - 0 × anything = 0 (no force)

3. **r² (distance squared)**
   - Distance between particles, squared
   - The "squared" is CRUCIAL - it makes force drop off rapidly
   - Examples:
     - Distance = 2 → r² = 4
     - Distance = 4 → r² = 16 (force is 1/16 of what it was at r=2!)
     - Distance = 10 → r² = 100

**Why Distance Squared Matters:**
```
At distance 10:  F = k×q₁×q₂ / 100  = 0.01 × k×q₁×q₂
At distance 20:  F = k×q₁×q₂ / 400  = 0.0025 × k×q₁×q₂  (1/4 as strong!)
At distance 40:  F = k×q₁×q₂ / 1600 = 0.000625 × k×q₁×q₂ (1/16 as strong!)
```

This is called an "inverse square law" - doubling distance makes force 1/4 as strong.

**Real-World Analogy:**
Imagine two magnets:
- Close together: Strong pull/push
- Farther apart: Weaker pull/push
- Very far apart: Barely any force at all

Same concept, but with electrical charge instead of magnetic poles!

### What Charges Do

**Positive Charge (+1)** - Red Particles
- Represents protons in atoms
- Attracts negative charges
- Repels other positive charges
- Example in nature: Protons in atomic nuclei

**Negative Charge (-1)** - Blue Particles
- Represents electrons
- Attracts positive charges
- Repels other negative charges
- Example in nature: Electrons orbiting atoms

**Neutral (0)** - Green Particles
- No electrical charge
- Doesn't attract or repel anything
- Doesn't participate in electromagnetic interactions
- Example in nature: Neutrons in atomic nuclei

### Why Particles Attract/Repel

**The Physical Reason:**
Charges create "electric fields" - invisible regions of influence around them. Other charges feel these fields as forces.

**Attraction (Opposite Charges):**
- (+) creates field pointing outward
- (-) creates field pointing inward
- When they meet, fields align
- Result: Particles pulled together

**Repulsion (Same Charges):**
- Both create fields pointing same direction
- Fields push against each other
- Result: Particles pushed apart

**Energy Perspective:**
Nature likes to minimize energy:
- Opposite charges together = LOW energy (stable, like a ball in a valley)
- Same charges together = HIGH energy (unstable, like a ball on a hill)
- Particles naturally move toward lower energy states

### Energy Conservation

**The Fundamental Principle:**
"Energy cannot be created or destroyed, only transformed from one form to another."

**In Our Simulation:**

**Kinetic Energy (KE)** - Energy of Motion
```
KE = ½ × mass × velocity²
```
- Moving particles have KE
- Faster = more KE
- Heavier = more KE
- Think of it like: momentum, motion energy

**Potential Energy (PE)** - Stored Energy
```
PE = k × (q₁ × q₂) / r
```
- Based on particle positions
- Closer particles = different PE (depends on charges)
- Think of it like: energy stored in the configuration

**Energy Transformation Examples:**

**Opposite Charges Approaching:**
```
Start: Far apart
  → High PE (particles want to get closer, energy "stored" in separation)
  → Low KE (not moving much yet)

Middle: Accelerating toward each other
  → PE decreasing (getting closer releases energy)
  → KE increasing (speeding up)

Close: Near each other
  → Low PE (energy was released)
  → High KE (moving fast)
  → They zoom past each other!

Result: PE converted to KE
```

**Same Charges Repelling:**
```
Start: Pushed close together
  → High PE (particles want to separate, energy "stored" like compressed spring)
  → Low KE (not moving much)

Middle: Accelerating apart
  → PE decreasing (separating releases energy)
  → KE increasing (speeding up)

Far: Separated
  → Low PE (energy was released)
  → High KE (moving fast)

Result: PE converted to KE
```

**Total Energy:**
```
E_total = KE + PE ≈ constant
```
- In a perfect simulation, total energy never changes
- In our simulation, slight decreases due to:
  - Damping (simulated friction/air resistance)
  - Boundary collisions (energy loss when bouncing)
  - Numerical errors (small inaccuracies in calculations)

---

## Common Beginner Questions

### General Questions

**Q: Why is it called "Quantum" if it uses classical physics?**
A: You're absolutely right to notice this! The simulation uses classical electromagnetism (Coulomb's Law), not true quantum mechanics. The name "Quantum Particle Simulation" refers to the fact that we're simulating particle-level interactions that, in nature, would involve quantum effects. Think of it as a simplified classical model of quantum particle behavior - a stepping stone toward understanding real quantum physics.

**Q: Do I need to know physics to understand the code?**
A: No! While physics knowledge helps, the code comments explain all physics concepts from scratch. You can learn the physics as you read the code. The comments assume no prior knowledge beyond basic math (addition, multiplication, square roots).

**Q: What programming concepts should I learn first?**
A: To fully understand this code, it helps to know:
1. **Basic JavaScript**: Variables, functions, loops, arrays
2. **Object-Oriented Programming**: Classes, objects, methods, properties
3. **HTML & CSS basics**: Elements, styling, selectors
4. **Event handling**: How user interactions work

Don't worry if you don't know all of these - the comments explain as they go!

**Q: Can I modify the code to experiment?**
A: Absolutely! Experimentation is the best way to learn. Try:
- Changing particle colors
- Modifying force strengths
- Adding new particle types
- Changing physics constants
- Adding new visual effects

### JavaScript Questions

**Q: What does `this` mean in JavaScript?**
A: `this` refers to the current object. Inside a method, `this` means "this instance of the class." Example:
```javascript
class Particle {
    constructor(x, y) {
        this.x = x;  // THIS particle's x position
    }
}
```

**Q: What's the difference between `const`, `let`, and `var`?**
A:
- **`const`**: Value cannot be reassigned (constant)
  ```javascript
  const pi = 3.14159;
  pi = 3.14;  // ERROR! Can't reassign
  ```
- **`let`**: Value can be reassigned, block-scoped
  ```javascript
  let count = 0;
  count = 1;  // OK!
  ```
- **`var`**: Old way, function-scoped (use `let` instead in modern code)

**Q: What's an arrow function?**
A: A shorter syntax for writing functions:
```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With event listener
button.addEventListener('click', () => {
    console.log('Clicked!');
});
```

**Q: Why do we use `requestAnimationFrame` instead of `setInterval`?**
A: `requestAnimationFrame` is better for animations because:
- Syncs with screen refresh rate (60 Hz)
- Pauses when tab is hidden (saves CPU)
- Better performance (browser optimizes it)
- Prevents screen tearing

`setInterval` runs at a fixed rate regardless of screen refresh, which can cause visual artifacts.

### Physics Questions

**Q: What's the difference between velocity and acceleration?**
A:
- **Velocity**: How fast and in what direction something is moving (speed with direction)
- **Acceleration**: How fast the velocity is changing

Analogy:
- Velocity = speedometer reading in your car
- Acceleration = how fast the speedometer is changing (how hard you're pressing gas/brake)

**Q: Why do particles bounce off walls?**
A: When a particle hits a wall, we reverse its velocity component perpendicular to the wall:
```javascript
if (particle.x < 0) {
    particle.vx *= -1;  // Reverse X velocity (bounce off left wall)
}
```
This simulates an elastic collision with the boundary.

**Q: What's damping and why do we need it?**
A: Damping simulates energy loss (friction, air resistance). Without it:
- Particles would bounce forever at the same speed
- Total energy would never decrease
- Simulation might become chaotic and hard to observe

Damping gradually slows particles down, leading to more stable behavior:
```javascript
velocity *= 0.995;  // Lose 0.5% of velocity each frame
```

**Q: Why is there a minimum distance between particles?**
A: In the formula `F = k/(r²)`, as `r` approaches zero, force approaches infinity. This causes:
- Particles shooting off at impossible speeds
- Numerical instability (NaN values)
- Simulation breaking

We set a minimum distance (20 pixels) to prevent this "singularity" issue.

### Canvas Questions

**Q: What's the difference between `fillRect` and `clearRect`?**
A:
- **`fillRect`**: Draws a filled rectangle with the current `fillStyle` color
  ```javascript
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 800, 600);  // Fill with black
  ```
- **`clearRect`**: Erases a rectangle (makes it transparent)
  ```javascript
  ctx.clearRect(0, 0, 800, 600);  // Erase everything
  ```

**Q: Why do we call `beginPath()` before drawing?**
A: `beginPath()` starts a new drawing path. Without it, each new shape adds to the previous path, creating unintended connections:
```javascript
// Wrong - shapes connected!
ctx.arc(100, 100, 10, 0, Math.PI*2);
ctx.fill();
ctx.arc(200, 200, 10, 0, Math.PI*2);
ctx.fill();  // Also re-fills first circle!

// Correct - separate shapes
ctx.beginPath();
ctx.arc(100, 100, 10, 0, Math.PI*2);
ctx.fill();
ctx.beginPath();  // Start fresh!
ctx.arc(200, 200, 10, 0, Math.PI*2);
ctx.fill();
```

**Q: What are radians and why do we use them?**
A: Radians are a unit for measuring angles:
- 0 radians = 0°
- π/2 radians = 90°
- π radians = 180°
- 2π radians = 360° (full circle)

Canvas uses radians (not degrees) for angle measurements. `Math.PI * 2` is a full circle.

### UI Questions

**Q: What's an event listener?**
A: An event listener is code that "listens" for events (clicks, key presses, etc.) and runs a function when the event happens:
```javascript
button.addEventListener('click', () => {
    console.log('Button clicked!');
});
```

**Q: What's the DOM?**
A: DOM (Document Object Model) is the browser's representation of the HTML page as a tree of objects. JavaScript uses the DOM to read and modify the webpage:
```javascript
// Find element
const button = document.getElementById('myButton');

// Modify it
button.textContent = 'Click Me!';
button.style.color = 'red';
```

**Q: Why do we wait for `DOMContentLoaded` before starting?**
A: JavaScript might execute before HTML elements exist. `DOMContentLoaded` ensures the DOM is ready:
```javascript
// Without DOMContentLoaded - might fail!
const canvas = document.getElementById('canvas');  // Might be null!

// With DOMContentLoaded - safe!
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');  // Definitely exists
});
```

---

## Glossary

### Programming Terms

**API (Application Programming Interface)**
A set of functions/methods provided by a library or system. Example: Canvas API provides drawing functions.

**Argument**
A value passed to a function. In `add(5, 3)`, 5 and 3 are arguments.

**Array**
A list of values: `[1, 2, 3, 4]` or `['red', 'blue', 'green']`

**Callback**
A function passed as an argument to another function, to be called later.

**Class**
A blueprint for creating objects. Defines properties and methods.

**Constructor**
A special method that runs when creating a new object: `new Particle(100, 200)`

**Context**
For canvas, the drawing interface: `canvas.getContext('2d')`

**DOM (Document Object Model)**
The browser's representation of HTML as a tree of JavaScript objects.

**Event**
Something that happens (click, keypress, page load, etc.)

**Function**
A reusable block of code: `function add(a, b) { return a + b; }`

**Instance**
A specific object created from a class: `const p = new Particle()`

**Method**
A function that belongs to an object: `particle.update()`

**Object**
A collection of related data and functions: `{ x: 100, y: 200, draw: function() {...} }`

**Parameter**
A variable in a function definition: `function add(a, b)` - a and b are parameters

**Property**
A variable that belongs to an object: `particle.x`, `particle.velocity`

**Scope**
Where a variable is accessible. Block scope (let/const) vs function scope (var)

### Physics Terms

**Acceleration**
Rate of change of velocity. Measured in pixels/frame/frame or m/s².

**Charge**
Electrical property of particles. Can be positive, negative, or neutral.

**Coulomb's Law**
Formula for electromagnetic force: F = k(q₁q₂)/r²

**Delta Time (dt)**
Time elapsed since last frame. Used for frame-rate independent physics.

**Energy**
Capacity to do work. Comes in kinetic (motion) and potential (stored) forms.

**Force**
A push or pull. Measured in Newtons (N) in real physics.

**Frame**
A single image in an animation. 60 FPS = 60 frames per second.

**FPS (Frames Per Second)**
How many frames are rendered each second. 60 FPS = smooth.

**Kinetic Energy**
Energy of motion: KE = ½mv²

**Mass**
Amount of matter in an object. More mass = more resistance to acceleration.

**Newton's Second Law**
F = ma (force equals mass times acceleration)

**Potential Energy**
Stored energy based on position: PE = k(q₁q₂)/r

**Velocity**
Speed with direction. Measured in pixels/frame or m/s.

**Vector**
A quantity with both magnitude and direction. Example: velocity = (vx, vy)

### CSS Terms

**Backdrop-filter**
Applies visual effects (like blur) to what's behind an element.

**Box Model**
How elements are sized: content + padding + border + margin

**Flexbox**
A layout system for arranging elements: `display: flex`

**Glassmorphism**
Design style with transparent, blurred backgrounds (frosted glass effect)

**Media Query**
CSS rules that apply only at certain screen sizes: `@media (max-width: 768px)`

**Pseudo-class**
Special state of an element: `:hover`, `:focus`, `:first-child`

**rem**
CSS unit relative to root font size: 1rem ≈ 16px

**Selector**
Targets elements to style: `.class`, `#id`, `element`

**vh/vw**
Viewport units: 1vh = 1% of viewport height, 1vw = 1% of viewport width

### Math Terms

**Inverse Square Law**
Relationship where doubling distance makes force 1/4 as strong: F ∝ 1/r²

**Magnitude**
The size/length of a vector, ignoring direction: `magnitude = √(x² + y²)`

**Pythagorean Theorem**
For right triangles: c² = a² + b². Used to calculate distance.

**Radian**
Unit for measuring angles: 2π radians = 360 degrees

**Unit Vector**
A vector with length 1, used to indicate direction only.

### Canvas Terms

**arc()**
Canvas method to draw circles: `ctx.arc(x, y, radius, startAngle, endAngle)`

**beginPath()**
Starts a new drawing path (separates shapes)

**Canvas**
HTML element for programmatic drawing

**Context**
Drawing interface for canvas: `canvas.getContext('2d')`

**fillStyle**
Color for filling shapes: `ctx.fillStyle = 'red'`

**strokeStyle**
Color for drawing lines: `ctx.strokeStyle = 'blue'`

**lineTo()**
Draws a line from current position to specified point

**moveTo()**
Moves drawing position without drawing

---

## Where to Learn More

### JavaScript
- **MDN Web Docs**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **JavaScript.info**: Modern JavaScript tutorial
- **freeCodeCamp**: Interactive JavaScript course

### Canvas API
- **MDN Canvas Tutorial**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- **Canvas Deep Dive** by Josh On Design

### Physics
- **Khan Academy Physics**: Free video courses on mechanics and electromagnetism
- **The Feynman Lectures**: Classic physics textbook (available free online)

### Web Development
- **MDN Learn Web Development**: https://developer.mozilla.org/en-US/docs/Learn
- **CSS-Tricks**: Articles and tutorials on modern CSS

---

## Final Thoughts

This simulation is a complete, working example of:
- Object-oriented programming
- Real-time animation
- Canvas graphics
- Physics simulation
- Modern UI design
- Event-driven programming

It's designed to be understood line-by-line by beginners. Don't worry if you don't understand everything at first - programming is learned by doing!

**Suggested Learning Path:**
1. Read the code comments in each file
2. Experiment by changing values
3. Break something and fix it (best way to learn!)
4. Add new features
5. Read this guide when you need deeper explanations

Happy coding! 🚀
