// External Notification Libraries Implementation
// This file contains implementations for Toastify, SweetAlert2, and Notiflix

// ===== Toastify Notifications =====
class ToastifyNotification {
    constructor() {
        // Keep track of active notifications for stacking
        this.activeNotifications = [];
        this.notificationGap = 10; // Gap between stacked notifications
    }

    /**
     * Show a notification using custom GSAP animations with a dark mode style and a colored left border
     * @param {string} type - The type of notification: 'success', 'error', or 'info'
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds
     */
    show(type = 'success', message = 'Your action has been completed successfully.', duration = 4000) {
        // Set colors based on type
        let color;
        switch (type) {
            case 'success':
                color = '#4CAF50';
                break;
            case 'error':
                color = '#F44336';
                break;
            case 'info':
                color = '#2196F3';
                break;
            default:
                color = '#4CAF50';
        }

        // Create a container for our custom notification
        const notificationContainer = document.createElement('div');
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        notificationContainer.style.opacity = '0';
        notificationContainer.style.transform = 'translateY(0)';
        document.body.appendChild(notificationContainer);

        // Create the notification element
        const notification = document.createElement('div');
        notification.style.backgroundColor = '#222';
        notification.style.color = '#fff';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
        notification.style.padding = '16px 20px';
        notification.style.borderLeft = `6px solid ${color}`;
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.minWidth = '320px';
        notification.style.position = 'relative';
        notification.style.overflow = 'hidden';
        notification.style.marginBottom = '0px';
        notificationContainer.appendChild(notification);

        // Create the icon container
        const iconContainer = document.createElement('div');
        iconContainer.style.position = 'relative';
        iconContainer.style.width = '36px';
        iconContainer.style.height = '36px';
        iconContainer.style.marginRight = '15px';
        iconContainer.style.flexShrink = '0';
        notification.appendChild(iconContainer);

        // Create SVG icon
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('viewBox', '0 0 24 24');
        iconSvg.setAttribute('width', '24');
        iconSvg.setAttribute('height', '24');
        iconSvg.style.position = 'absolute';
        iconSvg.style.top = '6px';
        iconSvg.style.left = '6px';
        iconSvg.style.zIndex = '2';
        iconContainer.appendChild(iconSvg);

        // Create the path for the icon
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconPath.setAttribute('fill', color);

        // Set the path based on notification type
        if (type === 'success') {
            iconPath.setAttribute('d', 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z');
        } else if (type === 'error') {
            iconPath.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        } else {
            iconPath.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z');
        }
        iconSvg.appendChild(iconPath);

        // Create the circular progress indicator
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        circle.setAttribute('width', '36');
        circle.setAttribute('height', '36');
        circle.setAttribute('viewBox', '0 0 36 36');
        circle.style.position = 'absolute';
        circle.style.top = '0';
        circle.style.left = '0';
        iconContainer.appendChild(circle);

        // Create background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', '18');
        bgCircle.setAttribute('cy', '18');
        bgCircle.setAttribute('r', '15');
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke', `${color}30`);
        bgCircle.setAttribute('stroke-width', '3');
        circle.appendChild(bgCircle);

        // Create progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', '18');
        progressCircle.setAttribute('cy', '18');
        progressCircle.setAttribute('r', '15');
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke', color);
        progressCircle.setAttribute('stroke-width', '3');
        progressCircle.setAttribute('stroke-dasharray', 2 * Math.PI * 15);
        progressCircle.setAttribute('stroke-dashoffset', 2 * Math.PI * 15);
        progressCircle.setAttribute('transform', 'rotate(-90 18 18)');
        circle.appendChild(progressCircle);

        // Create the message text
        const textDiv = document.createElement('div');
        textDiv.textContent = message;
        textDiv.style.fontSize = '14px';
        textDiv.style.fontWeight = '500';
        notification.appendChild(textDiv);

        // Create a progress bar at the bottom
        const progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '4px';
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = color;
        progressBar.style.transformOrigin = 'left';
        progressBar.style.transform = 'scaleX(0)';
        notification.appendChild(progressBar);

        // Add a close button
        const closeButton = document.createElement('div');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '8px';
        closeButton.style.right = '12px';
        closeButton.style.fontSize = '18px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.opacity = '0.7';
        closeButton.style.color = '#fff';
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.opacity = '1';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.opacity = '0.7';
        });
        notification.appendChild(closeButton);

        // Use GSAP for animations
        const durationInSeconds = duration / 1000;

        // Add this notification to our active notifications array
        this.activeNotifications.push({
            container: notificationContainer,
            height: 0, // Will be set after rendering
            timeline: null // Will be set after creating the timeline
        });

        // Position this notification based on existing notifications
        this.positionNotifications();

