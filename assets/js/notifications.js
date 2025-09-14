// Notification System for KoreaDrive.ks
// This script handles all notification functionality including in-app notifications and email subscriptions

class NotificationManager {
    constructor() {
        this.storageKey = 'koreadrive-notifications';
        this.settingsKey = 'koreadrive-notification-settings';
        this.notifications = this.loadNotifications();
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeNotificationUI();
                this.checkForNewNotifications();
            });
        } else {
            this.setupEventListeners();
            this.initializeNotificationUI();
            this.checkForNewNotifications();
        }
    }

    loadNotifications() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading notifications:', error);
            return [];
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.settingsKey);
            return saved ? JSON.parse(saved) : {
                emailNotifications: true,
                newCarNotifications: true,
                priceAlerts: true,
                newsletterUpdates: true,
                systemNotifications: true,
                soundEnabled: true
            };
        } catch (error) {
            console.error('Error loading notification settings:', error);
            return {
                emailNotifications: true,
                newCarNotifications: true,
                priceAlerts: true,
                newsletterUpdates: true,
                systemNotifications: true,
                soundEnabled: true
            };
        }
    }

    saveNotifications() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    }

    createNotification(type, title, message, data = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            type, // 'new-car', 'price-alert', 'system', 'promotion', 'wishlist'
            title,
            message,
            data,
            timestamp: new Date().toISOString(),
            read: false,
            priority: data.priority || 'normal'
        };

        this.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        this.saveNotifications();
        this.updateNotificationUI();
        
        // Show in-app notification if enabled
        if (this.settings.systemNotifications) {
            this.showInAppNotification(notification);
        }

        // Play sound if enabled
        if (this.settings.soundEnabled) {
            this.playNotificationSound();
        }

        return notification;
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationUI();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationUI();
    }

    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationUI();
    }

    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.updateNotificationUI();
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    setupEventListeners() {
        // Listen for car updates to send notifications
        this.watchForCarUpdates();
        
        // Listen for wishlist changes
        this.watchForWishlistChanges();

        // Setup notification bell click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-bell')) {
                e.preventDefault();
                this.toggleNotificationPanel();
            }

            if (e.target.closest('.notification-item')) {
                const notificationId = e.target.closest('.notification-item').dataset.notificationId;
                if (notificationId) {
                    this.markAsRead(parseFloat(notificationId));
                }
            }

            if (e.target.closest('.mark-all-read')) {
                e.preventDefault();
                this.markAllAsRead();
            }

            if (e.target.closest('.clear-notifications')) {
                e.preventDefault();
                if (confirm('Jeni të sigurt që dëshironi t\'i fshini të gjitha njoftimet?')) {
                    this.clearAllNotifications();
                }
            }
        });

        // Close notification panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-wrapper') && !e.target.closest('.notification-bell')) {
                this.closeNotificationPanel();
            }
        });
    }

    initializeNotificationUI() {
        // Add notification bell to header if it doesn't exist
        this.addNotificationBell();
        this.updateNotificationUI();
    }

    addNotificationBell() {
        // Check if notification bell already exists
        if (document.querySelector('.notification-bell')) return;

        const header = document.querySelector('header nav ul');
        if (!header) return;

        const notificationHTML = `
            <li class="nav-item notification-wrapper">
                <a href="#" class="nav-link notification-bell">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge" id="notificationBadge">0</span>
                </a>
                <div class="notification-panel" id="notificationPanel">
                    <div class="notification-header">
                        <h4>Njoftimet</h4>
                        <div class="notification-actions">
                            <button class="mark-all-read" title="Shëno të gjitha si të lexuara">
                                <i class="fas fa-check-double"></i>
                            </button>
                            <button class="clear-notifications" title="Pastro të gjitha">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="notification-list" id="notificationList">
                        <!-- Notifications will be populated here -->
                    </div>
                    <div class="notification-footer">
                        <a href="#" onclick="openNotificationSettings()">Cilësimet e Njoftimeve</a>
                    </div>
                </div>
            </li>
        `;

        header.insertAdjacentHTML('beforeend', notificationHTML);

        // Add CSS for notifications
        this.addNotificationCSS();
    }

    addNotificationCSS() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-wrapper {
                position: relative;
            }

            .notification-bell {
                position: relative;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .notification-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e74c3c;
                color: white;
                font-size: 0.7rem;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .notification-badge.hidden {
                display: none;
            }

            .notification-panel {
                position: absolute;
                top: 100%;
                right: 0;
                width: 350px;
                max-height: 400px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                overflow: hidden;
            }

            .notification-panel.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .notification-header {
                padding: 15px 20px;
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notification-header h4 {
                margin: 0;
                font-size: 1rem;
                color: var(--secondary);
            }

            .notification-actions {
                display: flex;
                gap: 10px;
            }

            .notification-actions button {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 5px;
                border-radius: 3px;
                transition: all 0.3s ease;
            }

            .notification-actions button:hover {
                background: #e9ecef;
                color: var(--primary);
            }

            .notification-list {
                max-height: 300px;
                overflow-y: auto;
            }

            .notification-item {
                padding: 15px 20px;
                border-bottom: 1px solid #f8f9fa;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .notification-item:hover {
                background: #f8f9fa;
            }

            .notification-item.unread {
                background: #e3f2fd;
                border-left: 3px solid var(--primary);
            }

            .notification-item.unread::before {
                content: '';
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 8px;
                height: 8px;
                background: var(--primary);
                border-radius: 50%;
            }

            .notification-content {
                margin-left: 15px;
            }

            .notification-title {
                font-weight: 600;
                font-size: 0.9rem;
                color: var(--secondary);
                margin-bottom: 3px;
            }

            .notification-message {
                font-size: 0.8rem;
                color: #666;
                line-height: 1.4;
                margin-bottom: 5px;
            }

            .notification-time {
                font-size: 0.7rem;
                color: #999;
            }

            .notification-footer {
                padding: 10px 20px;
                background: #f8f9fa;
                border-top: 1px solid #dee2e6;
                text-align: center;
            }

            .notification-footer a {
                color: var(--primary);
                font-size: 0.9rem;
                text-decoration: none;
            }

            .notification-footer a:hover {
                text-decoration: underline;
            }

            .empty-notifications {
                padding: 40px 20px;
                text-align: center;
                color: #999;
            }

            .empty-notifications i {
                font-size: 2rem;
                margin-bottom: 10px;
                display: block;
            }

            /* In-app notification popup */
            .in-app-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                padding: 20px;
                max-width: 350px;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--primary);
            }

            .in-app-notification.show {
                transform: translateX(0);
            }

            .in-app-notification-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }

            .in-app-notification-title {
                font-weight: 600;
                font-size: 0.9rem;
                color: var(--secondary);
            }

            .in-app-notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0;
                margin-left: 10px;
            }

            .in-app-notification-message {
                font-size: 0.8rem;
                color: #666;
                line-height: 1.4;
            }

            /* Notification types */
            .notification-item.new-car .notification-content::before {
                content: '🚗';
                margin-right: 8px;
            }

            .notification-item.price-alert .notification-content::before {
                content: '💰';
                margin-right: 8px;
            }

            .notification-item.system .notification-content::before {
                content: '⚙️';
                margin-right: 8px;
            }

            .notification-item.promotion .notification-content::before {
                content: '🎉';
                margin-right: 8px;
            }

            .notification-item.wishlist .notification-content::before {
                content: '❤️';
                margin-right: 8px;
            }

            @media (max-width: 768px) {
                .notification-panel {
                    width: 300px;
                    right: -20px;
                }

                .in-app-notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    updateNotificationUI() {
        const badge = document.getElementById('notificationBadge');
        const unreadCount = this.getUnreadCount();

        if (badge) {
            badge.textContent = unreadCount;
            badge.classList.toggle('hidden', unreadCount === 0);
        }

        this.updateNotificationList();
    }

    updateNotificationList() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>Nuk ka njoftimet</p>
                </div>
            `;
            return;
        }

        notificationList.innerHTML = this.notifications.slice(0, 20).map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'} ${notification.type}" 
                 data-notification-id="${notification.id}">
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (!panel) return;

        panel.classList.toggle('active');
    }

    closeNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    showInAppNotification(notification) {
        // Remove existing in-app notification
        const existing = document.querySelector('.in-app-notification');
        if (existing) {
            existing.remove();
        }

        const notificationEl = document.createElement('div');
        notificationEl.className = 'in-app-notification';
        notificationEl.innerHTML = `
            <div class="in-app-notification-header">
                <div class="in-app-notification-title">${notification.title}</div>
                <button class="in-app-notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="in-app-notification-message">${notification.message}</div>
        `;

        document.body.appendChild(notificationEl);

        // Show notification
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            notificationEl.classList.remove('show');
            setTimeout(() => {
                if (notificationEl.parentNode) {
                    notificationEl.parentNode.removeChild(notificationEl);
                }
            }, 300);
        }, 5000);

        // Close button handler
        notificationEl.querySelector('.in-app-notification-close').addEventListener('click', () => {
            notificationEl.classList.remove('show');
            setTimeout(() => {
                if (notificationEl.parentNode) {
                    notificationEl.parentNode.removeChild(notificationEl);
                }
            }, 300);
        });
    }

    watchForCarUpdates() {
        // Watch for changes in car data
        let lastCarCount = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]').length;
        
        setInterval(() => {
            const currentCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            const currentCount = currentCars.length;
            
            if (currentCount > lastCarCount && this.settings.newCarNotifications) {
                const newCars = currentCars.slice(0, currentCount - lastCarCount);
                newCars.forEach(car => {
                    this.createNotification(
                        'new-car',
                        'Vetë e Re',
                        `${car.make} ${car.model} ${car.year} u shtua në inventar`,
                        { carId: car.id, car }
                    );
                });
            }
            
            lastCarCount = currentCount;
        }, 5000); // Check every 5 seconds
    }

    watchForWishlistChanges() {
        // Watch for wishlist changes
        let lastWishlistCount = JSON.parse(localStorage.getItem('koreadrive-wishlist') || '[]').length;
        
        setInterval(() => {
            const currentWishlist = JSON.parse(localStorage.getItem('koreadrive-wishlist') || '[]');
            const currentCount = currentWishlist.length;
            
            if (currentCount > lastWishlistCount) {
                const addedItems = currentCount - lastWishlistCount;
                this.createNotification(
                    'wishlist',
                    'Lista e Dëshirave',
                    `${addedItems} artikuj u shtuan në listën tuaj të dëshirave`,
                    { wishlistCount: currentCount }
                );
            }
            
            lastWishlistCount = currentCount;
        }, 3000); // Check every 3 seconds
    }

    checkForNewNotifications() {
        // Check for system notifications or promotions
        const lastCheck = localStorage.getItem('koreadrive-last-notification-check');
        const now = new Date().toISOString();
        
        if (!lastCheck || new Date(now) - new Date(lastCheck) > 24 * 60 * 60 * 1000) { // 24 hours
            this.createNotification(
                'system',
                'Mirësevini!',
                'Faleminderit që përdorni KoreaDrive.ks. Eksploroni koleksionin tonë të veturave koreane!',
                { priority: 'low' }
            );
            
            localStorage.setItem('koreadrive-last-notification-check', now);
        }
    }

    playNotificationSound() {
        if (!this.settings.soundEnabled) return;

        // Create a simple notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMs = now - time;
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 1) return 'Tani';
        if (diffInMins < 60) return `${diffInMins} min më parë`;
        if (diffInHours < 24) return `${diffInHours} orë më parë`;
        if (diffInDays < 7) return `${diffInDays} ditë më parë`;
        
        return time.toLocaleDateString('sq-AL');
    }

    // Email notification methods (mock implementation)
    sendEmailNotification(email, subject, message) {
        // In a real implementation, this would send an actual email
        console.log('Email notification sent:', { email, subject, message });
        
        this.createNotification(
            'system',
            'Email i Dërguar',
            `Njoftimi u dërgua në ${email}`,
            { email, priority: 'low' }
        );
    }

    subscribeToEmailNotifications(email, preferences = {}) {
        const subscription = {
            email,
            preferences: {
                newCars: preferences.newCars !== false,
                priceAlerts: preferences.priceAlerts !== false,
                promotions: preferences.promotions !== false,
                newsletter: preferences.newsletter !== false
            },
            subscribedAt: new Date().toISOString()
        };

        // Save subscription
        const subscriptions = JSON.parse(localStorage.getItem('koreadrive-email-subscriptions') || '[]');
        const existingIndex = subscriptions.findIndex(s => s.email === email);
        
        if (existingIndex >= 0) {
            subscriptions[existingIndex] = subscription;
        } else {
            subscriptions.push(subscription);
        }
        
        localStorage.setItem('koreadrive-email-subscriptions', JSON.stringify(subscriptions));

        this.createNotification(
            'system',
            'Pajtimi i Suksesshëm',
            `U pajtuat për njoftimet në email: ${email}`,
            { email }
        );

        return subscription;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }
}

// Global functions
function openNotificationSettings() {
    // This would open a settings modal or page
    console.log('Open notification settings');
    notificationManager.createNotification(
        'system',
        'Cilësimet',
        'Faqja e cilësimeve do të implementohet së shpejti!',
        { priority: 'low' }
    );
}

// Initialize notification manager
const notificationManager = new NotificationManager();

// Make it globally available
window.notificationManager = notificationManager;

// Example usage functions for testing
window.testNotifications = {
    newCar: () => {
        notificationManager.createNotification(
            'new-car',
            'Vetë e Re',
            'Hyundai Tucson 2024 u shtua në inventar',
            { carId: 'test-123' }
        );
    },
    priceAlert: () => {
        notificationManager.createNotification(
            'price-alert',
            'Zbritje Çmimi',
            'Çmimi i Kia Sportage u zvogëlua për 2,000€',
            { carId: 'test-456', oldPrice: 28000, newPrice: 26000 }
        );
    },
    promotion: () => {
        notificationManager.createNotification(
            'promotion',
            'Ofertë Speciale',
            'Zbritje 10% për të gjitha veturat gjatë kësaj jave!',
            { discount: 10, validUntil: '2024-02-01' }
        );
    }
};

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
