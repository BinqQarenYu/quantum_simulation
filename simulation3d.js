class Simulation3D {
    constructor(container) {
        this.container = container;
        this.isRunning = false;
        this.timeScale = 1.0;
        this.zoomLevel = 1.0;
        this.atomicNumber = 6; // Default Carbon
        
        // Three.js setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 50, 200);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        
        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 500;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0xffffff, 1, 500);
        pointLight1.position.set(100, 100, 100);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 500);
        pointLight2.position.set(-100, -100, -100);
        this.scene.add(pointLight2);
        
        // Particles and orbitals
        this.nucleus = null;
        this.nucleons = [];
        this.quarks = [];
        this.gluons = [];
        this.electrons = [];
        this.orbitals = [];
        this.orbitalMeshes = [];
        
        // Animation
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.fpsUpdateTime = 0;
        
        this.setupNucleus();
        this.setupElectronOrbitals();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    setupNucleus() {
        // Clear existing nucleus
        if (this.nucleus) {
            this.scene.remove(this.nucleus);
        }
        
        // Create nucleus group
        this.nucleus = new THREE.Group();
        this.scene.add(this.nucleus);
        
        // Use atomic number to determine protons/neutrons
        const protonCount = this.atomicNumber;
        const neutronCount = Math.round(this.atomicNumber * 1.2); // Approximate neutron count
        
        // Create protons (red spheres)
        const protonGeometry = new THREE.SphereGeometry(4, 32, 32);
        const protonMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff4444,
            emissive: 0xff0000,
            emissiveIntensity: 0.3,
            shininess: 100,
            transparent: true,
            opacity: 0.3
        });
        
        const positions = this.generateNucleusPositions(protonCount);
        
        for (let i = 0; i < protonCount; i++) {
            const proton = new THREE.Mesh(protonGeometry, protonMaterial);
            proton.position.copy(positions[i]);
            
            // Add p+ label
            this.addParticleLabel(proton, 'p⁺', 0xff4444);
            
            this.nucleus.add(proton);
            this.nucleons.push(proton);
            
            // Add quarks to proton
            this.addQuarksToNucleon(proton, 'proton');
        }
        
        // Create neutrons (gray spheres)
        const neutronGeometry = new THREE.SphereGeometry(4, 32, 32);
        const neutronMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xcccccc,
            emissive: 0x666666,
            emissiveIntensity: 0.2,
            shininess: 100,
            transparent: true,
            opacity: 0.3
        });
        
        const neutronPositions = this.generateNucleusPositions(neutronCount, Math.PI / 6);
        
        for (let i = 0; i < neutronCount; i++) {
            const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
            neutron.position.copy(neutronPositions[i]);
            
            // Add n label
            this.addParticleLabel(neutron, 'n', 0xcccccc);
            
            this.nucleus.add(neutron);
            this.nucleons.push(neutron);
            
            // Add quarks to neutron
            this.addQuarksToNucleon(neutron, 'neutron');
        }
        
        // Add nucleus label
        const nucleusRadius = 25;
        const nucleusWireframe = new THREE.Mesh(
            new THREE.SphereGeometry(nucleusRadius, 32, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            })
        );
        this.nucleus.add(nucleusWireframe);
    }
    
    generateNucleusPositions(count, offset = 0) {
        const positions = [];
        const radius = 10;
        
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi + offset;
            
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            
            positions.push(new THREE.Vector3(x, y, z));
        }
        
        return positions;
    }
    
    addQuarksToNucleon(nucleon, type) {
        const quarkGeometry = new THREE.SphereGeometry(1, 16, 16);
        const quarksInNucleon = [];
        
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 3;
            
            // Color based on quark type
            let color, quarkType, quarkLabel;
            if (type === 'proton') {
                if (i < 2) {
                    color = 0xff00ff; // up quark (magenta)
                    quarkType = 'up';
                    quarkLabel = 'u';
                } else {
                    color = 0x00ff00; // down quark (green)
                    quarkType = 'down';
                    quarkLabel = 'd';
                }
            } else {
                if (i < 1) {
                    color = 0xff00ff; // up quark (magenta)
                    quarkType = 'up';
                    quarkLabel = 'u';
                } else {
                    color = 0x00ff00; // down quark (green)
                    quarkType = 'down';
                    quarkLabel = 'd';
                }
            }
            
            const quarkMaterial = new THREE.MeshPhongMaterial({ 
                color: color,
                emissive: color,
                emissiveIntensity: 0.5
            });
            
            const quark = new THREE.Mesh(quarkGeometry, quarkMaterial);
            quark.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            
            // Add quark label
            this.addParticleLabel(quark, quarkLabel, color, 0.5);
            
            nucleon.add(quark);
            quarksInNucleon.push(quark);
            this.quarks.push({ mesh: quark, angle: angle, parent: nucleon });
        }
        
        // Create gluon connections between all quark pairs
        this.createGluonConnections(nucleon, quarksInNucleon);
    }
    
    createGluonConnections(nucleon, quarks) {
        // Create lines connecting each pair of quarks (gluons)
        for (let i = 0; i < quarks.length; i++) {
            for (let j = i + 1; j < quarks.length; j++) {
                // Create a line geometry
                const material = new THREE.LineBasicMaterial({
                    color: 0xffff00,
                    transparent: true,
                    opacity: 0.6,
                    linewidth: 2
                });
                
                const points = [];
                points.push(quarks[i].position.clone());
                points.push(quarks[j].position.clone());
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                
                nucleon.add(line);
                
                this.gluons.push({
                    line: line,
                    quark1: quarks[i],
                    quark2: quarks[j],
                    parent: nucleon,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }
    
    addParticleLabel(particle, text, color, scale = 1.0) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.font = 'Bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 64, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(6 * scale, 3 * scale, 1);
        sprite.position.set(0, 6, 0);
        
        particle.add(sprite);
    }
    
    setupElectronOrbitals() {
        const electronCount = this.atomicNumber;
        
        // Electron configuration based on atomic number
        const orbitalConfigs = this.getElectronConfiguration(electronCount);
        
        let electronIndex = 0;
        
        for (const config of orbitalConfigs) {
            // Create orbital shape
            const orbital = this.createOrbital(config);
            this.scene.add(orbital);
            this.orbitalMeshes.push(orbital);
            
            // Add electrons to this orbital
            for (let i = 0; i < config.electrons; i++) {
                const electron = this.createElectron(config, i, electronIndex++);
                this.electrons.push(electron);
            }
        }
    }
    
    getElectronConfiguration(electronCount) {
        const configs = [];
        let remaining = electronCount;
        
        // Filling order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p
        
        // 1s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 1, l: 0, type: 's', electrons: count, radius: 50, color: 0x00ffff, label: '1s' });
            remaining -= count;
        }
        
        // 2s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 2, l: 0, type: 's', electrons: count, radius: 80, color: 0x00ffff, label: '2s' });
            remaining -= count;
        }
        
        // 2p (max 6)
        if (remaining > 0) {
            const px = Math.min(2, remaining);
            configs.push({ n: 2, l: 1, type: 'px', electrons: px, radius: 80, color: 0xff66ff, axis: 'x', label: '2px' });
            remaining -= px;
        }
        if (remaining > 0) {
            const py = Math.min(2, remaining);
            configs.push({ n: 2, l: 1, type: 'py', electrons: py, radius: 80, color: 0xff66ff, axis: 'y', label: '2py' });
            remaining -= py;
        }
        if (remaining > 0) {
            const pz = Math.min(2, remaining);
            configs.push({ n: 2, l: 1, type: 'pz', electrons: pz, radius: 80, color: 0xff66ff, axis: 'z', label: '2pz' });
            remaining -= pz;
        }
        
        // 3s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 3, l: 0, type: 's', electrons: count, radius: 120, color: 0x00ffff, label: '3s' });
            remaining -= count;
        }
        
        // 3p (max 6)
        if (remaining > 0) {
            const px = Math.min(2, remaining);
            configs.push({ n: 3, l: 1, type: 'px', electrons: px, radius: 120, color: 0xff66ff, axis: 'x', label: '3px' });
            remaining -= px;
        }
        if (remaining > 0) {
            const py = Math.min(2, remaining);
            configs.push({ n: 3, l: 1, type: 'py', electrons: py, radius: 120, color: 0xff66ff, axis: 'y', label: '3py' });
            remaining -= py;
        }
        if (remaining > 0) {
            const pz = Math.min(2, remaining);
            configs.push({ n: 3, l: 1, type: 'pz', electrons: pz, radius: 120, color: 0xff66ff, axis: 'z', label: '3pz' });
            remaining -= pz;
        }
        
        // 4s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 4, l: 0, type: 's', electrons: count, radius: 160, color: 0x00ffff, label: '4s' });
            remaining -= count;
        }
        
        // 3d (max 10)
        const dOrbitals = ['dz2', 'dxz', 'dyz', 'dx2-y2', 'dxy'];
        for (let i = 0; i < 5 && remaining > 0; i++) {
            const count = Math.min(2, remaining);
            configs.push({ n: 3, l: 2, type: 'd', subtype: dOrbitals[i], electrons: count, radius: 140, color: 0xffff00, orientation: i, label: `3${dOrbitals[i]}` });
            remaining -= count;
        }
        
        // 4p (max 6)
        if (remaining > 0) {
            const px = Math.min(2, remaining);
            configs.push({ n: 4, l: 1, type: 'px', electrons: px, radius: 160, color: 0xff66ff, axis: 'x', label: '4px' });
            remaining -= px;
        }
        if (remaining > 0) {
            const py = Math.min(2, remaining);
            configs.push({ n: 4, l: 1, type: 'py', electrons: py, radius: 160, color: 0xff66ff, axis: 'y', label: '4py' });
            remaining -= py;
        }
        if (remaining > 0) {
            const pz = Math.min(2, remaining);
            configs.push({ n: 4, l: 1, type: 'pz', electrons: pz, radius: 160, color: 0xff66ff, axis: 'z', label: '4pz' });
            remaining -= pz;
        }
        
        // 5s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 5, l: 0, type: 's', electrons: count, radius: 200, color: 0x00ffff, label: '5s' });
            remaining -= count;
        }
        
        // 4d (max 10)
        for (let i = 0; i < 5 && remaining > 0; i++) {
            const count = Math.min(2, remaining);
            configs.push({ n: 4, l: 2, type: 'd', subtype: dOrbitals[i], electrons: count, radius: 180, color: 0xffff00, orientation: i, label: `4${dOrbitals[i]}` });
            remaining -= count;
        }
        
        // 5p (max 6)
        if (remaining > 0) {
            const px = Math.min(2, remaining);
            configs.push({ n: 5, l: 1, type: 'px', electrons: px, radius: 200, color: 0xff66ff, axis: 'x', label: '5px' });
            remaining -= px;
        }
        if (remaining > 0) {
            const py = Math.min(2, remaining);
            configs.push({ n: 5, l: 1, type: 'py', electrons: py, radius: 200, color: 0xff66ff, axis: 'y', label: '5py' });
            remaining -= py;
        }
        if (remaining > 0) {
            const pz = Math.min(2, remaining);
            configs.push({ n: 5, l: 1, type: 'pz', electrons: pz, radius: 200, color: 0xff66ff, axis: 'z', label: '5pz' });
            remaining -= pz;
        }
        
        // 6s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 6, l: 0, type: 's', electrons: count, radius: 240, color: 0x00ffff, label: '6s' });
            remaining -= count;
        }
        
        // 4f (max 14)
        const fOrbitals = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'];
        for (let i = 0; i < 7 && remaining > 0; i++) {
            const count = Math.min(2, remaining);
            configs.push({ n: 4, l: 3, type: 'f', subtype: fOrbitals[i], electrons: count, radius: 190, color: 0xff9933, orientation: i, label: `4${fOrbitals[i]}` });
            remaining -= count;
        }
        
        // 5d (max 10)
        for (let i = 0; i < 5 && remaining > 0; i++) {
            const count = Math.min(2, remaining);
            configs.push({ n: 5, l: 2, type: 'd', subtype: dOrbitals[i], electrons: count, radius: 220, color: 0xffff00, orientation: i, label: `5${dOrbitals[i]}` });
            remaining -= count;
        }
        
        // 6p (max 6)
        if (remaining > 0) {
            const px = Math.min(2, remaining);
            configs.push({ n: 6, l: 1, type: 'px', electrons: px, radius: 240, color: 0xff66ff, axis: 'x', label: '6px' });
            remaining -= px;
        }
        if (remaining > 0) {
            const py = Math.min(2, remaining);
            configs.push({ n: 6, l: 1, type: 'py', electrons: py, radius: 240, color: 0xff66ff, axis: 'y', label: '6py' });
            remaining -= py;
        }
        if (remaining > 0) {
            const pz = Math.min(2, remaining);
            configs.push({ n: 6, l: 1, type: 'pz', electrons: pz, radius: 240, color: 0xff66ff, axis: 'z', label: '6pz' });
            remaining -= pz;
        }
        
        // 7s (max 2)
        if (remaining > 0) {
            const count = Math.min(2, remaining);
            configs.push({ n: 7, l: 0, type: 's', electrons: count, radius: 280, color: 0x00ffff, label: '7s' });
            remaining -= count;
        }
        
        // 5f (max 14)
        for (let i = 0; i < 7 && remaining > 0; i++) {
            const count = Math.min(2, remaining);
            configs.push({ n: 5, l: 3, type: 'f', subtype: fOrbitals[i], electrons: count, radius: 230, color: 0xff9933, orientation: i, label: `5${fOrbitals[i]}` });
            remaining -= count;
        }
        
        // 6d (max 10)
        for (let i = 0; i < 5 && remaining > 0; i++) {
            const count = Math.min(2, remaining);
            configs.push({ n: 6, l: 2, type: 'd', subtype: dOrbitals[i], electrons: count, radius: 260, color: 0xffff00, orientation: i, label: `6${dOrbitals[i]}` });
            remaining -= count;
        }
        
        return configs;
    }
    
    createOrbital(config) {
        const group = new THREE.Group();
        
        if (config.type === 's') {
            // Spherical s-orbital
            const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
            
            // Add cloud effect
            const cloudGeometry = new THREE.SphereGeometry(config.radius, 16, 16);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.05
            });
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            group.add(cloud);
            
        } else if (config.type.startsWith('p')) {
            // Dumbbell-shaped p-orbital
            const lobeGeometry = new THREE.SphereGeometry(config.radius * 0.4, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.15,
                wireframe: false
            });
            
            // Create two lobes
            const lobe1 = new THREE.Mesh(lobeGeometry, material);
            const lobe2 = new THREE.Mesh(lobeGeometry, material);
            
            const separation = config.radius * 0.5;
            
            if (config.axis === 'x') {
                lobe1.position.set(separation, 0, 0);
                lobe2.position.set(-separation, 0, 0);
                lobe1.scale.set(1.5, 1, 1);
                lobe2.scale.set(1.5, 1, 1);
            } else if (config.axis === 'y') {
                lobe1.position.set(0, separation, 0);
                lobe2.position.set(0, -separation, 0);
                lobe1.scale.set(1, 1.5, 1);
                lobe2.scale.set(1, 1.5, 1);
            } else if (config.axis === 'z') {
                lobe1.position.set(0, 0, separation);
                lobe2.position.set(0, 0, -separation);
                lobe1.scale.set(1, 1, 1.5);
                lobe2.scale.set(1, 1, 1.5);
            }
            
            group.add(lobe1);
            group.add(lobe2);
            
            // Add orbital path
            const curve = new THREE.EllipseCurve(
                0, 0,
                config.radius, config.radius,
                0, 2 * Math.PI,
                false, 0
            );
            
            const points = curve.getPoints(64);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: config.color,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(geometry, lineMaterial);
            
            if (config.axis === 'y') {
                line.rotation.x = Math.PI / 2;
            } else if (config.axis === 'z') {
                line.rotation.y = Math.PI / 2;
            }
            
            group.add(line);
        } else if (config.type === 'd') {
            // Cloverleaf-shaped d-orbitals
            const lobeGeometry = new THREE.SphereGeometry(config.radius * 0.3, 12, 12);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.15,
                wireframe: false
            });
            
            // Create 4 lobes for cloverleaf pattern
            const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
            const offset = config.radius * 0.4;
            
            angles.forEach(angle => {
                const lobe = new THREE.Mesh(lobeGeometry, material);
                const rot = config.orientation * Math.PI / 3;
                lobe.position.set(
                    Math.cos(angle + rot) * offset,
                    Math.sin(angle + rot) * offset,
                    0
                );
                group.add(lobe);
            });
            
            // Add orbital path
            const curve = new THREE.EllipseCurve(0, 0, config.radius, config.radius, 0, 2 * Math.PI, false, 0);
            const points = curve.getPoints(64);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: config.color,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(geometry, lineMaterial);
            line.rotation.x = config.orientation * 0.3;
            group.add(line);
            
        } else if (config.type === 'f') {
            // Complex f-orbitals (simplified as multiple lobes)
            const lobeGeometry = new THREE.SphereGeometry(config.radius * 0.25, 12, 12);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.12,
                wireframe: false
            });
            
            // Create 6 lobes in complex arrangement
            const positions = [
                [1, 0, 0], [-1, 0, 0],
                [0, 1, 0], [0, -1, 0],
                [0, 0, 1], [0, 0, -1]
            ];
            
            positions.forEach(pos => {
                const lobe = new THREE.Mesh(lobeGeometry, material);
                const scale = config.radius * 0.5;
                lobe.position.set(pos[0] * scale, pos[1] * scale, pos[2] * scale);
                lobe.scale.set(0.8, 0.8, 1.2);
                lobe.rotation.set(
                    config.orientation * 0.4,
                    config.orientation * 0.3,
                    config.orientation * 0.2
                );
                group.add(lobe);
            });
            
            // Add orbital path
            const curve = new THREE.EllipseCurve(0, 0, config.radius, config.radius, 0, 2 * Math.PI, false, 0);
            const points = curve.getPoints(64);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: config.color,
                transparent: true,
                opacity: 0.2
            });
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
        }
        
        group.userData.config = config;
        return group;
    }
    
    createElectron(config, spinIndex, globalIndex) {
        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.7
        });
        
        const electron = new THREE.Mesh(geometry, material);
        
        // Add e- label
        this.addParticleLabel(electron, 'e⁻', 0x00ffff, 0.8);
        
        this.scene.add(electron);
        
        // Initial position on orbital
        const angle = globalIndex * Math.PI * 0.7;
        const radius = config.radius;
        
        return {
            mesh: electron,
            config: config,
            angle: angle,
            radius: radius,
            speed: 0.01 / config.n, // Outer shells move slower
            spinIndex: spinIndex
        };
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
    }
    
    reset() {
        // Clear existing objects
        this.electrons.forEach(e => this.scene.remove(e.mesh));
        this.orbitalMeshes.forEach(o => this.scene.remove(o));
        this.scene.remove(this.nucleus);
        
        this.electrons = [];
        this.orbitalMeshes = [];
        this.nucleons = [];
        this.quarks = [];
        
        this.setupNucleus();
        this.setupElectronOrbitals();
        
        if (!this.isRunning) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    setTimeScale(value) {
        this.timeScale = value;
    }
    
    setZoom(value) {
        this.zoomLevel = value;
        const distance = 200 / value;
        this.camera.position.setLength(distance);
    }
    
    setElement(atomicNumber) {
        this.atomicNumber = atomicNumber;
        this.reset();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.animate());
        
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
        
        // Update animations
        this.updateQuarks();
        this.updateGluons();
        this.updateElectrons();
        
        // Update controls
        this.controls.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    updateQuarks() {
        // Rotate quarks inside nucleons
        this.quarks.forEach(quark => {
            quark.angle += 0.05 * this.timeScale;
            const radius = 3;
            quark.mesh.position.x = Math.cos(quark.angle) * radius;
            quark.mesh.position.y = Math.sin(quark.angle) * radius;
        });
        
        // Gentle nucleus rotation
        if (this.nucleus) {
            this.nucleus.rotation.y += 0.001 * this.timeScale;
        }
    }
    
    updateGluons() {
        // Animate gluon connections (exchange particles)
        this.gluons.forEach(gluon => {
            gluon.phase += 0.1 * this.timeScale;
            
            // Pulsating opacity to show exchange
            const opacity = 0.3 + Math.sin(gluon.phase) * 0.3;
            gluon.line.material.opacity = opacity;
            
            // Update line positions to follow quarks
            const positions = gluon.line.geometry.attributes.position.array;
            const pos1 = gluon.quark1.position;
            const pos2 = gluon.quark2.position;
            
            positions[0] = pos1.x;
            positions[1] = pos1.y;
            positions[2] = pos1.z;
            positions[3] = pos2.x;
            positions[4] = pos2.y;
            positions[5] = pos2.z;
            
            gluon.line.geometry.attributes.position.needsUpdate = true;
            
            // Color cycling to show energy exchange
            const colorPhase = (gluon.phase % (Math.PI * 2)) / (Math.PI * 2);
            gluon.line.material.color.setHSL(0.15, 1, 0.5 + colorPhase * 0.2);
        });
    }
    
    updateElectrons() {
        this.electrons.forEach(electron => {
            electron.angle += electron.speed * this.timeScale;
            
            const config = electron.config;
            
            if (config.type === 's') {
                // Circular orbit for s-orbitals
                electron.mesh.position.x = Math.cos(electron.angle) * electron.radius;
                electron.mesh.position.y = Math.sin(electron.angle) * electron.radius;
                electron.mesh.position.z = Math.sin(electron.angle * 2) * (electron.radius * 0.3);
            } else if (config.type.startsWith('p')) {
                // Figure-8 motion for p-orbitals
                if (config.axis === 'x') {
                    electron.mesh.position.x = Math.sin(electron.angle * 2) * electron.radius;
                    electron.mesh.position.y = Math.cos(electron.angle) * electron.radius * 0.5;
                    electron.mesh.position.z = Math.sin(electron.angle) * electron.radius * 0.5;
                } else if (config.axis === 'y') {
                    electron.mesh.position.x = Math.cos(electron.angle) * electron.radius * 0.5;
                    electron.mesh.position.y = Math.sin(electron.angle * 2) * electron.radius;
                    electron.mesh.position.z = Math.sin(electron.angle) * electron.radius * 0.5;
                } else if (config.axis === 'z') {
                    electron.mesh.position.x = Math.cos(electron.angle) * electron.radius * 0.5;
                    electron.mesh.position.y = Math.sin(electron.angle) * electron.radius * 0.5;
                    electron.mesh.position.z = Math.sin(electron.angle * 2) * electron.radius;
                }
            }
        });
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    setupCanvas() {
        this.onWindowResize();
    }
    
    getStatistics() {
        return {
            particleCount: this.electrons.length + this.nucleons.length,
            totalEnergy: '---',
            avgVelocity: '---',
            fps: this.fps
        };
    }
}