        // Create a timeline for the notification
        const tl = gsap.timeline({
            onComplete: () => {
                // Remove from active notifications
                const index = this.activeNotifications.findIndex(n => n.container === notificationContainer);
                if (index !== -1) {
                    this.activeNotifications.splice(index, 1);
                }

                // Remove the notification container from DOM
                if (document.body.contains(notificationContainer)) {
                    document.body.removeChild(notificationContainer);
                }

                // Reposition remaining notifications
                this.positionNotifications();
            }
        });

        // Store the timeline reference
        const notificationObj = this.activeNotifications.find(n => n.container === notificationContainer);
        if (notificationObj) {
            notificationObj.timeline = tl;
        }

        // Animate the notification in
        tl.fromTo(notificationContainer, {
            opacity: 0,
            x: 80,
            scale: 0.9
        }, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onComplete: () => {
                // Now that the notification is visible, get its height
                if (notificationObj) {
                    notificationObj.height = notificationContainer.offsetHeight;
                    // Reposition notifications with the correct height
                    this.positionNotifications();
                }
            }
        });

        // Animate the progress circle with a bounce effect at the end
        tl.to(progressCircle, {
            strokeDashoffset: 0,
            duration: durationInSeconds,
            ease: 'linear'
        }, '<');

        // Animate the progress bar
        tl.to(progressBar, {
            scaleX: 1,
            duration: durationInSeconds,
            ease: 'linear'
        }, '<');

        // Animate the notification out
        tl.to(notificationContainer, {
            opacity: 0,
            x: 100,
            scale: 0.9,
            duration: 0.4,
            ease: 'power2.in'
        });

        // Add click handler for the close button
        closeButton.addEventListener('click', () => {
            // Skip to the end of the timeline to close immediately
            tl.progress(1);
        });

        // Return the timeline in case we want to control it later
        return tl;
    }

    /**
     * Position all active notifications to stack them properly
     */
    positionNotifications() {
        let currentOffset = 0;

        // Position notifications from bottom to top
        [...this.activeNotifications].reverse().forEach(notification => {
            gsap.to(notification.container, {
                y: -currentOffset,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Update offset for next notification
            // Use the actual height if available, otherwise use an estimate
            const height = notification.height || 80;
            currentOffset += height + this.notificationGap;
        });
    }

    /**
     * Show a success notification
     */
    success(message = 'Your action has been completed successfully.', duration = 4000) {
        this.show('success', message, duration);
    }

    /**
     * Show an error notification
     */
    error(message = 'Something went wrong. Please try again.', duration = 4000) {
        this.show('error', message, duration);
    }

    /**
     * Show an info notification
     */
    info(message = 'Here is some important information for you.', duration = 4000) {
        this.show('info', message, duration);
    }
}

// Create a singleton instance of ToastifyNotification
const toastify = new ToastifyNotification();

// ===== SweetAlert2 Notifications =====
class SweetAlert2Notifications {
    /**
     * Show a SweetAlert2 notification
     * @param {string} type - Type of notification: 'success', 'error', or 'info'
     * @param {string} title - Title of the notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    show(type = 'success', title = 'Success!', message = 'Your action has been completed successfully.', duration = 4000) {
        // Convert type to SweetAlert2 icon
        const icon = type === 'info' ? 'info' : type;
        
        // Set border color based on type
        let borderLeftColor;
        switch (type) {
            case 'success': borderLeftColor = '#4CAF50'; break;
            case 'error': borderLeftColor = '#F44336'; break;
            case 'info': borderLeftColor = '#2196F3'; break;
            default: borderLeftColor = '#4CAF50';
        }
        
        // Add custom CSS for dark mode styling
        const styleId = 'sweetalert2-custom-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .swal2-popup.swal2-toast.dark-mode {
                    background-color: #222 !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
                    border-left: 6px solid ${borderLeftColor} !important;
                    padding: 12px 20px !important;
                    border-radius: 8px !important;
                }
                .dark-mode .swal2-title {
                    color: #fff !important;
                    font-size: 1rem !important;
                    font-weight: 500 !important;
                }
                .dark-mode .swal2-html-container {
                    color: rgba(255, 255, 255, 0.7) !important;
                    font-size: 0.9rem !important;
                }
                .dark-mode .swal2-timer-progress-bar {
                    background: ${borderLeftColor} !important;
                    height: 4px !important;
                }
                .dark-mode .swal2-icon {
                    border-color: ${borderLeftColor} !important;
                    color: ${borderLeftColor} !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create and show the alert with improved animation
        const toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: duration,
            timerProgressBar: true,
            showClass: {
                popup: 'animate__animated animate__fadeInRight animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutRight animate__faster'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        
        toast.fire({
            icon: icon,
            title: title,
            text: message,
            customClass: {
                popup: `sweetalert-${type} dark-mode`,
                title: 'sweetalert-title',
                content: 'sweetalert-content',
                icon: `sweetalert-icon-${type}`
            }
        });
    }
    
    /**
     * Show a success notification
     */
    success(title = 'Success!', message = 'Your action has been completed successfully.', duration = 4000) {
        this.show('success', title, message, duration);
    }
    
    /**
     * Show an error notification
     */
    error(title = 'Error!', message = 'Something went wrong. Please try again.', duration = 4000) {
        this.show('error', title, message, duration);
    }
    
    /**
     * Show an info notification
     */
    info(title = 'Information', message = 'Here is some important information for you.', duration = 4000) {
        this.show('info', title, message, duration);
    }
}

// ===== Notiflix Notifications =====
class NotiflixNotifications {
    constructor() {
        // Configure Notiflix with dark mode styling
        Notiflix.Notify.init({
            width: '320px',
            position: 'right-bottom',
            distance: '20px',
            opacity: 1,
            borderRadius: '8px',
            rtl: false,
            timeout: 4000,
            messageMaxLength: 110,
            backOverlay: false,
            backOverlayColor: 'rgba(0,0,0,0.5)',
            plainText: false, // Allow HTML
            showOnlyTheLastOne: false,
            clickToClose: true,
            pauseOnHover: true,
            zindex: 4001,
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            cssAnimation: true,
            cssAnimationDuration: 600,
            cssAnimationStyle: 'from-right', // Enhanced animation
            closeButton: false,
            useIcon: true,
            useFontAwesome: false,
            fontAwesomeIconStyle: 'basic',
            fontAwesomeIconSize: '24px',
            // Custom styling for dark mode
            success: {
                background: '#222',
                textColor: '#fff',
                childClassName: 'notiflix-notify-success',
                notiflixIconColor: '#4CAF50',
                fontAwesomeClassName: 'fas fa-check-circle',
                fontAwesomeIconColor: '#4CAF50',
                backOverlayColor: 'rgba(0,0,0,0.5)',
            },
            failure: {
                background: '#222',
                textColor: '#fff',
                childClassName: 'notiflix-notify-failure',
                notiflixIconColor: '#F44336',
                fontAwesomeClassName: 'fas fa-times-circle',
                fontAwesomeIconColor: '#F44336',
                backOverlayColor: 'rgba(0,0,0,0.5)',
            },
            warning: {
                background: '#222',
                textColor: '#fff',
                childClassName: 'notiflix-notify-warning',
                notiflixIconColor: '#FFC107',
                fontAwesomeClassName: 'fas fa-exclamation-circle',
                fontAwesomeIconColor: '#FFC107',
                backOverlayColor: 'rgba(0,0,0,0.5)',
            },
            info: {
                background: '#222',
                textColor: '#fff',
                childClassName: 'notiflix-notify-info',
                notiflixIconColor: '#2196F3',
                fontAwesomeClassName: 'fas fa-info-circle',
                fontAwesomeIconColor: '#2196F3',
                backOverlayColor: 'rgba(0,0,0,0.5)',
            },
        });
        
        // Add custom CSS for left border
        const styleId = 'notiflix-custom-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .notiflix-notify {
                    border-left: 6px solid transparent !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
                }
                .notiflix-notify-success {
                    border-left-color: #4CAF50 !important;
                }
                .notiflix-notify-failure {
                    border-left-color: #F44336 !important;
                }
                .notiflix-notify-warning {
                    border-left-color: #FFC107 !important;
                }
                .notiflix-notify-info {
                    border-left-color: #2196F3 !important;
                }
                .notiflix-notify-content {
                    display: flex !important;
                    align-items: center !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Show a Notiflix notification
     * @param {string} type - Type of notification: 'success', 'error', 'info', or 'warning'
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    show(type = 'success', message = 'Your action has been completed successfully.', duration = 4000) {
        // Set the timeout
        Notiflix.Notify.init({ timeout: duration });
        
        // Show the notification based on type
        switch (type) {
            case 'success':
                Notiflix.Notify.success(message);
                break;
            case 'error':
                Notiflix.Notify.failure(message);
                break;
            case 'info':
                Notiflix.Notify.info(message);
                break;
            case 'warning':
                Notiflix.Notify.warning(message);
                break;
            default:
                Notiflix.Notify.success(message);
        }
    }
    
    /**
     * Show a success notification
     */
    success(message = 'Your action has been completed successfully.', duration = 4000) {
        this.show('success', message, duration);
    }
    
    /**
     * Show an error notification
     */
    error(message = 'Something went wrong. Please try again.', duration = 4000) {
        this.show('error', message, duration);
    }
    
    /**
     * Show an info notification
     */
    info(message = 'Here is some important information for you.', duration = 4000) {
        this.show('info', message, duration);
    }
}

// Create instances of the notification systems
const sweetAlert2Notifications = new SweetAlert2Notifications();
const notiflixNotifications = new NotiflixNotifications();

// Export the notification systems
export { toastify, sweetAlert2Notifications, notiflixNotifications };
