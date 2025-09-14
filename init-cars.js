// Initialize car data with only specified vehicles
const initialCars = [
    {
        id: 'bmw-5-series-1',
        brand: 'bmw',
        model: '5 Series (F10)',
        price: '8656',
        year: '2015',
        mileage: '178064',
        fuel: 'diesel',
        transmission: 'automatic',
        description: 'Sedan luksoz BMW, i importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës duke përfshirë transportin në Prishtinë.',
        images: ['./assets/img/car1.jpg'],
        category: 'sedan',
        location: 'Prishtina',
        features: ['Navigation', 'Leather Seats', 'Automatic Climate', 'Sunroof'],
        condition: 'excellent'
    },
    {
        id: 'bmw-528i',
        brand: 'bmw', 
        model: '5 Series (F10) 528i',
        price: '9200',
        year: '2015',
        mileage: '176000',
        fuel: 'petrol',
        transmission: 'automatic',
        description: 'Sedan luksoz me performancë dhe stil. I importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës duke përfshirë transportin në Prishtinë.',
        images: ['./assets/img/car2.jpg'],
        category: 'sedan',
        location: 'Prishtina', 
        features: ['Sport Package', 'Navigation', 'Heated Seats', 'Premium Sound'],
        condition: 'excellent'
    },
    {
        id: 'bmw-i3',
        brand: 'bmw',
        model: 'i3',
        price: '8840',
        year: '2015', 
        mileage: '134717',
        fuel: 'electric',
        transmission: 'automatic',
        description: 'Veturë elektrike inovative dhe ekonomike. E importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës duke përfshirë transportin në Prishtinë.',
        images: ['./assets/img/car3.jpg'],
        category: 'electric',
        location: 'Prishtina',
        features: ['Electric Motor', 'Fast Charging', 'Eco Mode', 'Digital Dashboard'],
        condition: 'excellent'
    },
    {
        id: 'mercedes-c-class',
        brand: 'mercedes',
        model: 'C-Class W205 C220d Coupe',
        price: '15880',
        year: '2017',
        mileage: '72469', 
        fuel: 'diesel',
        transmission: 'automatic',
        description: 'Coupe luksoz, transmision automatik, ngjyrë gri. Çmimi përfshin dërgesën deri në Durrës duke përfshirë transportin RoRo. Për Prishtinë +€350. VIN: WDDWJ0EB9HF424387',
        images: ['./assets/img/car4.jpg'],
        category: 'coupe',
        location: 'Prishtina',
        features: ['AMG Package', 'Navigation', 'Leather Interior', 'Panoramic Roof'],
        condition: 'excellent',
        vin: 'WDDWJ0EB9HF424387'
    },
    {
        id: 'bmw-3-series',
        brand: 'bmw',
        model: '3 Series (F30) 320d', 
        price: '7440',
        year: '2015',
        mileage: '147104',
        fuel: 'diesel',
        transmission: 'automatic',
        description: 'Sedan sportiv me ekonomi karburanti. I importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës duke përfshirë transportin RoRo. Për Prishtinë +€350.',
        images: ['./assets/img/car5.jpg'],
        category: 'sedan',
        location: 'Prishtina',
        features: ['Sport Mode', 'Efficient Dynamics', 'BMW ConnectedDrive', 'Run-flat Tires'],
        condition: 'very-good'
    },
    {
        id: 'bmw-3-series-gt',
        brand: 'bmw',
        model: '3 Series GT (F34) GT 320d',
        price: '8400', 
        year: '2015',
        mileage: '170170',
        fuel: 'diesel',
        transmission: 'automatic',
        description: 'Grand Tourer elegant me hapësirë të madhe. I importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës duke përfshirë transportin RoRo. Për Prishtinë +€350.',
        images: ['./assets/img/car6.jpg'],
        category: 'gt',
        location: 'Prishtina',
        features: ['Large Boot Space', 'Comfort Access', 'Dual-zone Climate', 'Electric Seats'],
        condition: 'very-good'
    }
];

// Function to initialize the car data
function initializeCarData() {
    localStorage.setItem('koreadrive-cars', JSON.stringify(initialCars));
    console.log('Car data initialized with', initialCars.length, 'vehicles');
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if no cars exist or if forced
    const existingCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
    if (existingCars.length === 0) {
        initializeCarData();
        console.log('Cars initialized automatically');
    }
});

// Make function available globally for manual initialization
window.initializeCarData = initializeCarData;
window.initialCarsData = initialCars;
