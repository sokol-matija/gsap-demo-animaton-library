class LiquidGallery {
    constructor() {
        this.canvas = document.getElementById('liquid-canvas');
        this.blobs = [];
        this.currentMode = 'gallery';
        this.settings = {
            speed: 1,
            viscosity: 0.8,
            morphIntensity: 1
        };
        this.isInitialized = false;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.setupBlobs();
        this.setupEventListeners();
        this.setupControls();
        this.startAnimation();
        
        this.isInitialized = true;
        console.log('Liquid Gallery initialized');
    }
    
    setupBlobs() {
        const blobElements = document.querySelectorAll('.blob-shape');
        
        blobElements.forEach((element, index) => {
            const blob = {
                element: element,
                id: index,
                originalSize: { 
                    width: parseInt(element.style.width) || 120, 
                    height: parseInt(element.style.height) || 120 
                },
                timeline: gsap.timeline({ repeat: -1, yoyo: true })
            };
            
            // Set up morphing animation
            this.setupBlobMorphing(blob);
            this.blobs.push(blob);
        });
        
        // Initialize gallery items animation
        this.animateGalleryItems();
    }
    
    setupBlobMorphing(blob) {
        const morphShapes = [
            "50%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "40% 60% 70% 30% / 40% 70% 30% 60%",
            "30% 70% 40% 60% / 70% 30% 60% 40%",
            "70% 30% 60% 40% / 30% 60% 40% 70%"
        ];
        
        blob.timeline
            .to(blob.element, {
                duration: 4 + Math.random() * 2,
                borderRadius: morphShapes[1],
                rotation: 90,
                scale: 1.1,
                ease: "sine.inOut"
            })
            .to(blob.element, {
                duration: 3 + Math.random() * 2,
                borderRadius: morphShapes[2],
                rotation: 180,
                scale: 0.9,
                ease: "sine.inOut"
            })
            .to(blob.element, {
                duration: 5 + Math.random() * 2,
                borderRadius: morphShapes[3],
                rotation: 270,
                scale: 1.05,
                ease: "sine.inOut"
            })
            .to(blob.element, {
                duration: 4 + Math.random() * 2,
                borderRadius: morphShapes[0],
                rotation: 360,
                scale: 1,
                ease: "sine.inOut"
            });
    }
    
    animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        
        gsap.fromTo(items, 
            {
                opacity: 0,
                y: 50,
                scale: 0.8
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "back.out(1.7)",
                delay: 0.5
            }
        );
    }
    
    setupEventListeners() {
        // Blob click interactions
        this.blobs.forEach(blob => {
            blob.element.addEventListener('click', () => this.blobClick(blob));
        });
        
        // Mouse tracking for canvas
        this.canvas.addEventListener('mousemove', (e) => this.updateMousePosition(e));
        this.canvas.addEventListener('click', (e) => this.canvasClick(e));
        
        // Gallery item interactions
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.galleryItemHover(item, index));
            item.addEventListener('mouseleave', () => this.galleryItemLeave(item, index));
            item.addEventListener('click', () => this.galleryItemClick(item, index));
        });
        
        // Mode selector
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeMode(btn.dataset.mode));
        });
        
        // Main controls
        document.getElementById('reset-liquid')?.addEventListener('click', () => this.resetScene());
        document.getElementById('add-blob')?.addEventListener('click', () => this.addBlob());
        document.getElementById('morph-all')?.addEventListener('click', () => this.morphAll());
        document.getElementById('liquid-explosion')?.addEventListener('click', () => this.explosion());
    }
    
    setupControls() {
        // Speed control
        const speedSlider = document.getElementById('blob-speed');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider && speedValue) {
            speedSlider.addEventListener('input', (e) => {
                this.settings.speed = parseFloat(e.target.value);
                speedValue.textContent = this.settings.speed.toFixed(1);
                this.updateAnimationSpeed();
            });
        }
        
        // Viscosity control
        const viscositySlider = document.getElementById('viscosity');
        const viscosityValue = document.getElementById('viscosity-value');
        if (viscositySlider && viscosityValue) {
            viscositySlider.addEventListener('input', (e) => {
                this.settings.viscosity = parseFloat(e.target.value);
                viscosityValue.textContent = this.settings.viscosity.toFixed(1);
                this.updateViscosity();
            });
        }
        
        // Morph intensity control
        const morphSlider = document.getElementById('morph-intensity');
        const morphValue = document.getElementById('morph-value');
        if (morphSlider && morphValue) {
            morphSlider.addEventListener('input', (e) => {
                this.settings.morphIntensity = parseFloat(e.target.value);
                morphValue.textContent = this.settings.morphIntensity.toFixed(1);
                this.updateMorphIntensity();
            });
        }
    }
    
    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        
        // Create ripple effect on mouse move
        this.createRipple(this.mouse.x, this.mouse.y);
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 1;
        `;
        
        this.canvas.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 4,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }
    
    canvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.currentMode === 'playground') {
            this.addBlobAt(x, y);
        }
    }
    
    blobClick(blob) {
        // Create explosion effect
        gsap.to(blob.element, {
            scale: 1.5,
            rotation: "+=180",
            duration: 0.3,
            ease: "back.out(2)",
            yoyo: true,
            repeat: 1
        });
        
        // Change color
        this.changeBlobColor(blob);
    }
    
    changeBlobColor(blob) {
        const colors = [
            'radial-gradient(circle, #667eea 0%, #764ba2 70%)',
            'radial-gradient(circle, #f093fb 0%, #f5576c 70%)',
            'radial-gradient(circle, #4facfe 0%, #00f2fe 70%)',
            'radial-gradient(circle, #43e97b 0%, #38f9d7 70%)',
            'radial-gradient(circle, #fa709a 0%, #fee140 70%)',
            'radial-gradient(circle, #a8edea 0%, #fed6e3 70%)'
        ];
        
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        blob.element.style.background = newColor;
    }
    
    galleryItemHover(item, index) {
        gsap.to(item, {
            y: -12,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out"
        });
        
        const orb = item.querySelector('.gradient-orb');
        if (orb) {
            gsap.to(orb, {
                scale: 1.2,
                rotation: "+=45",
                duration: 0.4,
                ease: "power2.out"
            });
        }
    }
    
    galleryItemLeave(item, index) {
        gsap.to(item, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
        });
        
        const orb = item.querySelector('.gradient-orb');
        if (orb) {
            gsap.to(orb, {
                scale: 1,
                rotation: "+=0",
                duration: 0.4,
                ease: "power2.out"
            });
        }
    }
    
    galleryItemClick(item, index) {
        // Create a ripple effect expanding from the item
        const rect = item.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - canvasRect.left;
        const y = rect.top + rect.height / 2 - canvasRect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(79,172,254,0.3) 0%, transparent 70%);
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 3;
        `;
        
        this.canvas.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 8,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
        
        // Animate the item itself
        gsap.to(item, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
    
    changeMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Apply mode-specific animations
        switch(mode) {
            case 'gallery':
                this.galleryMode();
                break;
            case 'playground':
                this.playgroundMode();
                break;
            case 'waves':
                this.wavesMode();
                break;
            case 'vortex':
                this.vortexMode();
                break;
        }
    }
    
    galleryMode() {
        // Reset blobs to original positions and behavior
        this.blobs.forEach(blob => {
            gsap.to(blob.element, {
                duration: 1,
                ease: "power2.inOut"
            });
        });
    }
    
    playgroundMode() {
        // Make blobs more interactive
        this.canvas.style.cursor = 'crosshair';
    }
    
    wavesMode() {
        // Create wave-like motion
        this.blobs.forEach((blob, index) => {
            gsap.to(blob.element, {
                y: "+=50",
                duration: 2 + index * 0.3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }
    
    vortexMode() {
        // Create spiral motion
        const centerX = this.canvas.offsetWidth / 2;
        const centerY = this.canvas.offsetHeight / 2;
        
        this.blobs.forEach((blob, index) => {
            const radius = 150 + index * 30;
            
            gsap.to(blob.element, {
                motionPath: {
                    path: `M${centerX + radius},${centerY} A${radius},${radius} 0 1,1 ${centerX - radius},${centerY} A${radius},${radius} 0 1,1 ${centerX + radius},${centerY}`,
                    autoRotate: true
                },
                duration: 8 + index * 2,
                repeat: -1,
                ease: "none"
            });
        });
    }
    
    addBlob() {
        this.addBlobAt(
            Math.random() * (this.canvas.offsetWidth - 100),
            Math.random() * (this.canvas.offsetHeight - 100)
        );
    }
    
    addBlobAt(x, y) {
        const colors = [
            'primary', 'secondary', 'accent'
        ];
        
        const colorGradients = {
            primary: 'radial-gradient(circle, #667eea 0%, #764ba2 70%)',
            secondary: 'radial-gradient(circle, #f093fb 0%, #f5576c 70%)',
            accent: 'radial-gradient(circle, #4facfe 0%, #00f2fe 70%)'
        };
        
        const newBlob = document.createElement('div');
        const colorKey = colors[Math.floor(Math.random() * colors.length)];
        
        newBlob.className = 'blob-shape';
        newBlob.dataset.color = colorKey;
        newBlob.style.cssText = `
            position: absolute;
            width: ${80 + Math.random() * 60}px;
            height: ${80 + Math.random() * 60}px;
            left: ${x}px;
            top: ${y}px;
            background: ${colorGradients[colorKey]};
            transform: scale(0);
        `;
        
        this.canvas.appendChild(newBlob);
        
        // Animate in
        gsap.to(newBlob, {
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)"
        });
        
        // Add to blobs array
        const blob = {
            element: newBlob,
            id: this.blobs.length,
            timeline: gsap.timeline({ repeat: -1, yoyo: true })
        };
        
        this.setupBlobMorphing(blob);
        this.blobs.push(blob);
        
        // Add click listener
        newBlob.addEventListener('click', () => this.blobClick(blob));
    }
    
    morphAll() {
        this.blobs.forEach((blob, index) => {
            gsap.to(blob.element, {
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                rotation: "+=180",
                scale: 1.2,
                duration: 0.8,
                delay: index * 0.1,
                ease: "elastic.out(1, 0.3)",
                yoyo: true,
                repeat: 1
            });
        });
    }
    
    explosion() {
        this.blobs.forEach((blob, index) => {
            // Random explosion direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 300;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            gsap.to(blob.element, {
                x: x,
                y: y,
                scale: 2 + Math.random(),
                rotation: "+=720",
                opacity: 0,
                duration: 1.5,
                delay: index * 0.05,
                ease: "power2.out",
                onComplete: () => {
                    // Return to original position
                    gsap.set(blob.element, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
                }
            });
        });
    }
    
    resetScene() {
        // Reset all blobs
        this.blobs.forEach(blob => {
            gsap.killTweensOf(blob.element);
            gsap.set(blob.element, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                borderRadius: "50%"
            });
            
            // Restart morphing animation
            this.setupBlobMorphing(blob);
        });
        
        // Remove any dynamically created blobs beyond the original 3
        const dynamicBlobs = this.canvas.querySelectorAll('.blob-shape');
        dynamicBlobs.forEach((blob, index) => {
            if (index > 2) {
                blob.remove();
            }
        });
        
        // Reset blobs array
        this.blobs = this.blobs.slice(0, 3);
        
        // Reset mode
        this.changeMode('gallery');
    }
    
    updateAnimationSpeed() {
        this.blobs.forEach(blob => {
            blob.timeline.timeScale(this.settings.speed);
        });
    }
    
    updateViscosity() {
        // Adjust blur based on viscosity
        const blur = (2 - this.settings.viscosity) * 2;
        this.blobs.forEach(blob => {
            blob.element.style.filter = `blur(${blur}px)`;
        });
    }
    
    updateMorphIntensity() {
        // This would adjust the intensity of morphing shapes
        // For now, it adjusts the scale variation
        const intensity = this.settings.morphIntensity;
        this.blobs.forEach(blob => {
            if (blob.timeline) {
                blob.timeline.progress(0);
                // Recreate timeline with new intensity
                this.setupBlobMorphing(blob);
            }
        });
    }
    
    startAnimation() {
        // Start floating particles animation
        const particles = document.querySelectorAll('.float-particle');
        particles.forEach((particle, index) => {
            gsap.set(particle, {
                x: Math.random() * this.canvas.offsetWidth,
                y: Math.random() * this.canvas.offsetHeight
            });
        });
    }
    
    destroy() {
        // Cleanup when switching sections
        this.blobs.forEach(blob => {
            gsap.killTweensOf(blob.element);
        });
        this.isInitialized = false;
    }
}

// Initialize when the section is shown
let liquidGallery = null;

function initLiquidGallery() {
    if (!liquidGallery) {
        liquidGallery = new LiquidGallery();
    }
}

function destroyLiquidGallery() {
    if (liquidGallery) {
        liquidGallery.destroy();
        liquidGallery = null;
    }
}

// Export for use in main app.js
if (typeof window !== 'undefined') {
    window.initLiquidGallery = initLiquidGallery;
    window.destroyLiquidGallery = destroyLiquidGallery;
}