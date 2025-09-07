// Car Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('car-filter-form');
    const priceRange = document.getElementById('price');
    const priceOutput = document.getElementById('price-output');
    const carCards = document.querySelectorAll('.car-card');

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

        carCards.forEach(card => {
            let show = true;

            // Brand filter
            if (filters.brand && filters.brand !== '') {
                const carBrand = card.getAttribute('data-brand');
                if (carBrand !== filters.brand) {
                    show = false;
                }
            }

            // Year filter
            if (filters.year && filters.year !== '') {
                const carYear = card.getAttribute('data-year');
                if (carYear !== filters.year) {
                    show = false;
                }
            }

            // Fuel filter
            if (filters.fuel && filters.fuel !== '') {
                const carFuel = card.getAttribute('data-fuel');
                if (carFuel !== filters.fuel) {
                    show = false;
                }
            }

            // Price filter
            if (filters.price) {
                const carPrice = parseInt(card.getAttribute('data-price'));
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
