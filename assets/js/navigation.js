document.addEventListener('DOMContentLoaded', function() {
    // Wait for the header content to be loaded
    setTimeout(function() {
        // Get the mobile menu elements
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-nav');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const header = document.getElementById('main-header');
        
        if (mobileMenuToggle && mainNav && mobileOverlay) {
            // Mobile menu toggle
            mobileMenuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });
            
            // Close menu when clicking on overlay
            mobileOverlay.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
            
            // Header scroll effect
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }, 500); // Give the header content time to load
});