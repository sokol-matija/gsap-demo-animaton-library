// 10 More Examples - GSAP ScrollTrigger Animations
// This script runs when the 10-more-examples section is active

function init10MoreExamples() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded for 10 More Examples');
        return;
    }

    console.log('Initializing 10 More Examples animations');

    // Clear any existing ScrollTriggers for this section
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && trigger.vars.trigger && trigger.vars.trigger.closest && trigger.vars.trigger.closest('#10-more-examples')) {
            trigger.kill();
        }
    });

    // Wait for section to be visible
    const section = document.getElementById('10-more-examples');
    if (!section || !section.classList.contains('active')) {
        return;
    }

    // 1. Horizontal Scrolling
    const horizontalPanels = section.querySelectorAll(".horizontal-panel");
    if (horizontalPanels.length > 0) {
        gsap.to(horizontalPanels, {
            xPercent: -100 * (horizontalPanels.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: section.querySelector(".horizontal-container"),
                pin: true,
                scrub: 1,
                snap: 1 / (horizontalPanels.length - 1),
                end: () => "+=" + (horizontalPanels.length * 100) + "vw",
                invalidateOnRefresh: true
            }
        });
    }

    // 2. Image Reveal
    const imageReveal = section.querySelector(".image-container img");
    if (imageReveal) {
        gsap.fromTo(imageReveal, 
            { scale: 1.5, opacity: 0.7 }, 
            {
                scale: 1,
                opacity: 1,
                scrollTrigger: {
                    trigger: section.querySelector("#image-reveal"),
                    scrub: true,
                    start: "top 80%",
                    end: "bottom 20%"
                }
            }
        );
    }

    // 3. SVG Line Drawing (simplified without DrawSVGPlugin)
    const svgPath = section.querySelector("#line-svg path");
    if (svgPath) {
        const pathLength = svgPath.getTotalLength();
        gsap.set(svgPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });
        
        gsap.to(svgPath, {
            strokeDashoffset: 0,
            scrollTrigger: {
                trigger: section.querySelector("#svg-line-drawing"),
                scrub: true,
                start: "top center",
                end: "bottom center"
            }
        });
    }

    // 4. 3D Transforms
    const box3d = section.querySelector(".box-3d");
    if (box3d) {
        gsap.to(box3d, {
            rotationY: 360,
            rotationX: 180,
            scale: 1.2,
            scrollTrigger: {
                trigger: section.querySelector("#3d-transforms"),
                scrub: true,
                start: "top 80%",
                end: "bottom 20%"
            }
        });
    }

    // 5. Color Change
    const colorBox = section.querySelector(".color-box");
    if (colorBox) {
        gsap.to(colorBox, {
            backgroundColor: "#ff6600",
            scale: 1.5,
            borderRadius: "0%",
            scrollTrigger: {
                trigger: section.querySelector("#color-change"),
                scrub: true,
                start: "top center",
                end: "bottom center"
            }
        });
    }

    // 6. Pinning and Scrubbing
    const pinnedElement = section.querySelector(".pinned-element");
    if (pinnedElement) {
        gsap.to(pinnedElement, {
            scale: 0.5,
            borderRadius: "50%",
            rotation: 360,
            backgroundColor: "#e74c3c",
            scrollTrigger: {
                trigger: section.querySelector(".pin-container"),
                pin: true,
                scrub: true,
                start: "top center",
                end: "bottom center"
            }
        });
    }

    // 7. Parallax with Depth
    const layer1 = section.querySelector(".layer-1");
    const layer2 = section.querySelector(".layer-2");
    const layer3 = section.querySelector(".layer-3");
    
    if (layer1 && layer2 && layer3) {
        gsap.to(layer1, { 
            y: -150, 
            scale: 1.1,
            scrollTrigger: { 
                trigger: section.querySelector("#parallax-depth"), 
                scrub: true,
                start: "top bottom",
                end: "bottom top"
            } 
        });
        gsap.to(layer2, { 
            y: -75, 
            scale: 1.05,
            scrollTrigger: { 
                trigger: section.querySelector("#parallax-depth"), 
                scrub: true,
                start: "top bottom",
                end: "bottom top"
            } 
        });
        gsap.to(layer3, { 
            y: 50,
            scrollTrigger: { 
                trigger: section.querySelector("#parallax-depth"), 
                scrub: true,
                start: "top bottom",
                end: "bottom top"
            } 
        });
    }

    // 8. Staggered Grid
    const gridContainer = section.querySelector(".grid-container");
    if (gridContainer) {
        // Clear existing grid items
        gridContainer.innerHTML = '';
        
        // Create grid items
        for (let i = 0; i < 25; i++) {
            let item = document.createElement("div");
            item.classList.add("grid-item");
            item.style.backgroundColor = `hsl(${i * 14}, 70%, 50%)`;
            gridContainer.appendChild(item);
        }
        
        gsap.from(section.querySelectorAll(".grid-item"), {
            scale: 0,
            opacity: 0,
            stagger: {
                amount: 1.5,
                grid: "auto",
                from: "center"
            },
            scrollTrigger: {
                trigger: section.querySelector("#staggered-grid"),
                start: "top 80%",
                end: "bottom 20%",
                scrub: true
            }
        });
    }

    // 9. Advanced Text Animation (simplified without SplitText)
    const advText = section.querySelector(".split-text-adv");
    if (advText) {
        const text = advText.textContent;
        advText.innerHTML = text.split('').map(char => 
            char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`
        ).join('');
        
        const chars = advText.querySelectorAll('span');
        gsap.from(chars, {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.05,
            scrollTrigger: {
                trigger: section.querySelector("#split-text-animation"),
                start: "top center",
                end: "bottom center",
                scrub: true
            }
        });
    }

    // 10. Scroll-based Video Playback
    const video = section.querySelector("#scroll-video");
    if (video) {
        video.pause();
        video.currentTime = 0;
        
        // Load video first
        video.addEventListener('loadedmetadata', () => {
            gsap.to(video, {
                currentTime: video.duration,
                scrollTrigger: {
                    trigger: section.querySelector("#video-playback"),
                    scrub: true,
                    start: "top center",
                    end: "bottom center",
                    onUpdate: self => {
                        if (video.readyState >= 2) {
                            video.currentTime = video.duration * self.progress;
                        }
                    }
                }
            });
        });
        
        // Fallback if video is already loaded
        if (video.readyState >= 2) {
            gsap.to(video, {
                currentTime: video.duration,
                scrollTrigger: {
                    trigger: section.querySelector("#video-playback"),
                    scrub: true,
                    start: "top center",
                    end: "bottom center",
                    onUpdate: self => {
                        video.currentTime = video.duration * self.progress;
                    }
                }
            });
        }
    }

    console.log('10 More Examples animations initialized');
}

// Initialize when section becomes active
document.addEventListener('DOMContentLoaded', () => {
    // Wait for navigation to be set up
    setTimeout(() => {
        const navBtn = document.querySelector('[data-section="10-more-examples"]');
        if (navBtn) {
            navBtn.addEventListener('click', () => {
                setTimeout(init10MoreExamples, 100);
            });
        }
        
        // Initialize if section is already active
        if (document.getElementById('10-more-examples')?.classList.contains('active')) {
            init10MoreExamples();
        }
    }, 500);
});