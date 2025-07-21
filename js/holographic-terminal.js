class HolographicTerminal {
    constructor() {
        this.terminal = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.dataCube = document.getElementById('data-cube');
        this.dnaHelix = document.getElementById('dna-helix');
        this.currentMode = 'cube';
        this.isInitialized = false;
        this.isTyping = false;
        this.matrixRunning = false;
        this.waveformRunning = false;
        
        this.commands = {
            help: 'Available commands: scan, analyze, visualize, matrix, hack, status, clear, reboot',
            scan: 'Initiating system scan... Detecting anomalies in sector 7...',
            analyze: 'Running deep analysis... Neural patterns detected...',
            visualize: 'Activating holographic display... Data streams online...',
            matrix: 'Entering the Matrix... Reality distortion initiated...',
            hack: 'WARNING: Unauthorized access detected! Activating countermeasures...',
            status: 'NEXUS System Status: ONLINE | Power: 98.7% | Threat Level: MINIMAL',
            clear: 'CLEAR_TERMINAL',
            reboot: 'REBOOT_SEQUENCE',
            quantum: 'Quantum entanglement established... Probability fields stabilizing...',
            neural: 'Neural network activated... Synaptic connections established...',
            crypto: 'Cryptographic protocols engaged... Encryption level: MAXIMUM...'
        };
        
        this.settings = {
            intensity: 1,
            scanSpeed: 1,
            dataRate: 5
        };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.setupControls();
        this.initializeAnimations();
        this.startBackgroundAnimations();
        
        this.isInitialized = true;
        console.log('Holographic Terminal initialized');
    }
    
    setupEventListeners() {
        // Terminal input
        if (this.input) {
            this.input.addEventListener('keydown', (e) => this.handleInput(e));
        }
        
        // Command buttons
        const cmdButtons = document.querySelectorAll('.cmd-btn');
        cmdButtons.forEach(btn => {
            btn.addEventListener('click', () => this.executeCommand(btn.dataset.cmd));
        });
        
        // Projection mode buttons
        const modeButtons = document.querySelectorAll('.projection-modes .mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeProjectionMode(btn.dataset.mode));
        });
        
        // Main control buttons
        document.getElementById('boot-sequence')?.addEventListener('click', () => this.bootSequence());
        document.getElementById('hack-mode')?.addEventListener('click', () => this.hackMode());
        document.getElementById('shutdown-terminal')?.addEventListener('click', () => this.shutdown());
        document.getElementById('reset-terminal')?.addEventListener('click', () => this.resetTerminal());
        
        // Progress circles click events
        const progressCircles = document.querySelectorAll('.circular-progress');
        progressCircles.forEach((circle, index) => {
            circle.addEventListener('click', () => this.animateMetrics(index));
        });
    }
    
    setupControls() {
        // Hologram intensity
        const intensitySlider = document.getElementById('holo-intensity');
        const intensityValue = document.getElementById('intensity-value');
        if (intensitySlider && intensityValue) {
            intensitySlider.addEventListener('input', (e) => {
                this.settings.intensity = parseFloat(e.target.value);
                intensityValue.textContent = this.settings.intensity.toFixed(1);
                this.updateHologramIntensity();
            });
        }
        
        // Scan speed
        const scanSpeedSlider = document.getElementById('scan-speed');
        const scanSpeedValue = document.getElementById('scan-speed-value');
        if (scanSpeedSlider && scanSpeedValue) {
            scanSpeedSlider.addEventListener('input', (e) => {
                this.settings.scanSpeed = parseFloat(e.target.value);
                scanSpeedValue.textContent = this.settings.scanSpeed.toFixed(1);
                this.updateScanSpeed();
            });
        }
        
        // Data rate
        const dataRateSlider = document.getElementById('data-rate');
        const dataRateValue = document.getElementById('data-rate-value');
        if (dataRateSlider && dataRateValue) {
            dataRateSlider.addEventListener('input', (e) => {
                this.settings.dataRate = parseInt(e.target.value);
                dataRateValue.textContent = this.settings.dataRate;
                this.updateDataRate();
            });
        }
    }
    
    initializeAnimations() {
        // Animate progress circles on load
        const progressCircles = document.querySelectorAll('.progress-circle');
        progressCircles.forEach((circle, index) => {
            const percentage = circle.closest('.circular-progress').dataset.percentage;
            const degrees = (percentage / 100) * 360;
            
            gsap.fromTo(circle, {
                '--progress': '0deg'
            }, {
                '--progress': `${degrees}deg`,
                duration: 2,
                delay: index * 0.3,
                ease: 'power2.out'
            });
        });
        
        // Initialize matrix and waveform canvases
        this.initializeMatrixRain();
        this.initializeWaveform();
    }
    
    startBackgroundAnimations() {
        // Floating data points
        const dataPoints = document.querySelectorAll('.data-point');
        dataPoints.forEach((point, index) => {
            const timeline = gsap.timeline({ repeat: -1, delay: index * 0.5 });
            timeline
                .to(point, {
                    scale: 1.5,
                    duration: 1,
                    ease: 'power2.out'
                })
                .to(point, {
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out'
                })
                .to(point, {
                    rotation: 360,
                    duration: 2,
                    ease: 'none'
                });
        });
        
        // Scan lines animation
        const scanLines = document.querySelectorAll('.scan-line');
        scanLines.forEach((line, index) => {
            gsap.set(line, { top: '-2px', opacity: 0 });
            const timeline = gsap.timeline({ repeat: -1, delay: index * 1 });
            timeline
                .to(line, {
                    top: '100%',
                    opacity: 1,
                    duration: 3,
                    ease: 'none'
                })
                .set(line, {
                    top: '-2px',
                    opacity: 0
                });
        });
    }
    
    handleInput(event) {
        if (event.key === 'Enter') {
            const command = this.input.value.trim().toLowerCase();
            this.addTerminalLine(`nexus@quantum:~$ ${this.input.value}`);
            this.executeTerminalCommand(command);
            this.input.value = '';
        }
    }
    
    executeTerminalCommand(command) {
        if (this.commands[command]) {
            if (command === 'clear') {
                this.clearTerminal();
            } else if (command === 'reboot') {
                this.bootSequence();
            } else {
                this.typeText(this.commands[command], () => {
                    this.addTerminalLine('');
                    this.addPromptLine();
                });
            }
        } else {
            this.typeText(`Command not found: ${command}. Type 'help' for available commands.`, () => {
                this.addTerminalLine('');
                this.addPromptLine();
            });
        }
    }
    
    executeCommand(command) {
        switch(command) {
            case 'scan':
                this.scanSystem();
                break;
            case 'analyze':
                this.analyzeData();
                break;
            case 'visualize':
                this.visualizeData();
                break;
            case 'matrix':
                this.toggleMatrix();
                break;
        }
    }
    
    scanSystem() {
        this.addTerminalLine('nexus@quantum:~$ scan --deep');
        this.typeText('Initiating deep system scan...', () => {
            this.addTerminalLine('║ Scanning neural pathways...');
            this.addTerminalLine('║ Analyzing quantum states...');
            this.addTerminalLine('║ Detecting holographic anomalies...');
            
            setTimeout(() => {
                this.addTerminalLine('║ SCAN COMPLETE');
                this.addTerminalLine('║ Anomalies detected: 3');
                this.addTerminalLine('║ Threat level: MINIMAL');
                this.addPromptLine();
                this.glitchEffect();
            }, 2000);
        });
    }
    
    analyzeData() {
        this.addTerminalLine('nexus@quantum:~$ analyze --neural');
        this.typeText('Running neural pattern analysis...', () => {
            const timeline = gsap.timeline();
            timeline
                .call(() => this.addTerminalLine('► Extracting data patterns...'))
                .call(() => this.addTerminalLine('► Processing quantum signatures...'), null, 0.5)
                .call(() => this.addTerminalLine('► Neural network convergence: 94.7%'), null, 1)
                .call(() => {
                    this.addTerminalLine('► ANALYSIS COMPLETE');
                    this.addPromptLine();
                    this.animateAllMetrics();
                }, null, 1.5);
        });
    }
    
    visualizeData() {
        this.addTerminalLine('nexus@quantum:~$ visualize --3d');
        this.typeText('Activating holographic projection...', () => {
            this.changeProjectionMode('dna');
            this.addTerminalLine('║ Hologram intensity: MAXIMUM');
            this.addTerminalLine('║ Projection stable');
            this.addPromptLine();
            
            // Enhance visual effects
            const container = document.querySelector('.terminal-container');
            gsap.to(container, {
                boxShadow: '0 0 100px rgba(0, 255, 255, 0.8), inset 0 0 100px rgba(0, 255, 255, 0.2)',
                duration: 2,
                yoyo: true,
                repeat: 1
            });
        });
    }
    
    toggleMatrix() {
        if (!this.matrixRunning) {
            this.startMatrixRain();
            this.addTerminalLine('nexus@quantum:~$ matrix --enter');
            this.typeText('Entering the Matrix... Reality distortion initiated...', () => {
                this.addTerminalLine('║ Matrix protocol: ACTIVE');
                this.addTerminalLine('║ Digital rain: ENABLED');
                this.addPromptLine();
            });
        } else {
            this.stopMatrixRain();
            this.addTerminalLine('nexus@quantum:~$ matrix --exit');
            this.typeText('Exiting Matrix... Reality restored...', () => {
                this.addPromptLine();
            });
        }
    }
    
    changeProjectionMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.projection-modes .mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Hide all projections first
        gsap.set([this.dataCube, this.dnaHelix], { display: 'none', opacity: 0 });
        
        // Show selected projection
        let targetElement;
        switch(mode) {
            case 'cube':
                targetElement = this.dataCube;
                break;
            case 'dna':
                targetElement = this.dnaHelix;
                break;
            case 'neural':
                this.createNeuralNetwork();
                return;
            case 'quantum':
                this.createQuantumVisualization();
                return;
        }
        
        if (targetElement) {
            gsap.set(targetElement, { display: 'block' });
            gsap.to(targetElement, {
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            });
        }
    }
    
    createNeuralNetwork() {
        // Remove existing neural network
        const existing = document.querySelector('.neural-network');
        if (existing) existing.remove();
        
        // Create neural network visualization
        const neuralNet = document.createElement('div');
        neuralNet.className = 'neural-network';
        neuralNet.style.cssText = `
            position: absolute;
            top: 20%;
            left: 20%;
            width: 60%;
            height: 60%;
            pointer-events: none;
        `;
        
        // Create nodes
        for (let i = 0; i < 12; i++) {
            const node = document.createElement('div');
            node.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: #00ffff;
                border-radius: 50%;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            neuralNet.appendChild(node);
            
            // Animate nodes
            gsap.to(node, {
                scale: Math.random() * 0.5 + 0.5,
                duration: Math.random() * 2 + 1,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
        
        document.querySelector('.hologram-projection').appendChild(neuralNet);
        
        gsap.fromTo(neuralNet, {
            opacity: 0,
            scale: 0.5
        }, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.7)'
        });
    }
    
    createQuantumVisualization() {
        // Remove existing quantum vis
        const existing = document.querySelector('.quantum-particles');
        if (existing) existing.remove();
        
        // Create quantum particle system
        const quantumVis = document.createElement('div');
        quantumVis.className = 'quantum-particles';
        quantumVis.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        
        // Create quantum particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${i % 2 === 0 ? '#ff00ff' : '#00ffff'};
                border-radius: 50%;
                box-shadow: 0 0 10px ${i % 2 === 0 ? 'rgba(255, 0, 255, 0.8)' : 'rgba(0, 255, 255, 0.8)'};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            quantumVis.appendChild(particle);
            
            // Quantum entanglement animation
            const timeline = gsap.timeline({ repeat: -1 });
            timeline
                .to(particle, {
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    duration: Math.random() * 3 + 2,
                    ease: 'sine.inOut'
                })
                .to(particle, {
                    scale: 0,
                    duration: 0.1
                })
                .set(particle, {
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                })
                .to(particle, {
                    scale: 1,
                    duration: 0.1
                });
        }
        
        document.querySelector('.hologram-projection').appendChild(quantumVis);
        
        gsap.fromTo(quantumVis, {
            opacity: 0
        }, {
            opacity: 1,
            duration: 1
        });
    }
    
    bootSequence() {
        this.clearTerminal();
        const bootMessages = [
            'NEXUS QUANTUM SYSTEM v4.2.1',
            'Initializing neural pathways...',
            'Loading quantum matrix...',
            'Establishing holographic interface...',
            'Calibrating sensors...',
            'Running diagnostics...',
            '██████████ 100% COMPLETE',
            'SYSTEM READY - Welcome to the future.'
        ];
        
        let delay = 0;
        bootMessages.forEach((message, index) => {
            setTimeout(() => {
                this.addTerminalLine(`[${new Date().toLocaleTimeString()}] ${message}`);
                if (index === bootMessages.length - 1) {
                    setTimeout(() => this.addPromptLine(), 500);
                }
                
                // Visual effects during boot
                if (index === 3) {
                    this.glitchEffect();
                }
            }, delay);
            delay += 400;
        });
    }
    
    hackMode() {
        this.addTerminalLine('nexus@quantum:~$ sudo hack --stealth');
        this.typeText('WARNING: Unauthorized access attempt detected!', () => {
            this.addTerminalLine('║ Initiating countermeasures...');
            this.addTerminalLine('║ Tracing connection...');
            this.addTerminalLine('║ IP: 192.168.1.337');
            this.addTerminalLine('║ Location: CLASSIFIED');
            
            // Start glitch effects and security animations
            this.securityBreach();
            
            setTimeout(() => {
                this.addTerminalLine('║ ACCESS DENIED - Security protocols active');
                this.addPromptLine();
            }, 3000);
        });
    }
    
    shutdown() {
        this.addTerminalLine('nexus@quantum:~$ shutdown --force');
        this.typeText('Initiating system shutdown...', () => {
            const elements = document.querySelectorAll('.terminal-container *');
            
            gsap.to(elements, {
                opacity: 0,
                duration: 2,
                stagger: 0.05,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.set(elements, { opacity: 1 });
                        this.addTerminalLine('SYSTEM OFFLINE');
                        this.addTerminalLine('Press RESET to reboot...');
                    }, 1000);
                }
            });
        });
    }
    
    resetTerminal() {
        const container = document.querySelector('.terminal-container');
        
        // Flash effect
        gsap.to(container, {
            backgroundColor: '#ffffff',
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.clearTerminal();
                this.bootSequence();
                this.resetAnimations();
            }
        });
    }
    
    // Helper methods
    addTerminalLine(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        this.terminal.appendChild(line);
        this.scrollToBottom();
    }
    
    addPromptLine() {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = '<span class="prompt">nexus@quantum:~$</span> <span class="cursor">█</span>';
        this.terminal.appendChild(line);
        this.scrollToBottom();
    }
    
    typeText(text, callback) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const line = document.createElement('div');
        line.className = 'terminal-line';
        this.terminal.appendChild(line);
        
        let index = 0;
        const interval = setInterval(() => {
            line.textContent = text.substring(0, index + 1) + (index < text.length - 1 ? '_' : '');
            index++;
            
            if (index >= text.length) {
                clearInterval(interval);
                line.textContent = text;
                this.isTyping = false;
                if (callback) callback();
            }
        }, 50);
        
        this.scrollToBottom();
    }
    
    clearTerminal() {
        this.terminal.innerHTML = '';
        this.addPromptLine();
    }
    
    scrollToBottom() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    glitchEffect() {
        const container = document.querySelector('.terminal-container');
        container.classList.add('glitch-effect');
        setTimeout(() => {
            container.classList.remove('glitch-effect');
        }, 1000);
    }
    
    securityBreach() {
        const elements = document.querySelectorAll('.cmd-btn, .mode-btn, .circular-progress');
        
        elements.forEach((el, index) => {
            setTimeout(() => {
                gsap.to(el, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 3,
                    ease: 'power2.inOut'
                });
                
                // Flash red border
                const originalBorder = el.style.borderColor;
                el.style.borderColor = '#ff0000';
                setTimeout(() => {
                    el.style.borderColor = originalBorder;
                }, 500);
            }, index * 100);
        });
    }
    
    animateMetrics(index) {
        const metrics = document.querySelectorAll('.circular-progress');
        const metric = metrics[index];
        const newPercentage = Math.floor(Math.random() * 100);
        const degrees = (newPercentage / 100) * 360;
        
        gsap.to(metric.querySelector('.progress-circle'), {
            '--progress': `${degrees}deg`,
            duration: 1,
            ease: 'power2.out'
        });
        
        metric.querySelector('.progress-value').textContent = `${newPercentage}%`;
        metric.dataset.percentage = newPercentage;
    }
    
    animateAllMetrics() {
        const metrics = document.querySelectorAll('.circular-progress');
        metrics.forEach((metric, index) => {
            setTimeout(() => this.animateMetrics(index), index * 200);
        });
    }
    
    updateHologramIntensity() {
        const projection = document.querySelector('.hologram-projection');
        gsap.to(projection, {
            filter: `brightness(${this.settings.intensity})`,
            duration: 0.5
        });
    }
    
    updateScanSpeed() {
        const scanLines = document.querySelectorAll('.scan-line');
        scanLines.forEach(line => {
            const animation = line.getAnimations()[0];
            if (animation) {
                animation.playbackRate = this.settings.scanSpeed;
            }
        });
    }
    
    updateDataRate() {
        // This would affect data streaming animations
        clearInterval(this.dataStreamInterval);
        this.dataStreamInterval = setInterval(() => {
            this.createDataStream();
        }, 1000 / this.settings.dataRate);
    }
    
    createDataStream() {
        const container = document.querySelector('.hologram-projection');
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, transparent, #00ffff, transparent);
            left: ${Math.random() * 100}%;
            top: 100%;
        `;
        
        container.appendChild(stream);
        
        gsap.to(stream, {
            y: -container.offsetHeight - 20,
            duration: 2,
            ease: 'none',
            onComplete: () => stream.remove()
        });
    }
    
    initializeMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        this.matrixCtx = canvas.getContext('2d');
        this.matrixChars = '01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ'.split('');
        this.matrixDrops = [];
        
        for (let i = 0; i < canvas.width / 10; i++) {
            this.matrixDrops[i] = 1;
        }
    }
    
    startMatrixRain() {
        if (this.matrixRunning) return;
        this.matrixRunning = true;
        
        const animate = () => {
            if (!this.matrixRunning) return;
            
            this.matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.matrixCtx.fillRect(0, 0, 200, 300);
            
            this.matrixCtx.fillStyle = '#0f0';
            this.matrixCtx.font = '10px monospace';
            
            for (let i = 0; i < this.matrixDrops.length; i++) {
                const text = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
                this.matrixCtx.fillText(text, i * 10, this.matrixDrops[i] * 10);
                
                if (this.matrixDrops[i] * 10 > 300 && Math.random() > 0.975) {
                    this.matrixDrops[i] = 0;
                }
                this.matrixDrops[i]++;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stopMatrixRain() {
        this.matrixRunning = false;
        if (this.matrixCtx) {
            this.matrixCtx.clearRect(0, 0, 200, 300);
        }
    }
    
    initializeWaveform() {
        const canvas = document.getElementById('waveform-canvas');
        if (!canvas) return;
        
        this.waveformCtx = canvas.getContext('2d');
        this.startWaveform();
    }
    
    startWaveform() {
        if (this.waveformRunning) return;
        this.waveformRunning = true;
        
        let phase = 0;
        const animate = () => {
            if (!this.waveformRunning) return;
            
            this.waveformCtx.clearRect(0, 0, 300, 120);
            this.waveformCtx.strokeStyle = '#ff00ff';
            this.waveformCtx.lineWidth = 2;
            this.waveformCtx.beginPath();
            
            for (let x = 0; x < 300; x++) {
                const y = 60 + Math.sin((x + phase) * 0.02) * 30 + Math.sin((x + phase) * 0.05) * 15;
                if (x === 0) {
                    this.waveformCtx.moveTo(x, y);
                } else {
                    this.waveformCtx.lineTo(x, y);
                }
            }
            
            this.waveformCtx.stroke();
            phase += 2;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    resetAnimations() {
        this.stopMatrixRain();
        this.waveformRunning = false;
        this.changeProjectionMode('cube');
        this.animateAllMetrics();
    }
    
    destroy() {
        this.matrixRunning = false;
        this.waveformRunning = false;
        clearInterval(this.dataStreamInterval);
        
        // Clean up any created elements
        const neuralNet = document.querySelector('.neural-network');
        const quantumVis = document.querySelector('.quantum-particles');
        if (neuralNet) neuralNet.remove();
        if (quantumVis) quantumVis.remove();
        
        this.isInitialized = false;
    }
}

// Initialize when the section is shown
let holographicTerminal = null;

function initHolographicTerminal() {
    if (!holographicTerminal) {
        holographicTerminal = new HolographicTerminal();
    }
}

function destroyHolographicTerminal() {
    if (holographicTerminal) {
        holographicTerminal.destroy();
        holographicTerminal = null;
    }
}

// Export for use in main app.js
if (typeof window !== 'undefined') {
    window.initHolographicTerminal = initHolographicTerminal;
    window.destroyHolographicTerminal = destroyHolographicTerminal;
}