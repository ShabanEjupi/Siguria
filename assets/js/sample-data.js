// Data management script for KoreaDrive.ks
// This script handles data initialization and management functions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize empty data structures if they don't exist
    const existingCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
    const existingSubscribers = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
    
    // Initialize empty arrays if no data exists
    if (!localStorage.getItem('koreadrive-cars')) {
        localStorage.setItem('koreadrive-cars', JSON.stringify([]));
        console.log('Cars storage initialized');
    }
    
    if (!localStorage.getItem('koreadrive-newsletter')) {
        localStorage.setItem('koreadrive-newsletter', JSON.stringify([]));
        console.log('Newsletter storage initialized');
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
