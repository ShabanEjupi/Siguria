// Dynamic Car Display System
document.addEventListener('DOMContentLoaded', function() {
    const carsContainer = document.getElementById('dynamic-cars');
    if (!carsContainer) return;

    // Load cars from localStorage
    const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
    
    if (savedCars.length > 0) {
        displayDynamicCars(savedCars, carsContainer);
    }
});

function displayDynamicCars(cars, container) {
    const carsHTML = cars.map(car => `
        <div class="car-card" data-brand="${car.brand}" data-year="${car.year}" data-fuel="${car.fuel}" data-price="${car.price}">
            <div class="car-image">
                <img src="./assets/img/car1.jpg" alt="${getBrandName(car.brand)} ${car.model}" onerror="this.src='./assets/img/placeholder-car.jpg'">
            </div>
            <div class="car-details">
                <div class="car-title">
                    <h3>${getBrandName(car.brand)} ${car.model}</h3>
                    <span class="car-price">€${parseInt(car.price).toLocaleString()}</span>
                </div>
                <div class="car-specs">
                    <div class="car-spec">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${car.year}</span>
                    </div>
                    <div class="car-spec">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>${parseInt(car.mileage).toLocaleString()} km</span>
                    </div>
                    <div class="car-spec">
                        <i class="fas fa-gas-pump"></i>
                        <span>${getFuelName(car.fuel)}</span>
                    </div>
                </div>
                <p class="car-description">${car.description || 'Veturë e importuar me cilësi të lartë.'}</p>
                <div class="car-actions">
                    <a href="car-details.html?id=${car.id}" class="btn btn-sm">Detajet</a>
                    <a href="contact.html?car=${car.id}" class="btn btn-sm btn-outline">Pyetni</a>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = carsHTML;
}

function getBrandName(brand) {
    const names = {
        'mercedes': 'Mercedes-Benz',
        'bmw': 'BMW',
        'audi': 'Audi',
        'volkswagen': 'Volkswagen',
        'other': 'Të tjera'
    };
    return names[brand] || brand;
}

function getFuelName(fuel) {
    const names = {
        'petrol': 'Benzinë',
        'diesel': 'Dizel',
        'hybrid': 'Hibrid',
        'electric': 'Elektrik'
    };
    return names[fuel] || fuel;
}
