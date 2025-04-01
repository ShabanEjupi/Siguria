// Main application script for KoreaDrive.ks
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the navigation highlighting
    highlightCurrentPage();
    
    // User authentication management
    setupAuthenticationFeatures();
    
    // Initialize any language preferences
    setupLanguagePreferences();
    
    // Setup car filtering functionality if on the cars page
    if (window.location.pathname.includes('cars.html')) {
        initializeCarFilters();
    }
});

/**
 * Highlights the current page in the navigation menu
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage.includes(href) && href !== 'index.html') {
            link.style.backgroundColor = '#f3f8fe';
            link.style.fontWeight = 'bold';
        } else if (currentPage.endsWith('/') && href === 'index.html') {
            link.style.backgroundColor = '#f3f8fe';
            link.style.fontWeight = 'bold';
        }
    });
}

/**
 * Sets up authentication-related features
 */
function setupAuthenticationFeatures() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const dashboardLink = document.getElementById('dashboard-link');
    
    if (currentUser) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'block';
        
        // Set up logout functionality
        if (logoutLink) {
            logoutLink.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
    }
}

/**
 * Sets up language preferences
 */
function setupLanguagePreferences() {
    const languageSelector = document.getElementById('language-selector');
    if (!languageSelector) return;
    
    // If user has previously selected a language, use that
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'sq';
    
    // Set the selected option to match saved language
    if (languageSelector.nodeName === 'SELECT') {
        for (let i = 0; i < languageSelector.options.length; i++) {
            if (languageSelector.options[i].value === savedLanguage) {
                languageSelector.selectedIndex = i;
                break;
            }
        }
        
        // Add event listener to save selection
        languageSelector.addEventListener('change', function() {
            localStorage.setItem('preferredLanguage', this.value);
            window.location.reload();
        });
    }
}

/**
 * Initialize car filtering functionality
 */
function initializeCarFilters() {
    const filterForm = document.getElementById('car-filter-form');
    if (!filterForm) return;
    
    // Populate filter options (brands, years, etc)
    populateFilterOptions();
    
    // Set up event handlers for filtering
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        filterCars();
    });
    
    // Reset filters button
    const resetButton = document.querySelector('#car-filter-form .btn-outline');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            filterForm.reset();
            fetchAllCars();
        });
    }
}

/**
 * Populate filter dropdown options
 */
function populateFilterOptions() {
    // Example: Populate brand filter
    const brandSelect = document.getElementById('brand');
    if (!brandSelect) return;
    
    const brands = ['Të gjitha', 'Hyundai', 'Kia', 'Genesis', 'SsangYong'];
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand === 'Të gjitha' ? '' : brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
    
    // Example: Populate year filter
    const yearSelect = document.getElementById('year');
    if (!yearSelect) return;
    
    const currentYear = new Date().getFullYear();
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Të gjitha';
    yearSelect.appendChild(option);
    
    for (let year = currentYear; year >= currentYear - 15; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

/**
 * Filter cars based on selected criteria
 */
function filterCars() {
    // This would typically be an API call
    console.log('Filtering cars...');
    // Implementation would depend on your backend
}

/**
 * Fetch all cars without filters
 */
function fetchAllCars() {
    // This would typically be an API call
    console.log('Fetching all cars...');
    // Implementation would depend on your backend
}