// Banjo Hand Animation with GSAP
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const handBanjoSvg = document.getElementById('hand-banjo');
    const handGroup = document.getElementById('hand');
    const banjoGroup = document.getElementById('banjo');
    const strings = document.querySelectorAll('.string');
    const resetBtn = document.getElementById('reset-btn');
    
    // Audio Elements
    const banjoSounds = [
        document.getElementById('banjo-sound-1'),
        document.getElementById('banjo-sound-2'),
        document.getElementById('banjo-sound-3'),
        document.getElementById('banjo-sound-4')
    ];
    
    // Animation State
    let isTransformed = false;
    let isPlaying = false;
    let currentAnimation = null;
    
    // Initialize string wave points
    const stringWavePoints = strings.map(string => {
        const x = parseFloat(string.getAttribute('x1'));
        return {
            x,
            originalY1: parseFloat(string.getAttribute('y1')),
            originalY2: parseFloat(string.getAttribute('y2')),
            amplitude: 0,
            frequency: 0.1 + Math.random() * 0.1,
            phase: 0
        };
    });
    
    // Create GSAP timeline for hand to banjo transformation
    const transformTimeline = gsap.timeline({ paused: true });
    
    // Add animations to the timeline
    transformTimeline
        // Fade out the hand
        .to(handGroup, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        })
        
        // Simultaneously start fading in the banjo
        .to(banjoGroup, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.in'
        }, '-=0.3')
        
        // Morph the fingers into banjo parts
        .to('#index-finger, #middle-finger, #ring-finger, #pinky-finger', {
            morphSVG: '#banjo-neck',
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.5')
        
        // Morph the palm into banjo body
        .to('#palm', {
            morphSVG: '#banjo-body',
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.8')
        
        // Morph the thumb into banjo head
        .to('#thumb', {
            morphSVG: '#banjo-head',
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.8')
        
        // Reveal the strings with a staggered effect
        .fromTo(strings, {
            opacity: 0,
            attr: { 'stroke-dasharray': '0 10' }
        }, {
            opacity: 1,
            attr: { 'stroke-dasharray': '0' },
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.inOut'
        }, '-=0.3');
    
    // Function to handle hover effect
    function handleHover() {
        if (!isTransformed) {
            transformTimeline.play();
            isTransformed = true;
        }
    }
    
    // Function to reset animation
    function resetAnimation() {
        if (isTransformed) {
            transformTimeline.reverse();
            isTransformed = false;
            isPlaying = false;
            
            // Reset string animations
            if (currentAnimation) {
                cancelAnimationFrame(currentAnimation);
                currentAnimation = null;
            }
            
            // Reset strings to straight position
            strings.forEach((string, index) => {
                gsap.set(string, {
                    attr: {
                        x1: stringWavePoints[index].x,
                        y1: stringWavePoints[index].originalY1,
                        x2: stringWavePoints[index].x,
                        y2: stringWavePoints[index].originalY2
                    }
                });
            });
        }
    }
    
    // Function to animate string waves
    function animateStringWaves() {
        if (!isPlaying || !isTransformed) return;
        
        strings.forEach((string, index) => {
            const wave = stringWavePoints[index];
            
            // Update phase for continuous animation
            wave.phase += wave.frequency;
            
            // Calculate wave points
            const controlPoints = [];
            const segments = 10;
            const length = wave.originalY2 - wave.originalY1;
            const segmentLength = length / segments;
            
            for (let i = 0; i <= segments; i++) {
                const y = wave.originalY1 + (i * segmentLength);
                const xOffset = Math.sin(wave.phase + (i / segments) * Math.PI * 2) * wave.amplitude;
                controlPoints.push(wave.x + xOffset);
                controlPoints.push(y);
            }
            
            // Apply wave effect to string
            gsap.set(string, {
                attr: { points: controlPoints.join(',') }
            });
            
            // Gradually reduce amplitude for damping effect
            wave.amplitude *= 0.98;
            
            // If amplitude is very small, reset it to zero
            if (wave.amplitude < 0.1) {
                wave.amplitude = 0;
            }
        });
        
        // Continue animation loop
        currentAnimation = requestAnimationFrame(animateStringWaves);
    }
    
    // Function to pluck a string
    function pluckString(index) {
        if (!isTransformed) return;
        
        // Set the string as plucked for visual effect
        strings[index].classList.add('plucked');
        setTimeout(() => {
            strings[index].classList.remove('plucked');
        }, 500);
        
        // Set initial amplitude for the plucked string
        stringWavePoints[index].amplitude = 5 + Math.random() * 3;
        stringWavePoints[index].phase = 0;
        
        // Play corresponding banjo sound
        banjoSounds[index].currentTime = 0;
        banjoSounds[index].play();
        
        // Start animation if not already playing
        if (!isPlaying) {
            isPlaying = true;
            animateStringWaves();
        }
    }
    
    // Function to handle click on the banjo
    function handleClick(event) {
        if (!isTransformed) return;
        
        // Get click coordinates relative to SVG
        const svgRect = handBanjoSvg.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        
        // Determine which string was clicked based on x-coordinate
        const stringWidth = svgRect.width / 5;
        const stringIndex = Math.min(Math.floor((x - stringWidth) / stringWidth), 3);
        
        if (stringIndex >= 0 && stringIndex < 4) {
            pluckString(stringIndex);
        }
    }
    
    // Event Listeners
    handBanjoSvg.addEventListener('mouseenter', handleHover);
    handBanjoSvg.addEventListener('click', handleClick);
    resetBtn.addEventListener('click', resetAnimation);
    
    // Create a custom morphSVG plugin if not available
    if (!gsap.utils.toArray || !gsap.utils.toArray().morphSVG) {
        gsap.registerPlugin({
            name: "morphSVG",
            init: function(target, endShape) {
                // Simple fallback if morphSVG plugin is not available
                // Just hide the target and show the end shape
                const endShapeEl = document.querySelector(endShape);
                if (endShapeEl) {
                    this.target = target;
                    this.endShape = endShapeEl;
                    gsap.set(this.endShape, { opacity: 0 });
                    return true;
                }
                return false;
            },
            render: function(progress) {
                gsap.set(this.target, { opacity: 1 - progress });
                gsap.set(this.endShape, { opacity: progress });
            }
        });
    }
    
    // Debug helper
    console.log('Banjo Hand Animation Initialized');
});
