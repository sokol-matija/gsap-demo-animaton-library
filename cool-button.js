// Cool Button - GSAP ScrollTrigger Animations
// This script runs when the cool-button section is active

function initCoolButton() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded for Cool Button');
        return;
    }

    console.log('Initializing Cool Button animations');

    // Clear any existing ScrollTriggers for this section
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && trigger.vars.trigger && trigger.vars.trigger.closest && trigger.vars.trigger.closest('#cool-button')) {
            trigger.kill();
        }
    });

    // Wait for section to be visible
    const section = document.getElementById('cool-button');
    if (!section || !section.classList.contains('active')) {
        return;
    }

    // Cool Button Animation
    const coolButton = section.querySelector(".cool-button");
    if (coolButton) {
        gsap.to(coolButton, {
            scrollTrigger: {
                trigger: coolButton,
                start: "top center",
                end: "bottom top",
                scrub: true,
                onEnter: () => console.log('Cool button animation started'),
                onLeave: () => console.log('Cool button animation ended')
            },
            rotation: 360,
            scale: 1.5,
            backgroundColor: "#ff6b6b",
            borderRadius: "50%",
            ease: "power2.inOut"
        });

        // Interactive hover effect
        coolButton.addEventListener('mouseenter', () => {
            gsap.to(coolButton, {
                scale: 1.2,
                backgroundColor: "#4ecdc4",
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });

        coolButton.addEventListener('mouseleave', () => {
            gsap.to(coolButton, {
                scale: 1,
                backgroundColor: "#4b6cb7",
                duration: 0.3,
                ease: "power2.out"
            });
        });

        coolButton.addEventListener('click', () => {
            gsap.to(coolButton, {
                rotation: "+=360",
                scale: 1.8,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                yoyo: true,
                repeat: 1
            });
        });
    }

    // Animation Section Boxes
    const animationBoxes = section.querySelectorAll(".animation-section .box");
    if (animationBoxes.length > 0) {
        gsap.from(animationBoxes, {
            scrollTrigger: {
                trigger: section.querySelector(".animation-section"),
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                toggleActions: "play none none reverse"
            },
            y: 400,
            stagger: 0.2,
            opacity: 0,
            rotation: 180,
            scale: 0.5,
            ease: "power4.out"
        });
    }

    // Presentation Sections
    const slideIn = section.querySelector(".slide-in");
    if (slideIn) {
        gsap.from(slideIn, {
            scrollTrigger: {
                trigger: slideIn,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: -500,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    }

    const fadeIn = section.querySelector(".fade-in");
    if (fadeIn) {
        gsap.from(fadeIn, {
            scrollTrigger: {
                trigger: fadeIn,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.8,
            duration: 2,
            ease: "power1.inOut"
        });
    }

    const slideInLeft = section.querySelector(".slide-in-left");
    if (slideInLeft) {
        gsap.from(slideInLeft, {
            scrollTrigger: {
                trigger: slideInLeft,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: 500,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    }

    // Cards Animation
    const cards = section.querySelectorAll(".card");
    if (cards.length > 0) {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: section.querySelector(".stagger-in"),
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            stagger: 0.3,
            duration: 1,
            ease: "power4.out",
            rotation: 15,
            scale: 0.8
        });
    }

    // Motion Path Animation (simplified without MotionPathPlugin)
    const pathFollower = section.querySelector(".path-follower");
    const bridgePath = section.querySelector("#bridge-path");
    if (pathFollower && bridgePath) {
        // Create a simple horizontal motion instead of complex path following
        gsap.to(pathFollower, {
            scrollTrigger: {
                trigger: section.querySelector(".motion-path-section"),
                start: "top center",
                end: "bottom center",
                scrub: true
            },
            x: 400,
            y: -50,
            rotation: 360,
            scale: 1.5,
            ease: "power1.inOut"
        });

        // Add some visual feedback to the path
        gsap.to(bridgePath, {
            scrollTrigger: {
                trigger: section.querySelector(".motion-path-section"),
                start: "top center",
                end: "bottom center",
                scrub: true
            },
            strokeWidth: 4,
            stroke: "#ff6b6b"
        });
    }

    // Text Scramble Effect (simplified)
    const scrambleText = section.querySelector("#scramble-text");
    if (scrambleText) {
        const originalText = scrambleText.textContent;
        
        gsap.to(scrambleText, {
            scrollTrigger: {
                trigger: section.querySelector(".text-scramble-section"),
                start: "top 80%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                    // Simple text scramble effect
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let iterations = 0;
                    const maxIterations = 20;
                    
                    const interval = setInterval(() => {
                        scrambleText.textContent = originalText
                            .split('')
                            .map((char, index) => {
                                if (index < iterations / 3) {
                                    return originalText[index];
                                }
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join('');
                        
                        iterations++;
                        if (iterations >= maxIterations) {
                            clearInterval(interval);
                            scrambleText.textContent = originalText;
                        }
                    }, 50);
                }
            },
            duration: 0.1
        });
    }

    // EAS Logos Animation
    const easLogos = section.querySelectorAll(".eas-logo");
    if (easLogos.length > 0) {
        gsap.from(easLogos, {
            scrollTrigger: {
                trigger: section.querySelector(".eas-section"),
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            scale: 0,
            stagger: 0.2,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            rotation: 180,
            opacity: 0
        });
    }

    // Final Slide Animations
    const finalSlideH2 = section.querySelector(".final-slide h2");
    if (finalSlideH2) {
        gsap.from(finalSlideH2, {
            scrollTrigger: {
                trigger: section.querySelector(".final-slide"),
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: -100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            scale: 0.5
        });
    }

    const finalSlideP = section.querySelector(".final-slide p");
    if (finalSlideP) {
        gsap.from(finalSlideP, {
            scrollTrigger: {
                trigger: section.querySelector(".final-slide"),
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.3
        });
    }

    // Add smooth scroll behavior to the entire section
    const scrollContainer = section.querySelector('.scroll-container');
    if (scrollContainer) {
        gsap.to(scrollContainer, {
            scrollTrigger: {
                trigger: scrollContainer,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: self => {
                    // Add some parallax effect to background elements
                    const progress = self.progress;
                    gsap.set(scrollContainer, {
                        backgroundPosition: `50% ${progress * 100}%`
                    });
                }
            }
        });
    }

    console.log('Cool Button animations initialized');
}

// Initialize when section becomes active
document.addEventListener('DOMContentLoaded', () => {
    // Wait for navigation to be set up
    setTimeout(() => {
        const navBtn = document.querySelector('[data-section="cool-button"]');
        if (navBtn) {
            navBtn.addEventListener('click', () => {
                setTimeout(initCoolButton, 100);
            });
        }
        
        // Initialize if section is already active
        if (document.getElementById('cool-button')?.classList.contains('active')) {
            initCoolButton();
        }
    }, 500);
});