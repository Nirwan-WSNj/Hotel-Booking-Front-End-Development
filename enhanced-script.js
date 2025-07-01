// Enhanced JavaScript for Rosemary Haven Resort
// Real-time Web Application Features

class RosemaryHavenApp {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {};
        this.guestCount = 2;
        this.chatMessages = [];
        this.weatherData = null;
        this.availabilityData = {};
        this.currentLanguage = 'en';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAOS();
        this.loadWeatherData();
        this.startRealTimeUpdates();
        this.initializeChat();
        this.loadRoomData();
        this.setupLanguageSupport();
        this.hidePreloader();
    }

    // Preloader Management
    hidePreloader() {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 2000);
    }

    // Initialize AOS (Animate On Scroll)
    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Booking form
        this.setupBookingForm();
        
        // Room tabs
        this.setupRoomTabs();
        
        // Scroll effects
        this.setupScrollEffects();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Language selector
        this.setupLanguageSelector();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    this.scrollToSection(targetId);
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    setupBookingForm() {
        const checkinInput = document.getElementById('checkin-smart');
        const checkoutInput = document.getElementById('checkout-smart');
        const roomTypeSelect = document.getElementById('room-type-smart');

        if (checkinInput) {
            checkinInput.addEventListener('change', () => this.updatePricing());
            checkinInput.min = new Date().toISOString().split('T')[0];
        }

        if (checkoutInput) {
            checkoutInput.addEventListener('change', () => this.updatePricing());
        }

        if (roomTypeSelect) {
            roomTypeSelect.addEventListener('change', () => this.updatePricing());
        }
    }

    setupRoomTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadRoomContent(btn.dataset.room);
            });
        });

        // Load default room content
        if (tabBtns.length > 0) {
            this.loadRoomContent('deluxe');
        }
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Close menu when clicking on links
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    // Weather Data
    async loadWeatherData() {
        try {
            // Simulated weather data - in real app, use weather API
            const weatherData = {
                temperature: Math.floor(Math.random() * 10) + 25,
                condition: 'sunny',
                humidity: Math.floor(Math.random() * 30) + 60
            };

            this.updateWeatherWidget(weatherData);
        } catch (error) {
            console.error('Error loading weather data:', error);
        }
    }

    updateWeatherWidget(data) {
        const temperatureElement = document.getElementById('temperature');
        const weatherIcon = document.querySelector('.weather-widget i');

        if (temperatureElement) {
            temperatureElement.textContent = `${data.temperature}°C`;
        }

        if (weatherIcon) {
            const iconClass = this.getWeatherIcon(data.condition);
            weatherIcon.className = `fas ${iconClass}`;
        }
    }

    getWeatherIcon(condition) {
        const icons = {
            sunny: 'fa-sun',
            cloudy: 'fa-cloud',
            rainy: 'fa-cloud-rain',
            stormy: 'fa-bolt'
        };
        return icons[condition] || 'fa-sun';
    }

    // Real-time Updates
    startRealTimeUpdates() {
        // Update availability ticker
        this.updateAvailabilityTicker();
        setInterval(() => this.updateAvailabilityTicker(), 30000);

        // Update pricing
        setInterval(() => this.updateDynamicPricing(), 60000);

        // Update weather
        setInterval(() => this.loadWeatherData(), 300000);
    }

    updateAvailabilityTicker() {
        const rooms = ['Presidential Suite', 'Private Villas', 'Executive Suites', 'Deluxe Rooms'];
        const statuses = ['Available', 'Limited', 'Almost Full'];
        const colors = ['text-green', 'text-orange', 'text-red'];

        const tickerContent = document.querySelector('.ticker-content');
        if (tickerContent) {
            tickerContent.innerHTML = '';
            
            for (let i = 0; i < 3; i++) {
                const room = rooms[Math.floor(Math.random() * rooms.length)];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                const tickerItem = document.createElement('span');
                tickerItem.className = 'ticker-item';
                tickerItem.innerHTML = `
                    <i class="fas fa-circle ${color}"></i>
                    ${room} ${status}
                `;
                tickerContent.appendChild(tickerItem);
            }
        }
    }

    // Guest Count Management
    adjustGuests(change) {
        this.guestCount = Math.max(1, Math.min(10, this.guestCount + change));
        const guestCountElement = document.getElementById('guest-count');
        if (guestCountElement) {
            guestCountElement.textContent = this.guestCount;
        }
        this.updatePricing();
    }

    // Smart Search
    smartSearch() {
        const checkin = document.getElementById('checkin-smart').value;
        const checkout = document.getElementById('checkout-smart').value;
        const roomType = document.getElementById('room-type-smart').value;

        if (!checkin || !checkout) {
            this.showNotification('Please select check-in and check-out dates', 'warning');
            return;
        }

        if (new Date(checkout) <= new Date(checkin)) {
            this.showNotification('Check-out date must be after check-in date', 'error');
            return;
        }

        // Simulate search with loading
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            this.showSearchResults();
            this.showNotification('Found best available rates!', 'success');
        }, 2000);
    }

    showLoadingState() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Searching...</span>';
            searchBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> <span>Find Best Rates</span>';
            searchBtn.disabled = false;
        }
    }

    showSearchResults() {
        // This would typically show available rooms
        this.openBookingModal();
    }

    // Pricing System
    updatePricing() {
        const checkin = document.getElementById('checkin-smart')?.value;
        const checkout = document.getElementById('checkout-smart')?.value;
        const roomType = document.getElementById('room-type-smart')?.value;

        if (!checkin || !checkout || !roomType) {
            this.hidePriceDisplay();
            return;
        }

        const pricing = this.calculatePrice(roomType, checkin, checkout);
        if (pricing) {
            this.showPriceDisplay(pricing);
        }
    }

    calculatePrice(roomType, checkin, checkout) {
        const prices = {
            deluxe: { base: 89700, weekend: 104700, peak: 119700 },
            suite: { base: 149700, weekend: 179700, peak: 209700 },
            villa: { base: 269700, weekend: 329700, peak: 389700 },
            presidential: { base: 479700, weekend: 569700, peak: 659700 }
        };

        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

        if (nights <= 0) return null;

        const basePrice = prices[roomType]?.base || prices.deluxe.base;
        const totalPrice = basePrice * nights;

        return {
            basePrice,
            totalPrice,
            nights,
            savings: Math.floor(basePrice * 0.15) // 15% savings simulation
        };
    }

    showPriceDisplay(pricing) {
        const priceDisplay = document.getElementById('price-display');
        const priceAmount = document.getElementById('price-amount');
        const priceBreakdown = document.getElementById('price-breakdown');
        const savingsBadge = document.getElementById('savings-badge');

        if (priceDisplay && priceAmount && priceBreakdown) {
            priceAmount.textContent = pricing.basePrice.toLocaleString();
            priceBreakdown.textContent = `${pricing.nights} night${pricing.nights > 1 ? 's' : ''} • Total: Rs. ${pricing.totalPrice.toLocaleString()}`;
            priceDisplay.style.display = 'flex';

            if (savingsBadge && pricing.savings > 0) {
                savingsBadge.style.display = 'flex';
            }
        }
    }

    hidePriceDisplay() {
        const priceDisplay = document.getElementById('price-display');
        if (priceDisplay) {
            priceDisplay.style.display = 'none';
        }
    }

    updateDynamicPricing() {
        // Simulate dynamic pricing changes
        const priceAmount = document.getElementById('price-amount');
        if (priceAmount && priceAmount.textContent !== '0') {
            const currentPrice = parseInt(priceAmount.textContent.replace(/,/g, ''));
            const variation = Math.floor(Math.random() * 2000) - 1000; // ±1000 variation
            const newPrice = Math.max(6000, currentPrice + variation);
            priceAmount.textContent = newPrice.toLocaleString();
        }
    }

    // Room Content Management
    loadRoomContent(roomType) {
        const roomContent = document.getElementById('room-content');
        if (!roomContent) return;

        const roomData = this.getRoomData(roomType);
        
        roomContent.innerHTML = `
            <div class="room-showcase-content">
                <div class="room-showcase-grid">
                    <div class="room-showcase-image">
                        <img src="${roomData.image}" alt="${roomData.name}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px;">
                    </div>
                    <div class="room-showcase-details">
                        <h3>${roomData.name}</h3>
                        <p class="room-description">${roomData.description}</p>
                        <div class="room-features">
                            ${roomData.features.map(feature => `
                                <div class="feature-item">
                                    <i class="fas fa-check"></i>
                                    <span>${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="room-pricing-info">
                            <div class="price-range">
                                <span class="from">From</span>
                                <span class="price">Rs. ${roomData.price.toLocaleString()}</span>
                                <span class="period">per night</span>
                            </div>
                            <button class="btn-primary" onclick="app.openBookingModal('${roomType}')">
                                Reserve Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getRoomData(roomType) {
        const rooms = {
            deluxe: {
                name: 'Deluxe Room',
                description: 'Sophisticated accommodations featuring contemporary design and premium amenities. Perfect for discerning travelers seeking comfort and elegance.',
                image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: 7250,
                features: [
                    'King-size bed with premium linens',
                    'Marble bathroom with rain shower',
                    'Private balcony with garden views',
                    '55" Smart TV with streaming',
                    'Mini bar and coffee station',
                    '24-hour room service'
                ]
            },
            suite: {
                name: 'Executive Suite',
                description: 'Expansive suites with separate living areas, perfect for extended stays or those who appreciate additional space and luxury.',
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: 11000,
                features: [
                    'Separate living and bedroom areas',
                    'Jacuzzi tub and rain shower',
                    'Fully equipped kitchenette',
                    'Private terrace with panoramic views',
                    'Premium mini bar',
                    'Personal concierge service'
                ]
            },
            villa: {
                name: 'Private Villa',
                description: 'Ultimate privacy and luxury with private pools and dedicated butler service. Ideal for families or groups seeking exclusivity.',
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: 15750,
                features: [
                    'Private infinity pool',
                    'Multiple bedrooms with en-suite bathrooms',
                    'Gourmet kitchen',
                    'Private garden and entertainment area',
                    'Dedicated butler service',
                    'Private parking and entrance'
                ]
            },
            presidential: {
                name: 'Presidential Suite',
                description: 'The pinnacle of luxury accommodation with unparalleled elegance, panoramic views, and exclusive amenities.',
                image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                price: 19000,
                features: [
                    'Panoramic views from rooftop terrace',
                    'Personal spa suite',
                    'Private wine cellar',
                    'Entertainment room with home theater',
                    'Personal chef and concierge',
                    'Helicopter landing access'
                ]
            }
        };

        return rooms[roomType] || rooms.deluxe;
    }

    loadRoomData() {
        // Initialize room showcase
        setTimeout(() => {
            this.loadRoomContent('deluxe');
        }, 100);
    }

    // Modal Management
    openBookingModal(roomType = null) {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            if (roomType) {
                this.bookingData.roomType = roomType;
            }
            
            this.currentStep = 1;
            this.renderBookingStep();
        }
    }

    closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetBookingData();
        }
    }

    renderBookingStep() {
        const modalBody = document.getElementById('modal-body');
        const steps = document.querySelectorAll('.step');
        
        // Update step indicators
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        if (!modalBody) return;

        switch (this.currentStep) {
            case 1:
                this.renderDatesAndGuestsStep(modalBody);
                break;
            case 2:
                this.renderRoomSelectionStep(modalBody);
                break;
            case 3:
                this.renderGuestDetailsStep(modalBody);
                break;
            case 4:
                this.renderConfirmationStep(modalBody);
                break;
        }
    }

    renderDatesAndGuestsStep(container) {
        container.innerHTML = `
            <div class="booking-step">
                <h3>Select Your Dates</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Check-in Date</label>
                        <input type="date" id="modal-checkin" class="form-input" value="${this.bookingData.checkin || ''}" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Check-out Date</label>
                        <input type="date" id="modal-checkout" class="form-input" value="${this.bookingData.checkout || ''}">
                    </div>
                    <div class="form-group">
                        <label>Number of Guests</label>
                        <div class="guest-selector">
                            <button type="button" onclick="app.adjustModalGuests(-1)">-</button>
                            <span id="modal-guest-count">${this.bookingData.guests || 2}</span>
                            <button type="button" onclick="app.adjustModalGuests(1)">+</button>
                        </div>
                    </div>
                </div>
                <div class="step-actions">
                    <button class="btn-primary" onclick="app.nextStep()">Continue</button>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('modal-checkin').addEventListener('change', (e) => {
            this.bookingData.checkin = e.target.value;
            const checkoutInput = document.getElementById('modal-checkout');
            const minCheckout = new Date(e.target.value);
            minCheckout.setDate(minCheckout.getDate() + 1);
            checkoutInput.min = minCheckout.toISOString().split('T')[0];
        });

        document.getElementById('modal-checkout').addEventListener('change', (e) => {
            this.bookingData.checkout = e.target.value;
        });
    }

    renderRoomSelectionStep(container) {
        const rooms = ['deluxe', 'suite', 'villa', 'presidential'];
        
        container.innerHTML = `
            <div class="booking-step">
                <h3>Choose Your Room</h3>
                <div class="room-selection-grid">
                    ${rooms.map(roomType => {
                        const room = this.getRoomData(roomType);
                        return `
                            <div class="room-option ${this.bookingData.roomType === roomType ? 'selected' : ''}" 
                                 onclick="app.selectRoom('${roomType}')">
                                <img src="${room.image}" alt="${room.name}">
                                <div class="room-option-details">
                                    <h4>${room.name}</h4>
                                    <p class="room-price">Rs. ${room.price.toLocaleString()}/night</p>
                                    <div class="room-features-mini">
                                        ${room.features.slice(0, 3).map(feature => `<span>• ${feature}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="step-actions">
                    <button class="btn-secondary" onclick="app.previousStep()">Back</button>
                    <button class="btn-primary" onclick="app.nextStep()" ${!this.bookingData.roomType ? 'disabled' : ''}>Continue</button>
                </div>
            </div>
        `;
    }

    renderGuestDetailsStep(container) {
        container.innerHTML = `
            <div class="booking-step">
                <h3>Guest Information</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="guest-name" class="form-input" value="${this.bookingData.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="guest-email" class="form-input" value="${this.bookingData.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="guest-phone" class="form-input" value="${this.bookingData.phone || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Country</label>
                        <select id="guest-country" class="form-input">
                            <option value="">Select Country</option>
                            <option value="LK">Sri Lanka</option>
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Special Requests</label>
                    <textarea id="special-requests" class="form-input" rows="4" placeholder="Any special requirements or preferences...">${this.bookingData.requests || ''}</textarea>
                </div>
                <div class="step-actions">
                    <button class="btn-secondary" onclick="app.previousStep()">Back</button>
                    <button class="btn-primary" onclick="app.nextStep()">Review Booking</button>
                </div>
            </div>
        `;
    }

    renderConfirmationStep(container) {
        const room = this.getRoomData(this.bookingData.roomType);
        const pricing = this.calculatePrice(this.bookingData.roomType, this.bookingData.checkin, this.bookingData.checkout);
        
        container.innerHTML = `
            <div class="booking-step">
                <h3>Booking Confirmation</h3>
                <div class="booking-summary">
                    <div class="summary-section">
                        <h4>Accommodation Details</h4>
                        <div class="summary-item">
                            <span>Room Type:</span>
                            <span>${room.name}</span>
                        </div>
                        <div class="summary-item">
                            <span>Check-in:</span>
                            <span>${this.formatDate(this.bookingData.checkin)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Check-out:</span>
                            <span>${this.formatDate(this.bookingData.checkout)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Guests:</span>
                            <span>${this.bookingData.guests} ${this.bookingData.guests > 1 ? 'guests' : 'guest'}</span>
                        </div>
                        <div class="summary-item">
                            <span>Nights:</span>
                            <span>${pricing.nights}</span>
                        </div>
                    </div>
                    
                    <div class="summary-section">
                        <h4>Guest Information</h4>
                        <div class="summary-item">
                            <span>Name:</span>
                            <span>${this.bookingData.name}</span>
                        </div>
                        <div class="summary-item">
                            <span>Email:</span>
                            <span>${this.bookingData.email}</span>
                        </div>
                        <div class="summary-item">
                            <span>Phone:</span>
                            <span>${this.bookingData.phone}</span>
                        </div>
                    </div>
                    
                    <div class="summary-section pricing-summary">
                        <h4>Pricing Summary</h4>
                        <div class="summary-item">
                            <span>Room Rate (${pricing.nights} nights):</span>
                            <span>Rs. ${pricing.totalPrice.toLocaleString()}</span>
                        </div>
                        <div class="summary-item">
                            <span>Taxes & Fees:</span>
                            <span>Rs. ${Math.floor(pricing.totalPrice * 0.15).toLocaleString()}</span>
                        </div>
                        <div class="summary-item total">
                            <span>Total Amount:</span>
                            <span>Rs. ${Math.floor(pricing.totalPrice * 1.15).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="step-actions">
                    <button class="btn-secondary" onclick="app.previousStep()">Back</button>
                    <button class="btn-primary" onclick="app.confirmBooking()">Confirm Booking</button>
                </div>
            </div>
        `;
    }

    adjustModalGuests(change) {
        const current = this.bookingData.guests || 2;
        this.bookingData.guests = Math.max(1, Math.min(10, current + change));
        const guestCountElement = document.getElementById('modal-guest-count');
        if (guestCountElement) {
            guestCountElement.textContent = this.bookingData.guests;
        }
    }

    selectRoom(roomType) {
        this.bookingData.roomType = roomType;
        
        // Update UI
        const roomOptions = document.querySelectorAll('.room-option');
        roomOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[onclick="app.selectRoom('${roomType}')"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Enable continue button
        const continueBtn = document.querySelector('.step-actions .btn-primary');
        if (continueBtn) {
            continueBtn.disabled = false;
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.renderBookingStep();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderBookingStep();
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                const checkin = document.getElementById('modal-checkin').value;
                const checkout = document.getElementById('modal-checkout').value;
                
                if (!checkin || !checkout) {
                    this.showNotification('Please select check-in and check-out dates', 'error');
                    return false;
                }
                
                if (new Date(checkout) <= new Date(checkin)) {
                    this.showNotification('Check-out date must be after check-in date', 'error');
                    return false;
                }
                
                this.bookingData.checkin = checkin;
                this.bookingData.checkout = checkout;
                this.bookingData.guests = parseInt(document.getElementById('modal-guest-count').textContent);
                return true;
                
            case 2:
                if (!this.bookingData.roomType) {
                    this.showNotification('Please select a room type', 'error');
                    return false;
                }
                return true;
                
            case 3:
                const name = document.getElementById('guest-name').value;
                const email = document.getElementById('guest-email').value;
                const phone = document.getElementById('guest-phone').value;
                
                if (!name || !email || !phone) {
                    this.showNotification('Please fill in all required fields', 'error');
                    return false;
                }
                
                this.bookingData.name = name;
                this.bookingData.email = email;
                this.bookingData.phone = phone;
                this.bookingData.country = document.getElementById('guest-country').value;
                this.bookingData.requests = document.getElementById('special-requests').value;
                return true;
                
            default:
                return true;
        }
    }

    confirmBooking() {
        // Simulate booking confirmation
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            this.showBookingSuccess();
            this.resetBookingData();
        }, 3000);
    }

    showBookingSuccess() {
        const modalBody = document.getElementById('modal-body');
        const bookingRef = 'RH' + Date.now().toString().slice(-6);
        
        modalBody.innerHTML = `
            <div class="booking-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Booking Confirmed!</h3>
                <p>Thank you for choosing Rosemary Haven Resort. Your reservation has been confirmed.</p>
                <div class="booking-reference">
                    <strong>Booking Reference: ${bookingRef}</strong>
                </div>
                <p>A confirmation email has been sent to ${this.bookingData.email}</p>
                <div class="success-actions">
                    <button class="btn-primary" onclick="app.closeBookingModal()">Close</button>
                    <button class="btn-secondary" onclick="app.downloadConfirmation()">Download Confirmation</button>
                </div>
            </div>
        `;
        
        this.showNotification('Booking confirmed successfully!', 'success');
    }

    resetBookingData() {
        this.bookingData = {};
        this.currentStep = 1;
    }

    downloadConfirmation() {
        // Simulate PDF download
        this.showNotification('Confirmation PDF downloaded', 'success');
    }

    // Chat System
    initializeChat() {
        this.loadChatHistory();
        this.setupChatEventListeners();
    }

    setupChatEventListeners() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    loadChatHistory() {
        // Load previous chat messages (simulated)
        this.chatMessages = [
            {
                type: 'bot',
                message: 'Welcome to Rosemary Haven! How may I assist you today?',
                timestamp: new Date()
            }
        ];
        this.renderChatMessages();
    }

    toggleChat() {
        const chatWidget = document.getElementById('chat-widget');
        if (chatWidget) {
            chatWidget.classList.toggle('collapsed');
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.chatMessages.push({
            type: 'user',
            message: message,
            timestamp: new Date()
        });
        
        chatInput.value = '';
        this.renderChatMessages();
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = this.generateBotResponse(message);
            this.chatMessages.push({
                type: 'bot',
                message: botResponse,
                timestamp: new Date()
            });
            this.renderChatMessages();
        }, 1000);
    }

    generateBotResponse(userMessage) {
        const responses = {
            'booking': 'I can help you with your booking. Would you like to make a new reservation or modify an existing one?',
            'price': 'Our room rates start from Rs. 6,000 per night for Deluxe Rooms. Prices vary by season and availability.',
            'amenities': 'We offer world-class amenities including spa services, fine dining, infinity pool, and 24/7 concierge service.',
            'location': 'Rosemary Haven Resort is located in Paradise Valley, Colombo, offering stunning views and easy access to local attractions.',
            'default': 'Thank you for your message. Our concierge team will assist you shortly. Is there anything specific I can help you with regarding your stay?'
        };
        
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    renderChatMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = this.chatMessages.map(msg => `
            <div class="message ${msg.type}">
                <div class="message-content">${msg.message}</div>
                <div class="message-time">${this.formatTime(msg.timestamp)}</div>
            </div>
        `).join('');
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Language Support
    changeLanguage(language) {
        this.currentLanguage = language;
        // In a real app, this would load language files and update content
        this.showNotification(`Language changed to ${language.toUpperCase()}`, 'info');
    }

    setupLanguageSupport() {
        // Initialize with default language
        this.currentLanguage = 'en';
    }

    // Utility Functions
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Global Functions (for onclick handlers)
window.openBookingModal = (roomType) => app.openBookingModal(roomType);
window.closeBookingModal = () => app.closeBookingModal();
window.adjustGuests = (change) => app.adjustGuests(change);
window.smartSearch = () => app.smartSearch();
window.toggleChat = () => app.toggleChat();
window.sendMessage = () => app.sendMessage();
window.scrollToSection = (sectionId) => app.scrollToSection(sectionId);

// Initialize App
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new RosemaryHavenApp();
});

// Additional CSS for notifications (to be added to the CSS file)
const notificationStyles = `
.notification {
    position: fixed;
    top: 100px;
    right: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 3000;
    min-width: 300px;
    animation: slideInRight 0.3s ease;
}

.notification-success { border-left: 4px solid #27ae60; }
.notification-error { border-left: 4px solid #e74c3c; }
.notification-warning { border-left: 4px solid #f39c12; }
.notification-info { border-left: 4px solid #3498db; }

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #7f8c8d;
    padding: 5px;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.booking-step {
    padding: 20px 0;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.form-input {
    width: 100%;
    padding: 15px;
    border: 2px solid #ecf0f1;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #c9a96e;
    box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.1);
}

.step-actions {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
    margin-top: 30px;
}

.room-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.room-option {
    border: 2px solid #ecf0f1;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
}

.room-option:hover,
.room-option.selected {
    border-color: #c9a96e;
    box-shadow: 0 10px 30px rgba(201, 169, 110, 0.2);
}

.room-option img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.room-option-details {
    padding: 20px;
}

.room-option h4 {
    margin-bottom: 10px;
    color: #2c3e50;
}

.room-price {
    color: #c9a96e;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 10px;
}

.room-features-mini {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 14px;
    color: #7f8c8d;
}

.booking-summary {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
}

.summary-section {
    margin-bottom: 25px;
}

.summary-section h4 {
    margin-bottom: 15px;
    color: #2c3e50;
    border-bottom: 1px solid #ecf0f1;
    padding-bottom: 10px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ecf0f1;
}

.summary-item.total {
    font-weight: 600;
    font-size: 1.1rem;
    color: #c9a96e;
    border-bottom: none;
    margin-top: 10px;
    padding-top: 15px;
    border-top: 2px solid #c9a96e;
}

.booking-success {
    text-align: center;
    padding: 40px 20px;
}

.success-icon {
    font-size: 4rem;
    color: #27ae60;
    margin-bottom: 20px;
}

.booking-reference {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    font-family: monospace;
}

.success-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 30px;
}

.room-showcase-content {
    padding: 20px 0;
}

.room-showcase-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
}

.room-showcase-details h3 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #2c3e50;
}

.room-description {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #7f8c8d;
    margin-bottom: 30px;
}

.room-features {
    margin-bottom: 30px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    color: #2c3e50;
}

.feature-item i {
    color: #c9a96e;
    width: 16px;
}

.room-pricing-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
}

.price-range {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.from {
    font-size: 14px;
    color: #7f8c8d;
}

.price {
    font-size: 1.8rem;
    font-weight: 700;
    color: #c9a96e;
}

.period {
    font-size: 14px;
    color: #7f8c8d;
}

@media (max-width: 768px) {
    .room-showcase-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .room-selection-grid {
        grid-template-columns: 1fr;
    }
    
    .step-actions {
        justify-content: center;
    }
    
    .success-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .room-pricing-info {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);