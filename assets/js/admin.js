// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentEditingId = null;
        this.carImages = [];
        this.initializeEventListeners();
        this.loadInitialData();
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.switchTab(tabName, e.target);
            });
        });

        // Image upload handling
        this.setupImageUpload();

        // Form submission
        const carForm = document.getElementById('car-form');
        if (carForm) {
            carForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Newsletter export button
        const exportBtn = document.querySelector('.btn-admin[onclick="exportNewsletterCSV()"]');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportNewsletterCSV());
        }
    }

    switchTab(tabName, buttonElement) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
            buttonElement.classList.add('active');

            // Load content based on tab
            switch (tabName) {
                case 'manage-cars':
                    this.loadCarsList();
                    break;
                case 'statistics':
                    this.loadStatistics();
                    break;
                case 'newsletter':
                    this.loadNewsletterData();
                    break;
            }
        }
    }

    setupImageUpload() {
        const imageUpload = document.getElementById('image-upload');
        const fileInput = document.getElementById('car-images');
        const preview = document.getElementById('image-preview');

        if (!imageUpload || !fileInput) return;

        imageUpload.addEventListener('click', () => fileInput.click());

        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.classList.add('dragover');
        });

        imageUpload.addEventListener('dragleave', () => {
            imageUpload.classList.remove('dragover');
        });

        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.classList.remove('dragover');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.carImages.push({
                        file: file,
                        dataUrl: e.target.result
                    });
                    this.updateImagePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updateImagePreview() {
        const preview = document.getElementById('image-preview');
        if (!preview) return;

        preview.innerHTML = this.carImages.map((img, index) => `
            <div class="preview-item">
                <img src="${img.dataUrl}" alt="Preview">
                <button type="button" class="remove-image" onclick="adminPanel.removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    removeImage(index) {
        this.carImages.splice(index, 1);
        this.updateImagePreview();
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const carData = {
            id: this.currentEditingId || Date.now().toString(),
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            price: parseInt(formData.get('price')),
            mileage: parseInt(formData.get('mileage')),
            fuel: formData.get('fuel'),
            transmission: formData.get('transmission'),
            color: formData.get('color'),
            description: formData.get('description'),
            images: this.carImages.map(img => img.dataUrl),
            createdAt: new Date().toISOString()
        };

        // Get existing cars
        const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
        
        if (this.currentEditingId) {
            // Update existing car
            const index = savedCars.findIndex(car => car.id === this.currentEditingId);
            if (index !== -1) {
                savedCars[index] = carData;
            }
        } else {
            // Add new car
            savedCars.push(carData);
        }

        // Save to localStorage
        localStorage.setItem('koreadrive-cars', JSON.stringify(savedCars));
        
        this.showMessage(this.currentEditingId ? 'Vetura u përditësua me sukses!' : 'Vetura u shtua me sukses!', 'success');
        
        // Reset form
        e.target.reset();
        this.carImages = [];
        this.updateImagePreview();
        this.currentEditingId = null;
        
        // Refresh the cars list if on that tab
        if (document.getElementById('manage-cars')?.classList.contains('active')) {
            this.loadCarsList();
        }
        this.loadStatistics();
    }

    showMessage(text, type) {
        const container = document.getElementById('message-container');
        if (container) {
            container.innerHTML = `<div class="${type}-message">${text}</div>`;
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    }

    loadCarsList() {
        const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
        const container = document.getElementById('cars-list');
        
        if (!container) return;

        if (savedCars.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Nuk ka vetura të shtuar akoma.</p>';
            return;
        }

        container.innerHTML = savedCars.map(car => `
            <div class="car-item">
                <img src="${car.images && car.images.length > 0 ? car.images[0] : './assets/img/car1.jpg'}" alt="${car.brand} ${car.model}">
                <div class="car-info">
                    <h3>${this.getBrandName(car.brand)} ${car.model}</h3>
                    <p><strong>Viti:</strong> ${car.year} | <strong>Çmimi:</strong> €${car.price.toLocaleString()} | <strong>Kilometrat:</strong> ${car.mileage.toLocaleString()} km</p>
                    <p style="color: #666;">${car.description.substring(0, 100)}...</p>
                </div>
                <div class="car-actions">
                    <button class="btn-edit" onclick="adminPanel.editCar('${car.id}')">
                        <i class="fas fa-edit"></i> Edito
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteCar('${car.id}')">
                        <i class="fas fa-trash"></i> Fshi
                    </button>
                </div>
            </div>
        `).join('');
    }

    editCar(id) {
        const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
        const car = savedCars.find(c => c.id === id);
        
        if (car) {
            this.currentEditingId = id;
            
            // Fill form with car data
            document.getElementById('brand').value = car.brand;
            document.getElementById('model').value = car.model;
            document.getElementById('year').value = car.year;
            document.getElementById('price').value = car.price;
            document.getElementById('mileage').value = car.mileage;
            document.getElementById('fuel').value = car.fuel;
            document.getElementById('transmission').value = car.transmission || 'automatic';
            document.getElementById('color').value = car.color || '';
            document.getElementById('description').value = car.description;
            
            // Load images
            this.carImages = car.images ? car.images.map(url => ({dataUrl: url})) : [];
            this.updateImagePreview();
            
            // Switch to add car tab
            this.switchTab('add-car', document.querySelector('.tab-button[onclick*="add-car"]'));
        }
    }

    deleteCar(id) {
        if (confirm('A jeni të sigurt që dëshironi të fshini këtë veturë?')) {
            const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            const filteredCars = savedCars.filter(car => car.id !== id);
            localStorage.setItem('koreadrive-cars', JSON.stringify(filteredCars));
            this.loadCarsList();
            this.loadStatistics();
            this.showMessage('Vetura u fshi me sukses!', 'success');
        }
    }

    loadStatistics() {
        const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
        
        const totalCarsElement = document.getElementById('total-cars');
        if (totalCarsElement) {
            totalCarsElement.textContent = savedCars.length;
        }
        
        if (savedCars.length > 0) {
            const avgPrice = Math.round(savedCars.reduce((sum, car) => sum + car.price, 0) / savedCars.length);
            const avgPriceElement = document.getElementById('avg-price');
            if (avgPriceElement) {
                avgPriceElement.textContent = `€${avgPrice.toLocaleString()}`;
            }

            const latestCarElement = document.getElementById('latest-car');
            if (latestCarElement) {
                const latestCar = savedCars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                latestCarElement.textContent = `${this.getBrandName(latestCar.brand)} ${latestCar.model}`;
            }
        }

        // Brand distribution
        const brandCount = {};
        savedCars.forEach(car => {
            brandCount[car.brand] = (brandCount[car.brand] || 0) + 1;
        });

        const chartContainer = document.getElementById('brand-chart');
        if (chartContainer) {
            chartContainer.innerHTML = Object.entries(brandCount).map(([brand, count]) => `
                <div style="margin: 5px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="width: 100px; font-weight: 500;">${this.getBrandName(brand)}:</span>
                    <div style="background: var(--primary); height: 20px; width: ${(count / savedCars.length) * 200}px; border-radius: 10px;"></div>
                    <span>${count}</span>
                </div>
            `).join('');
        }
    }

    loadNewsletterData() {
        const subscribers = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
        const container = document.getElementById('newsletter-list');
        
        if (!container) return;

        const subscribersCountElement = document.getElementById('subscribers-count');
        if (subscribersCountElement) {
            subscribersCountElement.textContent = subscribers.length;
        }

        if (subscribers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Nuk ka abonentë akoma.</p>';
            return;
        }

        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Email</th>
                        <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Data e Abonimit</th>
                        <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Burimi</th>
                        <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dee2e6;">Veprime</th>
                    </tr>
                </thead>
                <tbody>
                    ${subscribers.map((sub, index) => `
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 15px;">${sub.email}</td>
                            <td style="padding: 15px;">${new Date(sub.subscribedAt).toLocaleDateString('sq-AL')}</td>
                            <td style="padding: 15px;">${sub.source || 'N/A'}</td>
                            <td style="padding: 15px; text-align: center;">
                                <button onclick="adminPanel.removeSubscriber(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    removeSubscriber(index) {
        if (confirm('A jeni të sigurt që dëshironi të hiqni këtë abonent?')) {
            const subscribers = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
            subscribers.splice(index, 1);
            localStorage.setItem('koreadrive-newsletter', JSON.stringify(subscribers));
            this.loadNewsletterData();
            this.showMessage('Abonenti u hoq me sukses!', 'success');
        }
    }

    exportNewsletterCSV() {
        const subscribers = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
        
        if (subscribers.length === 0) {
            alert('Nuk ka abonentë për të eksportuar.');
            return;
        }
        
        const csvContent = [
            ['Email', 'Data e Abonimit', 'Burimi'],
            ...subscribers.map(sub => [
                sub.email,
                new Date(sub.subscribedAt).toLocaleDateString('sq-AL'),
                sub.source || 'N/A'
            ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `koreadrive-newsletter-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    getBrandName(brand) {
        const names = {
            'mercedes': 'Mercedes-Benz',
            'bmw': 'BMW',
            'audi': 'Audi',
            'volkswagen': 'Volkswagen',
            'hyundai': 'Hyundai',
            'kia': 'KIA',
            'genesis': 'Genesis',
            'other': 'Të tjera'
        };
        return names[brand] || brand;
    }

    loadInitialData() {
        // Load initial data when admin panel loads
        this.loadCarsList();
        this.loadStatistics();
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});

// Global functions for backward compatibility
function switchTab(tabName) {
    const button = document.querySelector(`[onclick*="${tabName}"]`);
    if (button && adminPanel) {
        adminPanel.switchTab(tabName, button);
    }
}

function removeImage(index) {
    if (adminPanel) {
        adminPanel.removeImage(index);
    }
}

function editCar(id) {
    if (adminPanel) {
        adminPanel.editCar(id);
    }
}

function deleteCar(id) {
    if (adminPanel) {
        adminPanel.deleteCar(id);
    }
}

function removeSubscriber(index) {
    if (adminPanel) {
        adminPanel.removeSubscriber(index);
    }
}

function exportNewsletterCSV() {
    if (adminPanel) {
        adminPanel.exportNewsletterCSV();
    }
}
