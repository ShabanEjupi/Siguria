// Notification Settings Management for KoreaDrive.ks
// This script handles the notification settings page functionality

class NotificationSettings {
    constructor() {
        this.settingsKey = 'koreadrive-notification-settings';
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.loadSettingsIntoUI();
                this.loadNotificationHistory();
            });
        } else {
            this.setupEventListeners();
            this.loadSettingsIntoUI();
            this.loadNotificationHistory();
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

    saveSettings() {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
            
            // Update the global notification manager settings if available
            if (window.notificationManager) {
                window.notificationManager.updateSettings(this.settings);
            }
            
            return true;
        } catch (error) {
            console.error('Error saving notification settings:', error);
            return false;
        }
    }

    setupEventListeners() {
        // Save settings button
        const saveButton = document.getElementById('saveSettings');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveCurrentSettings();
            });
        }

        // Reset settings button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }

        // Email subscription button
        const subscribeButton = document.getElementById('subscribeEmail');
        if (subscribeButton) {
            subscribeButton.addEventListener('click', () => {
                this.handleEmailSubscription();
            });
        }

        // Clear history button
        const clearHistoryButton = document.getElementById('clearHistory');
        if (clearHistoryButton) {
            clearHistoryButton.addEventListener('click', () => {
                this.clearNotificationHistory();
            });
        }

        // Email notifications toggle
        const emailToggle = document.getElementById('emailNotifications');
        if (emailToggle) {
            emailToggle.addEventListener('change', (e) => {
                const emailSection = document.getElementById('emailSubscription');
                if (emailSection) {
                    emailSection.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }

        // Setting change handlers
        const settingToggles = document.querySelectorAll('input[type="checkbox"]');
        settingToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.markAsUnsaved();
            });
        });

        // Test notification buttons (for development)
        this.addTestNotificationButtons();
    }

    loadSettingsIntoUI() {
        // Load notification preferences
        const settingElements = {
            'newCarNotifications': document.getElementById('newCarNotifications'),
            'priceAlerts': document.getElementById('priceAlerts'),
            'systemNotifications': document.getElementById('systemNotifications'),
            'newsletterUpdates': document.getElementById('newsletterUpdates'),
            'soundEnabled': document.getElementById('soundEnabled'),
            'emailNotifications': document.getElementById('emailNotifications')
        };

        Object.entries(settingElements).forEach(([key, element]) => {
            if (element) {
                element.checked = this.settings[key] !== false;
            }
        });

        // Show/hide email subscription section
        const emailSection = document.getElementById('emailSubscription');
        const emailToggle = document.getElementById('emailNotifications');
        if (emailSection && emailToggle) {
            emailSection.style.display = emailToggle.checked ? 'block' : 'none';
        }

        // Load saved email if exists
        const savedEmail = localStorage.getItem('koreadrive-email-address');
        const emailInput = document.getElementById('emailAddress');
        if (emailInput && savedEmail) {
            emailInput.value = savedEmail;
        }

        // Load email preferences
        const emailPreferences = JSON.parse(localStorage.getItem('koreadrive-email-preferences') || '{}');
        const emailPrefElements = {
            'emailNewCars': document.getElementById('emailNewCars'),
            'emailPriceAlerts': document.getElementById('emailPriceAlerts'),
            'emailPromotions': document.getElementById('emailPromotions'),
            'emailNewsletter': document.getElementById('emailNewsletter')
        };

        Object.entries(emailPrefElements).forEach(([key, element]) => {
            if (element) {
                element.checked = emailPreferences[key] !== false;
            }
        });
    }

    saveCurrentSettings() {
        // Collect current settings from UI
        const newSettings = {};
        
        const settingElements = {
            'newCarNotifications': document.getElementById('newCarNotifications'),
            'priceAlerts': document.getElementById('priceAlerts'),
            'systemNotifications': document.getElementById('systemNotifications'),
            'newsletterUpdates': document.getElementById('newsletterUpdates'),
            'soundEnabled': document.getElementById('soundEnabled'),
            'emailNotifications': document.getElementById('emailNotifications')
        };

        Object.entries(settingElements).forEach(([key, element]) => {
            if (element) {
                newSettings[key] = element.checked;
            }
        });

        // Save email preferences
        const emailPreferences = {};
        const emailPrefElements = {
            'emailNewCars': document.getElementById('emailNewCars'),
            'emailPriceAlerts': document.getElementById('emailPriceAlerts'),
            'emailPromotions': document.getElementById('emailPromotions'),
            'emailNewsletter': document.getElementById('emailNewsletter')
        };

        Object.entries(emailPrefElements).forEach(([key, element]) => {
            if (element) {
                emailPreferences[key] = element.checked;
            }
        });

        // Save email address
        const emailInput = document.getElementById('emailAddress');
        if (emailInput && emailInput.value.trim()) {
            localStorage.setItem('koreadrive-email-address', emailInput.value.trim());
        }

        // Update settings
        this.settings = { ...this.settings, ...newSettings };
        
        if (this.saveSettings()) {
            localStorage.setItem('koreadrive-email-preferences', JSON.stringify(emailPreferences));
            this.showSuccessMessage('Cilësimet u ruajtën me sukses!');
            this.removeUnsavedMark();
        } else {
            this.showErrorMessage('Gabim në ruajtjen e cilësimeve!');
        }
    }

    resetToDefaults() {
        if (!confirm('Jeni të sigurt që dëshironi të riktheni cilësimet në parazgjedhje?')) {
            return;
        }

        const defaultSettings = {
            emailNotifications: true,
            newCarNotifications: true,
            priceAlerts: true,
            newsletterUpdates: true,
            systemNotifications: true,
            soundEnabled: true
        };

        this.settings = defaultSettings;
        this.saveSettings();
        this.loadSettingsIntoUI();
        this.showSuccessMessage('Cilësimet u rikthyen në parazgjedhje!');
    }

    handleEmailSubscription() {
        const emailInput = document.getElementById('emailAddress');
        if (!emailInput || !emailInput.value.trim()) {
            this.showErrorMessage('Ju lutem shkruani adresën e email-it!');
            return;
        }

        const email = emailInput.value.trim();
        if (!this.isValidEmail(email)) {
            this.showErrorMessage('Adresa e email-it nuk është e vlefshme!');
            return;
        }

        // Get email preferences
        const preferences = {
            newCars: document.getElementById('emailNewCars')?.checked || false,
            priceAlerts: document.getElementById('emailPriceAlerts')?.checked || false,
            promotions: document.getElementById('emailPromotions')?.checked || false,
            newsletter: document.getElementById('emailNewsletter')?.checked || false
        };

        // Subscribe to email notifications
        if (window.notificationManager) {
            window.notificationManager.subscribeToEmailNotifications(email, preferences);
        }

        // Save email locally
        localStorage.setItem('koreadrive-email-address', email);
        localStorage.setItem('koreadrive-email-preferences', JSON.stringify(preferences));

        this.showSuccessMessage(`U pajtuat me sukses për njoftimet në: ${email}`);
    }

    loadNotificationHistory() {
        const historyContainer = document.getElementById('notificationHistory');
        if (!historyContainer) return;

        try {
            const notifications = JSON.parse(localStorage.getItem('koreadrive-notifications') || '[]');
            
            if (notifications.length === 0) {
                historyContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-bell-slash" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                        <p>Nuk ka historinë e njoftimeve</p>
                    </div>
                `;
                return;
            }

            historyContainer.innerHTML = notifications.slice(0, 20).map(notification => {
                const iconClass = this.getNotificationIcon(notification.type);
                const formattedTime = this.formatTime(notification.timestamp);
                
                return `
                    <div class="history-item">
                        <div class="history-icon ${notification.type}">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="history-content">
                            <div class="history-title">${notification.title}</div>
                            <div class="history-message">${notification.message}</div>
                            <div class="history-time">${formattedTime}</div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error loading notification history:', error);
            historyContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c;">
                    Gabim në ngarkimin e historisë së njoftimeve
                </div>
            `;
        }
    }

    clearNotificationHistory() {
        if (!confirm('Jeni të sigurt që dëshironi ta fshini historinë e njoftimeve?')) {
            return;
        }

        localStorage.removeItem('koreadrive-notifications');
        
        if (window.notificationManager) {
            window.notificationManager.clearAllNotifications();
        }

        this.loadNotificationHistory();
        this.showSuccessMessage('Historia e njoftimeve u fshi!');
    }

    getNotificationIcon(type) {
        const icons = {
            'new-car': 'fas fa-car',
            'price-alert': 'fas fa-tag',
            'system': 'fas fa-cog',
            'promotion': 'fas fa-percent',
            'wishlist': 'fas fa-heart'
        };
        return icons[type] || 'fas fa-bell';
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

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    markAsUnsaved() {
        const saveButton = document.getElementById('saveSettings');
        if (saveButton && !saveButton.classList.contains('unsaved')) {
            saveButton.classList.add('unsaved');
            saveButton.innerHTML = '<i class="fas fa-save"></i> Ruaj Ndryshimet*';
        }
    }

    removeUnsavedMark() {
        const saveButton = document.getElementById('saveSettings');
        if (saveButton) {
            saveButton.classList.remove('unsaved');
            saveButton.innerHTML = '<i class="fas fa-save"></i> Ruaj Cilësimet';
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `settings-message message-${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Style the message
        Object.assign(messageEl.style, {
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

        document.body.appendChild(messageEl);

        // Remove message after 4 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 4000);
    }

    addTestNotificationButtons() {
        // Add test buttons for development (only if in development mode)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const testContainer = document.createElement('div');
            testContainer.className = 'test-notifications';
            testContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            `;
            
            testContainer.innerHTML = `
                <small style="width: 100%; margin-bottom: 10px; color: #666;">Test Notifications:</small>
                <button onclick="testNotifications.newCar()" style="padding: 5px 10px; font-size: 0.8rem; border: none; background: #3498db; color: white; border-radius: 4px; cursor: pointer;">New Car</button>
                <button onclick="testNotifications.priceAlert()" style="padding: 5px 10px; font-size: 0.8rem; border: none; background: #f39c12; color: white; border-radius: 4px; cursor: pointer;">Price Alert</button>
                <button onclick="testNotifications.promotion()" style="padding: 5px 10px; font-size: 0.8rem; border: none; background: #2ecc71; color: white; border-radius: 4px; cursor: pointer;">Promotion</button>
            `;
            
            document.body.appendChild(testContainer);
        }
    }
}

// Global functions
function openNotificationSettings() {
    window.location.href = 'notification-settings.html';
}

// Initialize notification settings
const notificationSettings = new NotificationSettings();

// Make it globally available
window.notificationSettings = notificationSettings;

// Test functions for development
if (typeof window.testNotifications === 'undefined') {
    window.testNotifications = {
        newCar: () => {
            if (window.notificationManager) {
                window.notificationManager.createNotification(
                    'new-car',
                    'Vetë e Re',
                    'Hyundai Tucson 2024 u shtua në inventar',
                    { carId: 'test-' + Date.now() }
                );
            }
        },
        priceAlert: () => {
            if (window.notificationManager) {
                window.notificationManager.createNotification(
                    'price-alert',
                    'Zbritje Çmimi',
                    'Çmimi i Kia Sportage u zvogëlua për 2,000€',
                    { carId: 'test-' + Date.now(), oldPrice: 28000, newPrice: 26000 }
                );
            }
        },
        promotion: () => {
            if (window.notificationManager) {
                window.notificationManager.createNotification(
                    'promotion',
                    'Ofertë Speciale',
                    'Zbritje 10% për të gjitha veturat gjatë kësaj jave!',
                    { discount: 10, validUntil: '2024-02-01' }
                );
            }
        }
    };
}

// Add CSS for unsaved state
const unsavedCSS = `
    .btn.unsaved {
        background: #f39c12 !important;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
`;

const unsavedStyle = document.createElement('style');
unsavedStyle.textContent = unsavedCSS;
document.head.appendChild(unsavedStyle);
