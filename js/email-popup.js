// Email popup functionality with visit tracking
(function() {
    'use strict';
    
    const VISIT_COOKIE_NAME = 'site_last_visit';
    const VISIT_COOKIE_DURATION_DAYS = 7; // Don't show popup if visited within 7 days
    
    /**
     * Check if user has visited recently
     * @returns {boolean} True if user visited recently, false otherwise
     */
    function hasVisitedRecently() {
        const lastVisit = localStorage.getItem(VISIT_COOKIE_NAME);
        if (!lastVisit) {
            return false;
        }
        
        const lastVisitDate = new Date(lastVisit);
        const now = new Date();
        const daysSinceVisit = (now - lastVisitDate) / (1000 * 60 * 60 * 24);
        
        return daysSinceVisit < VISIT_COOKIE_DURATION_DAYS;
    }
    
    /**
     * Record the current visit
     */
    function recordVisit() {
        const now = new Date().toISOString();
        localStorage.setItem(VISIT_COOKIE_NAME, now);
    }
    
    /**
     * Show the email popup
     */
    function showPopup() {
        const popup = document.getElementById('email-popup');
        if (popup) {
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    /**
     * Hide the email popup
     */
    function hidePopup() {
        const popup = document.getElementById('email-popup');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    /**
     * Initialize the email popup
     */
    function initEmailPopup() {
        // Check if popup element exists
        const popup = document.getElementById('email-popup');
        if (!popup) {
            return;
        }
        
        // Check if user has visited recently
        if (hasVisitedRecently()) {
            // User visited recently, don't show popup
            return;
        }
        
        // Record this visit
        recordVisit();
        
        // Show popup after a short delay (better UX)
        setTimeout(() => {
            showPopup();
        }, 1000); // 1 second delay
        
        // Close button functionality
        const closeBtn = document.getElementById('email-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hidePopup);
        }
        
        // Close when clicking outside the popup content
        const popupContent = document.getElementById('email-popup-content');
        if (popupContent) {
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    hidePopup();
                }
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popup.style.display === 'flex') {
                hidePopup();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailPopup);
    } else {
        initEmailPopup();
    }
})();

