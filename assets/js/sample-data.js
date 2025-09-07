// Sample data initialization script
// This script will create some sample cars and newsletter data for testing

document.addEventListener('DOMContentLoaded', function() {
    // Check if we already have data
    const existingCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
    const existingSubscribers = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
    
    // Only add sample data if there's no existing data
    if (existingCars.length === 0) {
        const sampleCars = [
            {
                id: '1',
                brand: 'hyundai',
                model: 'Elantra',
                year: 2022,
                price: 18500,
                mileage: 25000,
                fuel: 'petrol',
                transmission: 'automatic',
                color: 'white',
                description: 'Veturë luksoz importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës dhe transportin deri në Prishtinë.',
                images: ['./assets/img/car1.jpg'],
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                brand: 'kia',
                model: 'Sportage',
                year: 2021,
                price: 22000,
                mileage: 35000,
                fuel: 'diesel',
                transmission: 'manual',
                color: 'black',
                description: 'SUV me performancë dhe stil, importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës dhe transportin deri në Prishtinë.',
                images: ['./assets/img/car2.jpg'],
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                brand: 'genesis',
                model: 'G90',
                year: 2023,
                price: 45000,
                mileage: 12000,
                fuel: 'electric',
                transmission: 'automatic',
                color: 'silver',
                description: 'Veturë elektrike inovative dhe ekonomike, importuar direkt nga Koreja. Çmimi përfshin dërgesën deri në Durrës dhe transportin deri në Prishtinë.',
                images: ['./assets/img/car3.jpg'],
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('koreadrive-cars', JSON.stringify(sampleCars));
        console.log('Sample cars added to localStorage');
    }
    
    // Add sample newsletter subscribers if none exist
    if (existingSubscribers.length === 0) {
        const sampleSubscribers = [
            {
                email: 'john.doe@example.com',
                subscribedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                source: 'homepage'
            },
            {
                email: 'jane.smith@example.com',
                subscribedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                source: 'cars page'
            },
            {
                email: 'mike.johnson@example.com',
                subscribedAt: new Date().toISOString(),
                source: 'contact'
            }
        ];
        
        localStorage.setItem('koreadrive-newsletter', JSON.stringify(sampleSubscribers));
        console.log('Sample newsletter subscribers added to localStorage');
    }
});

// Function to clear all data (for testing)
function clearAllData() {
    localStorage.removeItem('koreadrive-cars');
    localStorage.removeItem('koreadrive-newsletter');
    console.log('All data cleared');
    location.reload();
}

// Function to export all data (for backup)
function exportAllData() {
    const data = {
        cars: JSON.parse(localStorage.getItem('koreadrive-cars') || '[]'),
        newsletter: JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]'),
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koreadrive-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Add global functions for development/testing
window.clearAllData = clearAllData;
window.exportAllData = exportAllData;
