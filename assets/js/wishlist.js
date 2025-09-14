// Wishlist Management System for KoreaDrive.ks
// This script handles all wishlist functionality

class WishlistManager {
    constructor() {
        this.storageKey = 'koreadrive-wishlist';
        this.wishlist = this.loadWishlist();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.renderWishlist();
                this.updateWishlistCount();
            });
        } else {
            this.setupEventListeners();
            this.renderWishlist();
            this.updateWishlistCount();
        }
    }

    loadWishlist() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    saveWishlist() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
            this.updateWishlistCount();
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }

    addToWishlist(car) {
        if (!this.isInWishlist(car.id)) {
            const wishlistItem = {
                ...car,
                addedAt: new Date().toISOString()
            };
            this.wishlist.push(wishlistItem);
            this.saveWishlist();
            this.showNotification('Shtuar në listën e dëshirave!', 'success');
            this.updateWishlistIcons();
            return true;
        }
        return false;
    }

    removeFromWishlist(carId) {
        const initialLength = this.wishlist.length;
        this.wishlist = this.wishlist.filter(item => item.id !== carId);
        
        if (this.wishlist.length < initialLength) {
            this.saveWishlist();
            this.showNotification('Hequr nga lista e dëshirave!', 'info');
            this.updateWishlistIcons();
            this.renderWishlist();
            return true;
        }
        return false;
    }

    isInWishlist(carId) {
        return this.wishlist.some(item => item.id === carId);
    }

    getWishlist() {
        return [...this.wishlist];
    }

    clearWishlist() {
        if (this.wishlist.length === 0) {
            this.showNotification('Lista e dëshirave është tashmë bosh!', 'info');
            return;
        }

        if (confirm('Jeni të sigurt që dëshironi të pastroni të gjithë listën e dëshirave?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.renderWishlist();
            this.updateWishlistIcons();
            this.showNotification('Lista e dëshirave u pastrua!', 'success');
        }
    }

    updateWishlistCount() {
        const countElements = document.querySelectorAll('.wishlist-count, [data-wishlist-count]');
        const count = this.wishlist.length;
        
        countElements.forEach(element => {
            if (element.classList.contains('wishlist-count')) {
                element.textContent = `${count} ${count === 1 ? 'artikull' : 'artikuj'} në listën tuaj`;
            } else {
                element.textContent = count;
                element.setAttribute('data-count', count);
            }
        });

        // Update page title if on wishlist page
        if (window.location.pathname.includes('wishlist.html')) {
            document.title = `Lista e Dëshirave (${count}) - KoreaDrive.ks`;
        }
    }

    updateWishlistIcons() {
        const wishlistButtons = document.querySelectorAll('[data-car-id]');
        
        wishlistButtons.forEach(button => {
            const carId = button.getAttribute('data-car-id');
            const icon = button.querySelector('i');
            const isInWishlist = this.isInWishlist(carId);
            
            if (icon) {
                if (isInWishlist) {
                    icon.className = 'fas fa-heart';
                    button.classList.add('in-wishlist');
                    button.title = 'Hiqe nga lista e dëshirave';
                } else {
                    icon.className = 'far fa-heart';
                    button.classList.remove('in-wishlist');
                    button.title = 'Shto në listën e dëshirave';
                }
            }
        });
    }

    renderWishlist() {
        const wishlistGrid = document.getElementById('wishlist-grid');
        const emptyWishlist = document.getElementById('empty-wishlist');
        
        if (!wishlistGrid || !emptyWishlist) return;

        if (this.wishlist.length === 0) {
            wishlistGrid.style.display = 'none';
            emptyWishlist.style.display = 'block';
            return;
        }

        wishlistGrid.style.display = 'grid';
        emptyWishlist.style.display = 'none';

        wishlistGrid.innerHTML = this.wishlist.map(car => this.createWishlistItemHTML(car)).join('');
    }

    createWishlistItemHTML(car) {
        const formatPrice = (price) => {
            if (typeof price === 'number') {
                return price.toLocaleString('de-DE') + '€';
            }
            return price || 'Çmimi në kërkesë';
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('sq-AL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        return `
            <div class="wishlist-item" data-car-id="${car.id}">
                <button class="remove-wishlist-btn" onclick="wishlistManager.removeFromWishlist('${car.id}')" title="Hiqe nga lista">
                    <i class="fas fa-times"></i>
                </button>
                
                <img src="${car.image || './assets/img/cars/default-car.jpg'}" 
                     alt="${car.make} ${car.model}" 
                     class="wishlist-item-image"
                     onerror="this.src='./assets/img/cars/default-car.jpg'">
                
                <div class="wishlist-item-content">
                    <h3 class="wishlist-item-title">${car.make} ${car.model}</h3>
                    
                    <div class="wishlist-item-details">
                        <span class="detail-tag">
                            <i class="fas fa-calendar"></i> ${car.year}
                        </span>
                        <span class="detail-tag">
                            <i class="fas fa-gas-pump"></i> ${car.fuel}
                        </span>
                        <span class="detail-tag">
                            <i class="fas fa-tachometer-alt"></i> ${car.mileage}
                        </span>
                        <span class="detail-tag">
                            <i class="fas fa-cog"></i> ${car.transmission}
                        </span>
                    </div>
                    
                    <div class="wishlist-item-price">${formatPrice(car.price)}</div>
                    
                    <div class="wishlist-item-meta">
                        <small class="text-muted">
                            <i class="fas fa-clock"></i>
                            Shtuar më ${formatDate(car.addedAt)}
                        </small>
                    </div>
                    
                    <div class="wishlist-item-actions">
                        <button class="wishlist-action-btn view-btn" onclick="viewCarDetails('${car.id}')">
                            <i class="fas fa-eye"></i>
                            Shiko Detajet
                        </button>
                        <button class="wishlist-action-btn remove-btn" onclick="wishlistManager.removeFromWishlist('${car.id}')">
                            <i class="fas fa-trash"></i>
                            Hiqe
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Handle wishlist button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn, .add-to-wishlist')) {
                e.preventDefault();
                const button = e.target.closest('.wishlist-btn, .add-to-wishlist');
                const carId = button.getAttribute('data-car-id');
                
                if (carId) {
                    this.toggleWishlist(carId);
                }
            }
        });

        // Handle clear wishlist button
        const clearBtn = document.querySelector('.clear-wishlist-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearWishlist());
        }
    }

    toggleWishlist(carId) {
        if (this.isInWishlist(carId)) {
            this.removeFromWishlist(carId);
        } else {
            // Get car data (this would need to be implemented based on your data structure)
            const car = this.getCarData(carId);
            if (car) {
                this.addToWishlist(car);
            }
        }
    }

    getCarData(carId) {
        // This method should fetch car data from your data source
        // For now, it's a placeholder - you'll need to implement this based on your data structure
        try {
            const cars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            return cars.find(car => car.id === carId);
        } catch (error) {
            console.error('Error getting car data:', error);
            return null;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '350px',
            animation: 'slideInRight 0.3s ease-out'
        });

        // Add CSS animation
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export wishlist data
    exportWishlist() {
        if (this.wishlist.length === 0) {
            this.showNotification('Lista e dëshirave është bosh!', 'info');
            return;
        }

        const data = {
            wishlist: this.wishlist,
            exportedAt: new Date().toISOString(),
            totalItems: this.wishlist.length
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `koreadrive-wishlist-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Lista e dëshirave u eksportua!', 'success');
    }
}

// Global functions
function viewCarDetails(carId) {
    // Redirect to car details page
    window.location.href = `car-details.html?id=${carId}`;
}

function clearWishlist() {
    if (window.wishlistManager) {
        window.wishlistManager.clearWishlist();
    }
}

function exportWishlist() {
    if (window.wishlistManager) {
        window.wishlistManager.exportWishlist();
    }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();

// Make it globally available
window.wishlistManager = wishlistManager;

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WishlistManager;
}
