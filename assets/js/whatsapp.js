// WhatsApp contact functionality
document.addEventListener('DOMContentLoaded', function() {
    addWhatsAppButton();
});

function addWhatsAppButton() {
    // Create WhatsApp floating button
    const whatsappButton = document.createElement('div');
    whatsappButton.id = 'whatsapp-button';
    whatsappButton.innerHTML = `
        <a href="#" id="whatsapp-link" title="Na kontaktoni në WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
    `;
    
    // Add styles
    const styles = `
        #whatsapp-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            animation: pulse 2s infinite;
        }
        
        #whatsapp-button a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background-color: #25D366;
            color: white;
            border-radius: 50%;
            text-decoration: none;
            font-size: 28px;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            transition: all 0.3s ease;
        }
        
        #whatsapp-button a:hover {
            background-color: #128C7E;
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
        
        @media (max-width: 768px) {
            #whatsapp-button {
                bottom: 80px;
                right: 15px;
            }
            
            #whatsapp-button a {
                width: 55px;
                height: 55px;
                font-size: 24px;
            }
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Add button to body
    document.body.appendChild(whatsappButton);
    
    // Add click handler
    document.getElementById('whatsapp-link').addEventListener('click', function(e) {
        e.preventDefault();
        
        const phoneNumber = '+38343809160'; // KoreaDrive phone number
        const message = encodeURIComponent('Përshëndetje! Jam i interesuar për veturat tuaja në KoreaDrive.ks');
        
        // Get car ID if on car details page
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('id');
        
        let finalMessage = message;
        
        if (carId) {
            // Try to get car details from localStorage
            const savedCars = JSON.parse(localStorage.getItem('koreadrive-cars') || '[]');
            const car = savedCars.find(c => c.id === carId);
            
            if (car) {
                finalMessage = encodeURIComponent(`Përshëndetje! Jam i interesuar për ${getBrandName(car.brand)} ${car.model} (${car.year}) me çmim €${car.price.toLocaleString()}.`);
            }
        }
        
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${finalMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}

function getBrandName(brand) {
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
