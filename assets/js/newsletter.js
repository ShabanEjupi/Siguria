// Newsletter functionality for KoreaDrive.ks
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
});

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    const email = emailInput.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
        showNewsletterMessage('Ju lutemi vendosni një adresë email të vlefshme.', 'error', form);
        return;
    }
    
    // Check if already subscribed
    const subscribers = JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
    if (subscribers.some(sub => sub.email === email)) {
        showNewsletterMessage('Ky email është tashmë i abonuar në newsletter.', 'info', form);
        return;
    }
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Simulate API call (in real implementation, this would be a server request)
    setTimeout(() => {
        // Add to local storage (in real implementation, this would be a database)
        const newSubscriber = {
            email: email,
            subscribedAt: new Date().toISOString(),
            source: window.location.pathname
        };
        
        subscribers.push(newSubscriber);
        localStorage.setItem('koreadrive-newsletter', JSON.stringify(subscribers));
        
        // Show success message
        showNewsletterMessage('Faleminderit për abonimin! Do të merrni lajmet më të fundit për veturat tona.', 'success', form);
        
        // Reset form
        emailInput.value = '';
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Track subscription (you can integrate with Google Analytics or other tracking)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscribe', {
                event_category: 'engagement',
                event_label: 'footer_newsletter'
            });
        }
    }, 1000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNewsletterMessage(message, type, form) {
    // Remove existing messages
    const existingMessage = form.parentElement.querySelector('.newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message newsletter-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Insert message after form
    form.parentElement.insertBefore(messageDiv, form.nextSibling);
    
    // Add styles if not already present
    addNewsletterMessageStyles();
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

function addNewsletterMessageStyles() {
    if (document.getElementById('newsletter-styles')) {
        return; // Styles already added
    }
    
    const style = document.createElement('style');
    style.id = 'newsletter-styles';
    style.textContent = `
        .newsletter-message {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 15px;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 0.9em;
            animation: slideInDown 0.3s ease-out;
        }
        
        .newsletter-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .newsletter-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .newsletter-info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Admin function to get newsletter subscribers (for admin panel)
function getNewsletterSubscribers() {
    return JSON.parse(localStorage.getItem('koreadrive-newsletter') || '[]');
}

// Export newsletter data as CSV (for admin panel)
function exportNewsletterCSV() {
    const subscribers = getNewsletterSubscribers();
    
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
