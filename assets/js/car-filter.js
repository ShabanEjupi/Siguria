// Car Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('car-filter-form');
    const priceRange = document.getElementById('price');
    const priceOutput = document.getElementById('price-output');
    
    // Get all car cards (both static and dynamic) - update this function to refresh
    function getAllCarCards() {
        return document.querySelectorAll('.car-card');
    }

    // Update price display
    if (priceRange && priceOutput) {
        priceRange.addEventListener('input', function() {
            priceOutput.textContent = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0
            }).format(this.value).replace('€', '') + '€';
        });
    }

    // Filter functionality
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });

        filterForm.addEventListener('reset', function() {
            setTimeout(function() {
                showAllCars();
                if (priceOutput) {
                    priceOutput.textContent = '40,000€';
                }
            }, 10);
        });
    }

    function applyFilters() {
        const formData = new FormData(filterForm);
        const filters = {
            brand: formData.get('brand'),
            year: formData.get('year'),
            fuel: formData.get('fuel'),
            price: parseInt(formData.get('price'))
        };

        console.log('Applied filters:', filters); // Debug log
        
        const carCards = getAllCarCards(); // Get fresh list of car cards
        console.log('Total car cards found:', carCards.length); // Debug log

        carCards.forEach(card => {
            let show = true;

            // Brand filter
            if (filters.brand && filters.brand !== '') {
                const carBrand = card.getAttribute('data-brand');
                console.log('Car brand:', carBrand, 'Filter brand:', filters.brand); // Debug log
                if (carBrand !== filters.brand) {
                    show = false;
                }
            }

            // Year filter
            if (filters.year && filters.year !== '') {
                const carYear = card.getAttribute('data-year');
                console.log('Car year:', carYear, 'Filter year:', filters.year); // Debug log
                if (carYear !== filters.year) {
                    show = false;
                }
            }

            // Fuel filter
            if (filters.fuel && filters.fuel !== '') {
                const carFuel = card.getAttribute('data-fuel');
                console.log('Car fuel:', carFuel, 'Filter fuel:', filters.fuel); // Debug log
                if (carFuel !== filters.fuel) {
                    show = false;
                }
            }

            // Price filter
            if (filters.price) {
                const carPrice = parseInt(card.getAttribute('data-price'));
                console.log('Car price:', carPrice, 'Filter price:', filters.price); // Debug log
                if (carPrice > filters.price) {
                    show = false;
                }
            }

            // Show/hide card
            if (show) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function showAllCars() {
        const carCards = getAllCarCards(); // Get fresh list of car cards
        carCards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// Add CSS animation for smooth transitions
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
