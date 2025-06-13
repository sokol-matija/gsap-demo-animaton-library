// Modern Notification System
// A reusable notification system built with GSAP

class GsapNotification {
    constructor() {
        // Create container if it doesn't exist
        this.createNotificationContainer();
        
        // Store references to DOM elements
        this.container = document.getElementById('notificationContainer');
        this.notification = this.container.querySelector('.notification');
        this.progressBar = this.notification.querySelector('.notification-progress-bar');
    }
    
    createNotificationContainer() {
        // Check if container already exists
        if (document.getElementById('notificationContainer')) {
            return;
        }
        
        // Create container and add to body
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        
        container.innerHTML = `
            <div class="notification">
                <div class="notification-content">
                    <div class="notification-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="notification-text">
                        <h3>Success!</h3>
                        <p>Your action has been completed successfully.</p>
                    </div>
                </div>
                <div class="notification-progress">
                    <div class="notification-progress-bar"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
    }
    
    /**
     * Show a notification
     * @param {string} type - Type of notification: 'success', 'error', or 'info'
     * @param {string} title - Title of the notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in seconds before notification disappears
     * @returns {gsap.core.Timeline} - The GSAP timeline for the animation
     */
    show(type = 'success', title = 'Success!', message = 'Your action has been completed successfully.', duration = 4) {
        // Reset notification classes and add the type class if needed
        this.notification.className = 'notification';
        if (type !== 'success') {
            this.notification.classList.add(type);
        }
        
        // Update content
        const titleElement = this.notification.querySelector('h3');
        const messageElement = this.notification.querySelector('p');
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Update icon based on type
        const iconElement = this.notification.querySelector('.notification-icon svg');
        if (type === 'success') {
            iconElement.innerHTML = `
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
            `;
        } else if (type === 'error') {
            iconElement.innerHTML = `
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            `;
        } else if (type === 'info') {
            iconElement.innerHTML = `
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
            `;
        }
        
        // Create a timeline for the notification animation
        const tl = gsap.timeline();
        
        // First, make the container visible
        tl.set(this.container, { 
            visibility: 'visible',
            opacity: 1
        });
        
        // Animate the notification sliding in from the bottom right with improved animation
        tl.fromTo(this.notification, {
            y: 20,
            x: 40,
            opacity: 0,
            scale: 0.95,
            rotation: 0.5,
            transformOrigin: 'right bottom'
        }, {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        // Add a subtle bounce effect to the icon
        tl.fromTo(this.notification.querySelector('.notification-icon'), {
            scale: 0.5,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(2.5)'
        }, '-=0.4');
        
        // Animate the progress bar
        tl.fromTo(this.progressBar, {
            scaleX: 0
        }, {
            scaleX: 1,
            duration: duration,
            ease: 'none'
        }, '<'); // Start at the same time as the previous animation
        
        // After the duration, slide out the notification with improved exit animation
        tl.to(this.notification, {
            x: 100,
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            delay: duration, // Wait for the progress bar to complete
            ease: 'power3.inOut',
            onComplete: () => {
                // Hide the container when animation is complete
                gsap.set(this.container, { 
                    visibility: 'hidden',
                    opacity: 0
                });
            }
        });
        
        return tl;
    }
    
    /**
     * Show a success notification
     */
    success(title = 'Success!', message = 'Your action has been completed successfully.', duration = 4) {
        return this.show('success', title, message, duration);
    }
    
    /**
     * Show an error notification
     */
    error(title = 'Error!', message = 'Something went wrong. Please try again.', duration = 4) {
        return this.show('error', title, message, duration);
    }
    
    /**
     * Show an info notification
     */
    info(title = 'Information', message = 'Here is some important information for you.', duration = 4) {
        return this.show('info', title, message, duration);
    }
}

// Create a global instance
const notificationSystem = new GsapNotification();

// Export the notification system
export default notificationSystem;
