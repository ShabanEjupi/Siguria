// Admin Dashboard Management System for KoreaDrive.ks
// This script handles all admin dashboard functionality

class AdminDashboard {
    constructor() {
        this.currentTab = 'dashboard';
        this.charts = {};
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.loadDashboardData();
                this.initializeCharts();
            });
        } else {
            this.setupEventListeners();
            this.loadDashboardData();
            this.initializeCharts();
        }
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('adminSidebar');
        const mainContent = document.getElementById('adminMain');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            });
        }

        // Tab navigation
        const navLinks = document.querySelectorAll('.nav-link[data-tab]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Add car form
        const addCarForm = document.getElementById('addCarForm');
        if (addCarForm) {
            addCarForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCar(e);
            });
        }

        // Window resize handler for charts
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    }

    switchTab(tabId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        // Update page title
        const pageTitle = document.querySelector('.page-title');
        const tabTitles = {
            dashboard: 'Dashboard',
            cars: 'Menaxhimi i Veturave',
            users: 'Përdoruesit',
            analytics: 'Analitika',
            settings: 'Cilësimet'
        };
        if (pageTitle) {
            pageTitle.textContent = tabTitles[tabId] || 'Dashboard';
        }

        this.currentTab = tabId;

        // Load tab-specific data
        this.loadTabData(tabId);
    }

    loadDashboardData() {
        // Load basic statistics
        this.updateStats();
        this.loadRecentActivity();
    }

    updateStats() {
        try {
            // Get data from localStorage
            const cars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            const users = JSON.parse(localStorage.getItem('koreadrive-users') || '[]');
            const wishlist = JSON.parse(localStorage.getItem('koreadrive-wishlist') || '[]');
            const newsletter = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');

            // Update dashboard cards
            this.updateStatCard('totalCars', cars.length);
            this.updateStatCard('totalUsers', users.length);
            this.updateStatCard('totalWishlist', wishlist.length);
            this.updateStatCard('totalNewsletter', newsletter.length);

        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    }

    loadRecentActivity() {
        const activityTable = document.getElementById('activityTable');
        if (!activityTable) return;

        // Mock recent activity data
        const activities = [
            {
                time: '10:30',
                action: 'Vetë e re',
                user: 'Admin',
                details: 'Hyundai Elantra 2023'
            },
            {
                time: '09:15',
                action: 'Përdorues i ri',
                user: 'john@example.com',
                details: 'Regjistrimi i suksesshëm'
            },
            {
                time: '08:45',
                action: 'Wishlist',
                user: 'maria@example.com',
                details: 'Shtoi në listën e dëshirave'
            }
        ];

        activityTable.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.time}</td>
                <td>${activity.action}</td>
                <td>${activity.user}</td>
                <td>${activity.details}</td>
            </tr>
        `).join('');
    }

    loadTabData(tabId) {
        switch (tabId) {
            case 'cars':
                this.loadCarsData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'analytics':
                this.initializeAnalyticsCharts();
                break;
        }
    }

    loadCarsData() {
        const carsTable = document.getElementById('carsTable');
        if (!carsTable) return;

        try {
            const cars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            
            if (cars.length === 0) {
                carsTable.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px;">
                            <i class="fas fa-car" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                            <p>Nuk ka vetë të regjistruara.</p>
                            <button class="btn btn-primary" onclick="openAddCarModal()">
                                <i class="fas fa-plus"></i>
                                Shto Vetën e Parë
                            </button>
                        </td>
                    </tr>
                `;
                return;
            }

            carsTable.innerHTML = cars.map(car => `
                <tr>
                    <td>${car.id}</td>
                    <td>${car.make}</td>
                    <td>${car.model}</td>
                    <td>${car.year}</td>
                    <td>${this.formatPrice(car.price)}</td>
                    <td>
                        <span class="status-badge status-active">Aktiv</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editCar('${car.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteCar('${car.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading cars data:', error);
            carsTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #e74c3c;">
                        Gabim në ngarkimin e të dhënave të veturave.
                    </td>
                </tr>
            `;
        }
    }

    loadUsersData() {
        const usersTable = document.getElementById('usersTable');
        if (!usersTable) return;

        try {
            // Mock users data since we don't have a user system yet
            const users = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    registeredAt: '2024-01-15',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Maria Smith',
                    email: 'maria@example.com',
                    registeredAt: '2024-01-20',
                    status: 'active'
                }
            ];

            usersTable.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.registeredAt).toLocaleDateString('sq-AL')}</td>
                    <td>
                        <span class="status-badge status-${user.status}">
                            ${user.status === 'active' ? 'Aktiv' : 'Joaktiv'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteUser('${user.id}')">
                            <i class="fas fa-ban"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading users data:', error);
        }
    }

    initializeCharts() {
        // Sales Chart
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            this.charts.sales = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Qer'],
                    datasets: [{
                        label: 'Shitjet',
                        data: [12, 19, 8, 15, 22, 18],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Brands Chart
        const brandsCtx = document.getElementById('brandsChart');
        if (brandsCtx) {
            this.charts.brands = new Chart(brandsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Hyundai', 'Kia', 'Samsung', 'Genesis'],
                    datasets: [{
                        data: [35, 30, 20, 15],
                        backgroundColor: [
                            '#3498db',
                            '#2ecc71',
                            '#f39c12',
                            '#e74c3c'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    initializeAnalyticsCharts() {
        // Visitors Chart
        const visitorsCtx = document.getElementById('visitorsChart');
        if (visitorsCtx && !this.charts.visitors) {
            this.charts.visitors = new Chart(visitorsCtx, {
                type: 'bar',
                data: {
                    labels: ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'],
                    datasets: [{
                        label: 'Vizitorë',
                        data: [120, 150, 180, 200, 170, 90, 85],
                        backgroundColor: '#3498db',
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Devices Chart
        const devicesCtx = document.getElementById('devicesChart');
        if (devicesCtx && !this.charts.devices) {
            this.charts.devices = new Chart(devicesCtx, {
                type: 'pie',
                data: {
                    labels: ['Desktop', 'Mobile', 'Tablet'],
                    datasets: [{
                        data: [45, 40, 15],
                        backgroundColor: [
                            '#2ecc71',
                            '#3498db',
                            '#f39c12'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    handleAddCar(event) {
        const formData = new FormData(event.target);
        const carData = {
            id: Date.now().toString(),
            make: formData.get('make'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            price: parseFloat(formData.get('price')),
            mileage: formData.get('mileage'),
            fuel: formData.get('fuel'),
            transmission: 'Manual', // Default
            description: formData.get('description'),
            image: formData.get('image') || './assets/img/cars/default-car.jpg',
            createdAt: new Date().toISOString()
        };

        try {
            // Get existing cars
            const cars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            
            // Add new car
            cars.push(carData);
            
            // Save to localStorage
            localStorage.setItem('koreadrive-cars', JSON.stringify(cars));
            
            // Close modal and refresh data
            this.closeModal('addCarModal');
            this.loadCarsData();
            this.updateStats();
            
            // Show success message
            this.showNotification('Vetë u shtua me sukses!', 'success');
            
            // Reset form
            event.target.reset();

        } catch (error) {
            console.error('Error adding car:', error);
            this.showNotification('Gabim në shtimin e veturës!', 'error');
        }
    }

    deleteCar(carId) {
        if (!confirm('Jeni të sigurt që dëshironi ta fshini këtë vetë?')) {
            return;
        }

        try {
            const cars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            const updatedCars = cars.filter(car => car.id !== carId);
            
            localStorage.setItem('koreadrive-cars', JSON.stringify(updatedCars));
            
            this.loadCarsData();
            this.updateStats();
            
            this.showNotification('Vetë u fshi me sukses!', 'success');

        } catch (error) {
            console.error('Error deleting car:', error);
            this.showNotification('Gabim në fshirjen e veturës!', 'error');
        }
    }

    deleteUser(userId) {
        if (!confirm('Jeni të sigurt që dëshironi ta çaktivizoni këtë përdorues?')) {
            return;
        }

        this.showNotification('Përdoruesi u çaktivizua!', 'info');
        // Implementation would depend on your user management system
    }

    formatPrice(price) {
        if (typeof price === 'number') {
            return price.toLocaleString('de-DE') + '€';
        }
        return price || 'Çmimi në kërkesë';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10001',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '350px',
            animation: 'slideInRight 0.3s ease-out'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions
function openAddCarModal() {
    const modal = document.getElementById('addCarModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    adminDashboard.closeModal(modalId);
}

function editCar(carId) {
    // Implementation for editing cars
    console.log('Edit car:', carId);
    adminDashboard.showNotification('Funksioni i editimit do të implementohet së shpejti!', 'info');
}

function editUser(userId) {
    // Implementation for editing users
    console.log('Edit user:', userId);
    adminDashboard.showNotification('Funksioni i editimit do të implementohet së shpejti!', 'info');
}

// Initialize admin dashboard
const adminDashboard = new AdminDashboard();

// Make it globally available
window.adminDashboard = adminDashboard;

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Add some sample data if none exists
document.addEventListener('DOMContentLoaded', () => {
    const existingCars = localStorage.getItem('koreadrive-cars');
    if (!existingCars || JSON.parse(existingCars).length === 0) {
        const sampleCars = [
            {
                id: '1',
                make: 'Hyundai',
                model: 'Elantra',
                year: 2023,
                price: 25000,
                mileage: '5,000 km',
                fuel: 'Benzinë',
                transmission: 'Automatik',
                description: 'Vetë në gjendje të shkëlqyer',
                image: './assets/img/cars/sedan/elantra.jpg',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                make: 'Kia',
                model: 'Sportage',
                year: 2022,
                price: 28000,
                mileage: '12,000 km',
                fuel: 'Naftë',
                transmission: 'Automatik',
                description: 'SUV familjar i përsosur',
                image: './assets/img/cars/suv/sportage.jpg',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('koreadrive-cars', JSON.stringify(sampleCars));
    }
});
