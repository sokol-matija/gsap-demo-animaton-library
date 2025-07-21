// Wait for the DOM to be fully loaded
console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Register plugins
    try {
        gsap.registerPlugin(ScrollTrigger, Draggable);
        console.log('Plugins registered successfully');
    } catch (error) {
        console.error('Error registering plugins:', error);
    }
    
    // Epic loading animation for the entire site
    gsap.set("body", { overflow: "hidden" });
    gsap.set(".demo-section", { opacity: 0, y: 50 });
    gsap.set(".nav-btn", { opacity: 0, y: -20, scale: 0.8 });
    gsap.set("header h1", { opacity: 0, y: -30 });
    
    // Create loading timeline
    const loadingTimeline = gsap.timeline({
        onComplete: () => {
            gsap.set("body", { overflow: "auto" });
        }
    });
    
    loadingTimeline
        .to("header h1", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        })
        .to(".nav-btn", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, 0.3)
        .to(".demo-section.active", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 0.6);

    // Navigation
    console.log('Setting up navigation');
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.demo-section');
    
    console.log('Found nav buttons:', navButtons.length);
    console.log('Found sections:', sections.length);

    navButtons.forEach((button, index) => {
        console.log(`Setting up click for button ${index}:`, button.dataset.section);
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Button clicked: ${button.dataset.section}`);
            const targetSection = button.dataset.section;

            
            
            // Create epic navigation transition
            const currentActiveSection = document.querySelector('.demo-section.active');
            
            // Animate out current section
            if (currentActiveSection) {
                gsap.to(currentActiveSection, {
                    opacity: 0,
                    y: -30,
                    scale: 0.95,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        currentActiveSection.classList.remove('active');
                        
                        // Animate in new section
                        const newSection = document.getElementById(targetSection);
                        if (newSection) {
                            newSection.classList.add('active');
                            gsap.fromTo(newSection, 
                                {
                                    opacity: 0,
                                    y: 30,
                                    scale: 0.95,
                                    filter: "blur(10px)"
                                },
                                {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    filter: "blur(0px)",
                                    duration: 0.5,
                                    ease: "power2.out"
                                }
                            );
                        }
                    }
                });
            } else {
                // If no current section, just show the new one
                const newSection = document.getElementById(targetSection);
                if (newSection) {
                    newSection.classList.add('active');
                }
            }
            
            // Update active button with animation
            navButtons.forEach(btn => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
                btn.classList.remove('active');
            });
            
            // Animate active button
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "elastic.out(1, 0.5)",
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    gsap.set(button, { scale: 1 });
                }
            });
            
            button.classList.add('active');
            console.log('Active class added to button');
            console.log(`Section ${targetSection} activated`);
        });
    });

    // Basic Animations
    const box = document.querySelector('.box');
    const fadeInBtn = document.getElementById('fadeIn');
    const moveRightBtn = document.getElementById('moveRight');
    const rotateBtn = document.getElementById('rotate');
    const resetBtn = document.getElementById('reset');

    fadeInBtn.addEventListener('click', () => {
        gsap.to(box, { 
            opacity: 0.3, 
            scale: 0.8,
            duration: 1.2,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1
        });
    });

    moveRightBtn.addEventListener('click', () => {
        gsap.to(box, { 
            x: 250, 
            rotation: 180,
            duration: 1.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });

    rotateBtn.addEventListener('click', () => {
        gsap.to(box, { 
            rotation: "+=720",
            scale: 1.3,
            duration: 2,
            ease: 'back.inOut(1.7)',
            transformOrigin: "center center"
        });
    });

    resetBtn.addEventListener('click', () => {
        gsap.to(box, { 
            x: 0, 
            y: 0, 
            rotation: 0, 
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });
    });

    // Timeline Animations
    const circles = document.querySelectorAll('.circle');
    const playTimelineBtn = document.getElementById('playTimeline');
    const reverseTimelineBtn = document.getElementById('reverseTimeline');
    
    const timeline = gsap.timeline({ paused: true });
    
    timeline
        .to(circles[0], { 
            y: -80, 
            backgroundColor: '#ff6b6b',
            scale: 1.2,
            rotation: 180,
            duration: 0.8,
            ease: 'back.out(1.7)'
        })
        .to(circles[1], { 
            y: -80, 
            backgroundColor: '#4ecdc4',
            scale: 1.2,
            rotation: 180,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, "<0.2") // Start 0.2 seconds after the previous animation starts
        .to(circles[2], { 
            y: -80, 
            backgroundColor: '#45b7d1',
            scale: 1.2,
            rotation: 180,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, "<0.2")
        .to(circles[0], { 
            x: 150, 
            rotation: 540,
            backgroundColor: '#a8e6cf',
            duration: 1.5,
            ease: 'elastic.out(1, 0.3)'
        })
        .to(circles[1], { 
            scale: 2, 
            rotation: 720,
            backgroundColor: '#ffd93d',
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)'
        }, "-=1.2") // Overlap with previous animation
        .to(circles[2], { 
            x: -150, 
            rotation: -540,
            backgroundColor: '#ff8b94',
            duration: 1.5,
            ease: 'elastic.out(1, 0.3)'
        }, "-=1.5") // Start at the same time as the first circle movement
        .to(circles, {
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 1.5,
            ease: 'bounce.out',
            stagger: 0.2
        }, "+=0.5");

    playTimelineBtn.addEventListener('click', () => {
        timeline.play();
    });

    reverseTimelineBtn.addEventListener('click', () => {
        timeline.reverse();
    });

    // Text Animations
    const textElements = document.querySelectorAll('.split-text');
    const animateCharsBtn = document.getElementById('animateChars');
    const animateWordsBtn = document.getElementById('animateWords');
    const resetTextBtn = document.getElementById('resetText');
    
    // Animate characters (simpler approach without SplitText)
    animateCharsBtn.addEventListener('click', () => {
        // Reset first
        gsap.set(textElements, { opacity: 1, y: 0, scale: 1, rotation: 0 });
        
        // Animate text elements one by one
        textElements.forEach((element, index) => {
            gsap.from(element, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'back.out(1.7)'
            });
        });
    });
    
    // Animate words
    animateWordsBtn.addEventListener('click', () => {
        // Reset first
        gsap.set(textElements, { opacity: 1, y: 0, scale: 1, rotation: 0 });
        
        // Animate text elements with different effects
        textElements.forEach((element, index) => {
            gsap.from(element, {
                opacity: 0,
                scale: 0.5,
                rotation: index % 2 === 0 ? 5 : -5,
                duration: 0.8,
                delay: index * 0.3,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
    
    // Reset text
    resetTextBtn.addEventListener('click', () => {
        gsap.to(textElements, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.5
        });
    });
    
    // SVG Morphing Animations
    const morphPath = document.getElementById('morphPath');
    const morphToCircleBtn = document.getElementById('morphToCircle');
    const morphToStarBtn = document.getElementById('morphToStar');
    const morphToSquareBtn = document.getElementById('morphToSquare');
    
    // SVG path data for different shapes
    const squarePath = "M50,50 L250,50 L250,250 L50,250 Z";
    const circlePath = "M150,50 A100,100 0 0,1 250,150 A100,100 0 0,1 150,250 A100,100 0 0,1 50,150 A100,100 0 0,1 150,50 Z";
    const starPath = "M150,50 L179,122 L256,122 L194,167 L223,238 L150,193 L77,238 L106,167 L44,122 L121,122 Z";
    
    // Morph to circle
    morphToCircleBtn.addEventListener('click', () => {
        gsap.to(morphPath, {
            attr: { d: circlePath },
            duration: 1,
            ease: 'power2.inOut'
        });
    });
    
    // Morph to star
    morphToStarBtn.addEventListener('click', () => {
        gsap.to(morphPath, {
            attr: { d: starPath },
            duration: 1,
            ease: 'elastic.out(1, 0.7)'
        });
    });
    
    // Morph to square
    morphToSquareBtn.addEventListener('click', () => {
        gsap.to(morphPath, {
            attr: { d: squarePath },
            duration: 1,
            ease: 'back.out(1.7)'
        });
    });
    
    // Draggable Elements
    const dragBox1 = document.getElementById('dragBox1');
    const dragBox2 = document.getElementById('dragBox2');
    const resetDraggablesBtn = document.getElementById('resetDraggables');
    const throwEnabledBtn = document.getElementById('throwEnabled');
    
    // Initial positions for reset
    const initialPositions = {
        dragBox1: { top: 50, left: 50 },
        dragBox2: { top: 150, left: 200 }
    };
    
    // Create draggable instances
    let throwEnabled = false;
    
    function createDraggables() {
        // Destroy existing draggables if they exist
        if (dragBox1._gsap) dragBox1._gsap.kill();
        if (dragBox2._gsap) dragBox2._gsap.kill();
        
        // Create new draggable instances
        Draggable.create([dragBox1, dragBox2], {
            type: 'x,y',
            bounds: '.drag-area',
            edgeResistance: 0.65,
            throwProps: throwEnabled,
            onDragStart: function() {
                gsap.to(this.target, { scale: 1.1, duration: 0.2 });
            },
            onDragEnd: function() {
                gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
            }
        });
    }
    
    // Initialize draggables
    createDraggables();
    
    // Reset draggables to initial positions
    resetDraggablesBtn.addEventListener('click', () => {
        gsap.to(dragBox1, {
            top: initialPositions.dragBox1.top,
            left: initialPositions.dragBox1.left,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
        
        gsap.to(dragBox2, {
            top: initialPositions.dragBox2.top,
            left: initialPositions.dragBox2.left,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    });
    
    // Toggle throw enabled
    throwEnabledBtn.addEventListener('click', () => {
        throwEnabled = !throwEnabled;
        throwEnabledBtn.textContent = throwEnabled ? 'Disable Throwing' : 'Enable Throwing';
        createDraggables();
    });
    
    // Scroll Animations - Using ScrollTrigger
    console.log('Setting up scroll animations with ScrollTrigger');
    const scrollBoxes = document.querySelectorAll('.scroll-box');
    console.log('Found scroll boxes:', scrollBoxes.length);

    gsap.set(scrollBoxes, { opacity: 0, y: 100 }); // Initial state for animation

    ScrollTrigger.batch(scrollBoxes, {
        interval: 0.1, // time between when each object is revealed
        batchMax: 3,   // maximum number of objects to animate at a time
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, ease: 'power2.out' }),
        onLeave: batch => gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, ease: 'power2.out' }),
        onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
        // you can also define things like start/end/once here
        start: "top 80%",
        end: "bottom 20%"
    });

    // Initialize the first section as active
    document.querySelector('.nav-btn').click();
    
    // 3D Flip Cards Animation
    const flipCards = document.querySelectorAll('.flip-card');
    const flipCardsBtn = document.getElementById('flipCards');
    const resetFlipBtn = document.getElementById('resetFlip');
    let flipped = false;
    
    flipCardsBtn.addEventListener('click', () => {
        flipped = !flipped;
        
        // Staggered flip animation
        gsap.to(flipCards, {
            rotationY: flipped ? 180 : 0,
            duration: 1,
            stagger: 0.2, // Each card starts 0.2 seconds after the previous one
            ease: 'back.inOut(1.7)',
            transformStyle: 'preserve-3d',
            transformPerspective: 1000
        });
    });
    
    resetFlipBtn.addEventListener('click', () => {
        flipped = false;
        gsap.to(flipCards, {
            rotationY: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    });
    
    // Motion Path Animation
    try {
        gsap.registerPlugin(MotionPathPlugin);
        console.log('MotionPathPlugin registered successfully');
    } catch (error) {
        console.error('Error registering MotionPathPlugin:', error);
    }
    
    const pathFollower = document.getElementById('pathFollower');
    const playPathBtn = document.getElementById('playPath');
    const reversePathBtn = document.getElementById('reversePath');
    const resetPathBtn = document.getElementById('resetPath');
    
    // Create a timeline for the path animation
    const pathTimeline = gsap.timeline({ paused: true });
    
    pathTimeline.to(pathFollower, {
        duration: 5,
        motionPath: {
            path: '#motionPath',
            align: '#motionPath',
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
        },
        ease: 'none',
        repeat: -1, // Infinite repeat
        yoyo: true  // Go back and forth
    });
    
    playPathBtn.addEventListener('click', () => {
        pathTimeline.play();
    });
    
    reversePathBtn.addEventListener('click', () => {
        pathTimeline.reverse();
    });
    
    resetPathBtn.addEventListener('click', () => {
        pathTimeline.pause();
        gsap.to(pathFollower, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.5,
            onComplete: () => {
                // Reset to initial position
                gsap.set(pathFollower, { attr: { cx: 50, cy: 150 } });
            }
        });
    });
    
    // Parallax Effect
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const simulateParallaxBtn = document.getElementById('simulateParallax');
    const resetParallaxBtn = document.getElementById('resetParallax');
    
    // Initial positions for reset
    const layerInitialPositions = [
        { top: 50, left: 0 },
        { top: 120, left: 0 },
        { top: 190, left: 0 }
    ];
    
    simulateParallaxBtn.addEventListener('click', () => {
        // Simulate scroll effect with different speeds for each layer
        gsap.to(parallaxLayers[0], {
            x: 100,
            duration: 2,
            ease: 'power1.inOut'
        });
        
        gsap.to(parallaxLayers[1], {
            x: -150,
            duration: 2,
            ease: 'power1.inOut'
        });
        
        gsap.to(parallaxLayers[2], {
            x: 200,
            duration: 2,
            ease: 'power1.inOut'
        });
    });
    
    resetParallaxBtn.addEventListener('click', () => {
        gsap.to(parallaxLayers, {
            x: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Text Scramble Effect
    const scrambleTextElement = document.getElementById('scrambleText');
    const scrambleDescElement = document.getElementById('scrambleDesc');
    const startScrambleBtn = document.getElementById('startScramble');
    const resetScrambleBtn = document.getElementById('resetScramble');
    
    // Original text to revert to
    const originalText = {
        title: scrambleTextElement.textContent,
        desc: scrambleDescElement.textContent
    };
    
    // Custom text scramble effect
    function scrambleText(target, newText, duration = 1.5) {
        const originalText = target.textContent;
        const length = Math.max(originalText.length, newText.length);
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
        
        let timeline = gsap.timeline();
        let tempText = originalText;
        
        // Create scramble effect by updating text multiple times
        for (let i = 0; i < 10; i++) {
            timeline.add(() => {
                let scrambled = '';
                for (let j = 0; j < length; j++) {
                    if (j < tempText.length) {
                        // 50% chance to scramble each character
                        scrambled += Math.random() < 0.5 ? 
                            randomChars.charAt(Math.floor(Math.random() * randomChars.length)) : 
                            tempText.charAt(j);
                    } else {
                        scrambled += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                    }
                }
                tempText = scrambled;
                target.textContent = scrambled;
            }, i * (duration / 20));
        }
        
        // Set final text
        timeline.add(() => {
            target.textContent = newText;
        }, duration);
        
        return timeline;
    }
    
    startScrambleBtn.addEventListener('click', () => {
        const mainTimeline = gsap.timeline();
        
        mainTimeline.add(scrambleText(
            scrambleTextElement, 
            'GSAP is Awesome!', 
            1.5
        ));
        
        mainTimeline.add(scrambleText(
            scrambleDescElement, 
            'Text scrambling creates a cool hacker effect', 
            2
        ), 0.5); // Start 0.5 seconds after the first scramble
    });
    
    resetScrambleBtn.addEventListener('click', () => {
        scrambleTextElement.textContent = originalText.title;
        scrambleDescElement.textContent = originalText.desc;
    });
    
    // Physics-based Animations
    const balls = document.querySelectorAll('.physics-ball');
    const dropBallsBtn = document.getElementById('dropBalls');
    const throwBallsBtn = document.getElementById('throwBalls');
    const resetBallsBtn = document.getElementById('resetBalls');
    
    // Reset initial positions
    gsap.set(balls, { y: 0 });
    
    // Drop balls with bounce
    dropBallsBtn.addEventListener('click', () => {
        gsap.to(balls, {
            y: 250, // Drop to bottom
            duration: 1,
            stagger: 0.2,
            ease: 'bounce.out', // Natural bounce physics
            clearProps: 'x' // Clear any x movement
        });
    });
    
    // Throw balls with physics
    throwBallsBtn.addEventListener('click', () => {
        // Reset positions first
        gsap.set(balls, { y: 0, x: 0 });
        
        // Apply different physics to each ball
        gsap.to(balls[0], {
            x: 150,
            y: 250,
            duration: 1.5,
            ease: 'power1.in' // Accelerating ease
        });
        
        gsap.to(balls[1], {
            x: -100,
            y: 250,
            rotation: 360,
            duration: 1.2,
            ease: 'power2.in'
        });
        
        gsap.to(balls[2], {
            x: 50,
            y: 250,
            rotation: -720,
            duration: 1.8,
            ease: 'power3.in'
        });
    });
    
    // Reset balls
    resetBallsBtn.addEventListener('click', () => {
        gsap.to(balls, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
    });
    
    // Modern Notification Animation - Using the external module
    // Import is handled in the HTML file
    const showNotificationBtn = document.getElementById('showNotification');
    const successNotificationBtn = document.getElementById('successNotification');
    const errorNotificationBtn = document.getElementById('errorNotification');
    const infoNotificationBtn = document.getElementById('infoNotification');
    
    // Event listeners for the GSAP notification buttons
    showNotificationBtn.addEventListener('click', () => {
        notificationSystem.success();
    });
    
    successNotificationBtn.addEventListener('click', () => {
        notificationSystem.success('Success!', 'Your action has been completed successfully.');
    });
    
    errorNotificationBtn.addEventListener('click', () => {
        notificationSystem.error('Error!', 'Something went wrong. Please try again.');
    });
    
    infoNotificationBtn.addEventListener('click', () => {
        notificationSystem.info('Information', 'Here is some important information for you.');
    });
    
    // Toastify notification buttons
    const showToastifyBtn = document.getElementById('showToastify');
    const successToastifyBtn = document.getElementById('successToastify');
    const errorToastifyBtn = document.getElementById('errorToastify');
    const infoToastifyBtn = document.getElementById('infoToastify');
    
    showToastifyBtn.addEventListener('click', () => {
        toastify.success();
    });
    
    successToastifyBtn.addEventListener('click', () => {
        toastify.success('Your action has been completed successfully.');
    });
    
    errorToastifyBtn.addEventListener('click', () => {
        toastify.error('Something went wrong. Please try again.');
    });
    
    infoToastifyBtn.addEventListener('click', () => {
        toastify.info('Here is some important information for you.');
    });
    
    // SweetAlert2 notification buttons
    const showSweetAlertBtn = document.getElementById('showSweetAlert');
    const successSweetAlertBtn = document.getElementById('successSweetAlert');
    const errorSweetAlertBtn = document.getElementById('errorSweetAlert');
    const infoSweetAlertBtn = document.getElementById('infoSweetAlert');
    
    showSweetAlertBtn.addEventListener('click', () => {
        sweetAlert2Notifications.success();
    });
    
    successSweetAlertBtn.addEventListener('click', () => {
        sweetAlert2Notifications.success('Success!', 'Your action has been completed successfully.');
    });
    
    errorSweetAlertBtn.addEventListener('click', () => {
        sweetAlert2Notifications.error('Error!', 'Something went wrong. Please try again.');
    });
    
    infoSweetAlertBtn.addEventListener('click', () => {
        sweetAlert2Notifications.info('Information', 'Here is some important information for you.');
    });
    
    // Notiflix notification buttons
    const showNotiflixBtn = document.getElementById('showNotiflix');
    const successNotiflixBtn = document.getElementById('successNotiflix');
    const errorNotiflixBtn = document.getElementById('errorNotiflix');
    const infoNotiflixBtn = document.getElementById('infoNotiflix');
    
    showNotiflixBtn.addEventListener('click', () => {
        notiflixNotifications.success();
    });
    
    successNotiflixBtn.addEventListener('click', () => {
        notiflixNotifications.success('Your action has been completed successfully.');
    });
    
    errorNotiflixBtn.addEventListener('click', () => {
        notiflixNotifications.error('Something went wrong. Please try again.');
    });
    
    infoNotiflixBtn.addEventListener('click', () => {
        notiflixNotifications.info('Here is some important information for you.');
    });
});
