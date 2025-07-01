// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Booking Modal Functionality
const modal = document.getElementById('bookingModal');
const closeBtn = document.querySelector('.close');

function openBookingModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min = today;
    document.getElementById('checkout').min = today;
}

function closeBookingModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking the X
closeBtn.addEventListener('click', closeBookingModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeBookingModal();
    }
});

// Room selection function
function selectRoom(roomType) {
    openBookingModal();
    document.getElementById('roomType').value = roomType;
}

// Check-in/Check-out date validation
document.getElementById('checkin').addEventListener('change', function() {
    const checkinDate = new Date(this.value);
    const checkoutInput = document.getElementById('checkout');
    
    // Set minimum checkout date to the day after check-in
    const minCheckout = new Date(checkinDate);
    minCheckout.setDate(minCheckout.getDate() + 1);
    checkoutInput.min = minCheckout.toISOString().split('T')[0];
    
    // Clear checkout if it's before the new minimum
    if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
        checkoutInput.value = '';
    }
});

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const bookingData = {};
    
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Validate dates
    const checkinDate = new Date(bookingData.checkin);
    const checkoutDate = new Date(bookingData.checkout);
    
    if (checkoutDate <= checkinDate) {
        alert('Check-out date must be after check-in date.');
        return;
    }
    
    // Calculate number of nights
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Room prices
    const roomPrices = {
        'deluxe': 7250,
        'suite': 11000,
        'villa': 15750,
        'presidential': 19000
    };
    
    const totalCost = nights * roomPrices[bookingData.roomType];
    
    // Show confirmation
    const confirmation = `
        Booking Confirmation:
        
        Guest: ${bookingData.name}
        Email: ${bookingData.email}
        Phone: ${bookingData.phone}
        
        Check-in: ${formatDate(checkinDate)}
        Check-out: ${formatDate(checkoutDate)}
        Nights: ${nights}
        
        Room: ${getRoomName(bookingData.roomType)}
        Guests: ${bookingData.guests}
        
        Total Cost: Rs. ${totalCost.toLocaleString()}
        
        ${bookingData.requests ? 'Special Requests: ' + bookingData.requests : ''}
        
        Thank you for choosing Rosemary Haven Resort!
        A confirmation email will be sent to ${bookingData.email}
    `;
    
    alert(confirmation);
    
    // Reset form and close modal
    this.reset();
    closeBookingModal();
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const contactData = {};
    
    for (let [key, value] of formData.entries()) {
        contactData[key] = value;
    }
    
    alert(`Thank you for your message, ${contactData.name}! We will get back to you at ${contactData.email} within 24 hours.`);
    
    this.reset();
});

// Newsletter subscription
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing! We'll send updates to ${email}.`);
    
    this.reset();
});

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getRoomName(roomType) {
    const roomNames = {
        'deluxe': 'Deluxe Room',
        'suite': 'Executive Suite',
        'villa': 'Private Villa',
        'presidential': 'Presidential Suite'
    };
    return roomNames[roomType] || roomType;
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.room-card, .amenity-card, .gallery-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Gallery lightbox effect (simple version)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const imageName = this.querySelector('p').textContent;
        alert(`Viewing: ${imageName}\n\nIn a full implementation, this would open a lightbox gallery.`);
    });
});

// Room card hover effects
document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic pricing display
function updatePricing() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('roomType').value;
    
    if (checkin && checkout && roomType) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 3600 * 24));
        
        const roomPrices = {
            'deluxe': 7250,
            'suite': 11000,
            'villa': 15750,
            'presidential': 19000
        };
        
        if (nights > 0) {
            const total = nights * roomPrices[roomType];
            
            // Create or update pricing display
            let pricingDiv = document.getElementById('pricing-display');
            if (!pricingDiv) {
                pricingDiv = document.createElement('div');
                pricingDiv.id = 'pricing-display';
                pricingDiv.style.cssText = `
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 15px;
                    text-align: center;
                    border: 2px solid #c29a5c;
                `;
                document.querySelector('.booking-form').appendChild(pricingDiv);
            }
            
            pricingDiv.innerHTML = `
                <strong>Estimated Total: Rs. ${total.toLocaleString()}</strong><br>
                <small>${nights} night${nights > 1 ? 's' : ''} × Rs. ${roomPrices[roomType]} per night</small>
            `;
        }
    }
}

// Add event listeners for dynamic pricing
document.getElementById('checkin').addEventListener('change', updatePricing);
document.getElementById('checkout').addEventListener('change', updatePricing);
document.getElementById('roomType').addEventListener('change', updatePricing);

// Add some interactive features for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #c29a5c;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(194, 154, 92, 0.3);
`;

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Add hover effects for social links
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});