class ParticlePlayground {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, down: false };
        this.settings = {
            gravity: 0.3,
            particleSize: 5,
            spawnRate: 5,
            mode: 'fountain',
            paused: false
        };
        this.animationId = null;
        this.fps = 0;
        this.lastTime = 0;
        this.frameCount = 0;
        
        this.initializeCanvas();
        this.bindEvents();
        this.start();
    }

    initializeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.canvas.style.background = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.border = '2px solid #333';
    }

    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', () => {
            this.mouse.down = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.settings.mode === 'fireworks') {
                this.createFirework(this.mouse.x, this.mouse.y);
            } else if (this.settings.mode === 'magnetic') {
                this.createMagneticBurst(this.mouse.x, this.mouse.y);
            }
        });

        // Control events
        document.getElementById('gravity-slider').addEventListener('input', (e) => {
            this.settings.gravity = parseFloat(e.target.value);
            document.getElementById('gravity-value').textContent = this.settings.gravity;
        });

        document.getElementById('particle-size').addEventListener('input', (e) => {
            this.settings.particleSize = parseInt(e.target.value);
            document.getElementById('size-value').textContent = this.settings.particleSize;
        });

        document.getElementById('spawn-rate').addEventListener('input', (e) => {
            this.settings.spawnRate = parseInt(e.target.value);
            document.getElementById('spawn-value').textContent = this.settings.spawnRate;
        });

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.mode = btn.dataset.mode;
                this.clearParticles();
            });
        });

        // Control buttons
        document.getElementById('clear-particles').addEventListener('click', () => {
            this.clearParticles();
        });

        document.getElementById('pause-particles').addEventListener('click', (e) => {
            this.settings.paused = !this.settings.paused;
            e.target.textContent = this.settings.paused ? 'Resume' : 'Pause';
            if (!this.settings.paused && !this.animationId) {
                this.animate();
            }
        });

        document.getElementById('explode-particles').addEventListener('click', () => {
            this.explodeAllParticles();
        });

        document.getElementById('screenshot-particles').addEventListener('click', () => {
            this.takeScreenshot();
        });
    }

    createParticle(x, y, options = {}) {
        const particle = {
            x: x,
            y: y,
            vx: (options.vx !== undefined) ? options.vx : (Math.random() - 0.5) * 10,
            vy: (options.vy !== undefined) ? options.vy : (Math.random() - 0.5) * 10,
            size: options.size || this.settings.particleSize,
            life: options.life || 1.0,
            decay: options.decay || 0.01,
            color: options.color || this.getRandomColor(),
            trail: options.trail || [],
            bounces: 0,
            friction: options.friction || 0.99,
            glow: options.glow || false
        };
        
        this.particles.push(particle);
        return particle;
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position based on mode
            this.updateParticleByMode(particle);
            
            // Apply physics
            particle.vy += this.settings.gravity;
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply friction
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // Boundary collision with bounce
            if (particle.x <= particle.size || particle.x >= this.canvas.width - particle.size) {
                particle.vx *= -0.8;
                particle.x = Math.max(particle.size, Math.min(this.canvas.width - particle.size, particle.x));
                particle.bounces++;
            }
            
            if (particle.y <= particle.size || particle.y >= this.canvas.height - particle.size) {
                particle.vy *= -0.8;
                particle.y = Math.max(particle.size, Math.min(this.canvas.height - particle.size, particle.y));
                particle.bounces++;
            }
            
            // Update trail for rainbow mode
            if (this.settings.mode === 'rainbow') {
                particle.trail.push({x: particle.x, y: particle.y, life: 1.0});
                if (particle.trail.length > 15) {
                    particle.trail.shift();
                }
                particle.trail.forEach(point => point.life -= 0.05);
            }
            
            // Update life
            particle.life -= particle.decay;
            
            // Remove dead particles
            if (particle.life <= 0 || particle.bounces > 5) {
                this.particles.splice(i, 1);
            }
        }
    }

    updateParticleByMode(particle) {
        switch (this.settings.mode) {
            case 'galaxy':
                // Spiral motion around center
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
                const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
                particle.vx += Math.cos(angle + 0.1) * 0.5;
                particle.vy += Math.sin(angle + 0.1) * 0.5;
                break;
                
            case 'magnetic':
                // Attract to mouse when clicked
                if (this.mouse.down) {
                    const dx = this.mouse.x - particle.x;
                    const dy = this.mouse.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 0) {
                        particle.vx += (dx / distance) * 2;
                        particle.vy += (dy / distance) * 2;
                    }
                }
                break;
                
            case 'rainbow':
                // Sine wave motion
                particle.vx += Math.sin(Date.now() * 0.01 + particle.x * 0.01) * 0.1;
                break;
        }
    }

    spawnParticles() {
        if (this.settings.paused) return;
        
        for (let i = 0; i < this.settings.spawnRate; i++) {
            switch (this.settings.mode) {
                case 'fountain':
                    this.createParticle(
                        this.canvas.width / 2 + (Math.random() - 0.5) * 50,
                        this.canvas.height - 50,
                        {
                            vx: (Math.random() - 0.5) * 8,
                            vy: -Math.random() * 15 - 5,
                            decay: 0.005
                        }
                    );
                    break;
                    
                case 'galaxy':
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 100;
                    this.createParticle(
                        this.canvas.width / 2 + Math.cos(angle) * radius,
                        this.canvas.height / 2 + Math.sin(angle) * radius,
                        {
                            vx: Math.cos(angle + Math.PI/2) * 3,
                            vy: Math.sin(angle + Math.PI/2) * 3,
                            decay: 0.003,
                            glow: true
                        }
                    );
                    break;
                    
                case 'rainbow':
                    this.createParticle(
                        50,
                        this.canvas.height / 2 + (Math.random() - 0.5) * 100,
                        {
                            vx: Math.random() * 5 + 2,
                            vy: (Math.random() - 0.5) * 2,
                            decay: 0.002,
                            trail: []
                        }
                    );
                    break;
            }
        }
    }

    createFirework(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'];
        const particleCount = 20 + Math.random() * 15;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 8 + 3;
            
            this.createParticle(x, y, {
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 3,
                decay: 0.02,
                glow: true
            });
        }
    }

    createMagneticBurst(x, y) {
        for (let i = 0; i < 30; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                friction: 0.95,
                decay: 0.01
            });
        }
    }

    explodeAllParticles() {
        this.particles.forEach(particle => {
            particle.vx = (Math.random() - 0.5) * 20;
            particle.vy = (Math.random() - 0.5) * 20;
            particle.decay = 0.05;
        });
    }

    clearParticles() {
        gsap.to(this.particles, {
            duration: 0.5,
            life: 0,
            ease: "power2.out",
            onComplete: () => {
                this.particles = [];
            }
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Draw trail for rainbow mode
            if (this.settings.mode === 'rainbow' && particle.trail.length > 0) {
                this.ctx.strokeStyle = particle.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                particle.trail.forEach((point, index) => {
                    if (point.life > 0) {
                        this.ctx.globalAlpha = point.life * 0.5;
                        if (index === 0) {
                            this.ctx.moveTo(point.x, point.y);
                        } else {
                            this.ctx.lineTo(point.x, point.y);
                        }
                    }
                });
                this.ctx.stroke();
            }
            
            // Set particle style
            this.ctx.globalAlpha = particle.life;
            
            if (particle.glow) {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 20;
            }
            
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    updateStats() {
        document.getElementById('particle-count').textContent = `Particles: ${this.particles.length}`;
        document.getElementById('fps-counter').textContent = `FPS: ${this.fps}`;
    }

    calculateFPS(currentTime) {
        this.frameCount++;
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    takeScreenshot() {
        const link = document.createElement('a');
        link.download = 'particle-playground.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    animate(currentTime = 0) {
        if (this.settings.paused) return;
        
        this.calculateFPS(currentTime);
        this.spawnParticles();
        this.updateParticles();
        this.drawParticles();
        this.updateStats();
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    let particlePlayground = null;
    
    // Initialize when particle playground section is first opened
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-section="particle-playground"]')) {
            if (!particlePlayground) {
                setTimeout(() => {
                    particlePlayground = new ParticlePlayground();
                }, 100);
            }
        }
    });
});