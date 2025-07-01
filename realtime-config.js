// Real-time Configuration for Rosemary Haven Resort
// Advanced Features and API Integrations

class RealTimeConfig {
    constructor() {
        this.apiEndpoints = {
            weather: 'https://api.openweathermap.org/data/2.5/weather',
            availability: '/api/availability',
            pricing: '/api/pricing',
            booking: '/api/booking',
            chat: '/api/chat',
            reviews: '/api/reviews',
            analytics: '/api/analytics'
        };
        
        this.websocketUrl = 'wss://rosemaryhaven.lk/ws';
        this.updateIntervals = {
            weather: 300000, // 5 minutes
            availability: 30000, // 30 seconds
            pricing: 60000, // 1 minute
            reviews: 120000 // 2 minutes
        };
        
        this.features = {
            realTimeBooking: true,
            dynamicPricing: true,
            liveChat: true,
            weatherWidget: true,
            availabilityTicker: true,
            reviewsStream: true,
            analytics: true,
            multiLanguage: true,
            currencyConverter: true,
            virtualTour: true
        };
    }
}

// WebSocket Manager for Real-time Updates
class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.listeners = new Map();
    }

    connect() {
        try {
            this.socket = new WebSocket(this.url);
            this.setupEventListeners();
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.handleReconnect();
        }
    }

    setupEventListeners() {
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.emit('connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.handleReconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleMessage(data) {
        const { type, payload } = data;
        this.emit(type, payload);
    }

    send(type, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Real-time Availability Manager
class AvailabilityManager {
    constructor() {
        this.currentAvailability = {};
        this.updateInterval = null;
    }

    startTracking() {
        this.updateAvailability();
        this.updateInterval = setInterval(() => {
            this.updateAvailability();
        }, 30000);
    }

    async updateAvailability() {
        try {
            // Simulate real-time availability data
            const availability = {
                deluxe: {
                    available: Math.floor(Math.random() * 20) + 5,
                    total: 50,
                    status: this.getAvailabilityStatus(25)
                },
                suite: {
                    available: Math.floor(Math.random() * 15) + 3,
                    total: 30,
                    status: this.getAvailabilityStatus(18)
                },
                villa: {
                    available: Math.floor(Math.random() * 8) + 1,
                    total: 15,
                    status: this.getAvailabilityStatus(9)
                },
                presidential: {
                    available: Math.floor(Math.random() * 3) + 1,
                    total: 5,
                    status: this.getAvailabilityStatus(4)
                }
            };

            this.currentAvailability = availability;
            this.notifyAvailabilityUpdate(availability);
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    }

    getAvailabilityStatus(percentage) {
        if (percentage > 70) return 'high';
        if (percentage > 30) return 'medium';
        return 'low';
    }

    notifyAvailabilityUpdate(availability) {
        // Emit custom event for availability update
        window.dispatchEvent(new CustomEvent('availabilityUpdate', {
            detail: availability
        }));
    }

    stopTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Dynamic Pricing Engine
class DynamicPricingEngine {
    constructor() {
        this.basePrices = {
            deluxe: 89700,
            suite: 149700,
            villa: 269700,
            presidential: 479700
        };
        
        this.pricingFactors = {
            demand: 1.0,
            season: 1.0,
            dayOfWeek: 1.0,
            advance: 1.0,
            occupancy: 1.0
        };
    }

    calculatePrice(roomType, checkin, checkout, guests = 2) {
        const basePrice = this.basePrices[roomType] || this.basePrices.deluxe;
        const nights = this.calculateNights(checkin, checkout);
        
        if (nights <= 0) return null;

        // Apply dynamic pricing factors
        let adjustedPrice = basePrice;
        
        // Demand-based pricing
        adjustedPrice *= this.getDemandMultiplier();
        
        // Seasonal pricing
        adjustedPrice *= this.getSeasonalMultiplier(checkin);
        
        // Day of week pricing
        adjustedPrice *= this.getDayOfWeekMultiplier(checkin);
        
        // Advance booking discount
        adjustedPrice *= this.getAdvanceBookingMultiplier(checkin);
        
        // Occupancy-based pricing
        adjustedPrice *= this.getOccupancyMultiplier(roomType);

        return {
            basePrice: Math.round(basePrice),
            adjustedPrice: Math.round(adjustedPrice),
            totalPrice: Math.round(adjustedPrice * nights),
            nights: nights,
            factors: { ...this.pricingFactors },
            savings: Math.round((basePrice - adjustedPrice) * nights)
        };
    }

    calculateNights(checkin, checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        return Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    }

    getDemandMultiplier() {
        // Simulate demand-based pricing (0.8 to 1.3)
        return 0.8 + (Math.random() * 0.5);
    }

    getSeasonalMultiplier(checkin) {
        const date = new Date(checkin);
        const month = date.getMonth();
        
        // Peak season: December, January, July, August
        if ([11, 0, 6, 7].includes(month)) {
            return 1.3;
        }
        // Shoulder season: March, April, September, October
        if ([2, 3, 8, 9].includes(month)) {
            return 1.1;
        }
        // Low season: February, May, June, November
        return 0.9;
    }

    getDayOfWeekMultiplier(checkin) {
        const date = new Date(checkin);
        const dayOfWeek = date.getDay();
        
        // Weekend premium (Friday, Saturday)
        if ([5, 6].includes(dayOfWeek)) {
            return 1.2;
        }
        return 1.0;
    }

    getAdvanceBookingMultiplier(checkin) {
        const today = new Date();
        const checkinDate = new Date(checkin);
        const daysInAdvance = Math.ceil((checkinDate - today) / (1000 * 60 * 60 * 24));
        
        // Early bird discount for bookings 30+ days in advance
        if (daysInAdvance >= 30) {
            return 0.85;
        }
        // Standard discount for 14+ days
        if (daysInAdvance >= 14) {
            return 0.95;
        }
        // Last minute premium for bookings within 3 days
        if (daysInAdvance <= 3) {
            return 1.15;
        }
        return 1.0;
    }

    getOccupancyMultiplier(roomType) {
        // Simulate occupancy-based pricing
        const occupancyRate = Math.random();
        
        if (occupancyRate > 0.8) {
            return 1.2; // High occupancy premium
        }
        if (occupancyRate < 0.3) {
            return 0.9; // Low occupancy discount
        }
        return 1.0;
    }
}

// Analytics and Tracking
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            bookingFunnel: {}
        };
    }

    trackEvent(category, action, label = '', value = 0) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };
        
        this.events.push(event);
        this.sendToAnalytics(event);
    }

    trackPageView(page) {
        this.sessionData.pageViews++;
        this.trackEvent('Navigation', 'Page View', page);
    }

    trackBookingStep(step, data = {}) {
        this.sessionData.bookingFunnel[step] = {
            timestamp: Date.now(),
            data
        };
        this.trackEvent('Booking', 'Step Completed', step);
    }

    trackInteraction(element, action) {
        this.sessionData.interactions++;
        this.trackEvent('Interaction', action, element);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    sendToAnalytics(event) {
        // In a real application, send to analytics service
        console.log('Analytics Event:', event);
    }

    getSessionSummary() {
        return {
            ...this.sessionData,
            duration: Date.now() - this.sessionData.startTime,
            eventsCount: this.events.length
        };
    }
}

// Currency Converter
class CurrencyConverter {
    constructor() {
        this.rates = {
            LKR: 1,
            USD: 0.003,
            EUR: 0.0028,
            GBP: 0.0024,
            INR: 0.25,
            AUD: 0.0045,
            CAD: 0.004
        };
        this.currentCurrency = 'LKR';
    }

    async updateRates() {
        try {
            // In a real app, fetch from currency API
            // const response = await fetch('https://api.exchangerate-api.com/v4/latest/LKR');
            // const data = await response.json();
            // this.rates = data.rates;
            
            // Simulate rate updates
            Object.keys(this.rates).forEach(currency => {
                if (currency !== 'LKR') {
                    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
                    this.rates[currency] *= (1 + variation);
                }
            });
        } catch (error) {
            console.error('Error updating currency rates:', error);
        }
    }

    convert(amount, fromCurrency = 'LKR', toCurrency = this.currentCurrency) {
        const fromRate = this.rates[fromCurrency] || 1;
        const toRate = this.rates[toCurrency] || 1;
        return (amount / fromRate) * toRate;
    }

    formatPrice(amount, currency = this.currentCurrency) {
        const convertedAmount = this.convert(amount, 'LKR', currency);
        
        const formatters = {
            LKR: new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }),
            USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
            EUR: new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }),
            GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
            INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
            AUD: new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }),
            CAD: new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })
        };

        const formatter = formatters[currency] || formatters.LKR;
        return formatter.format(convertedAmount);
    }

    setCurrency(currency) {
        this.currentCurrency = currency;
        this.updateAllPrices();
    }

    updateAllPrices() {
        // Update all price displays on the page
        const priceElements = document.querySelectorAll('[data-price]');
        priceElements.forEach(element => {
            const originalPrice = parseFloat(element.dataset.price);
            element.textContent = this.formatPrice(originalPrice);
        });
    }
}

// Virtual Tour Manager
class VirtualTourManager {
    constructor() {
        this.tours = {
            lobby: {
                name: 'Grand Lobby',
                panorama: '/images/360/lobby.jpg',
                hotspots: [
                    { x: 30, y: 50, target: 'restaurant', label: 'Restaurant' },
                    { x: 70, y: 40, target: 'spa', label: 'Spa' }
                ]
            },
            deluxe: {
                name: 'Deluxe Room',
                panorama: '/images/360/deluxe-room.jpg',
                hotspots: [
                    { x: 20, y: 60, target: 'bathroom', label: 'Bathroom' },
                    { x: 80, y: 30, target: 'balcony', label: 'Balcony' }
                ]
            },
            spa: {
                name: 'Wellness Spa',
                panorama: '/images/360/spa.jpg',
                hotspots: [
                    { x: 50, y: 70, target: 'pool', label: 'Pool Area' }
                ]
            }
        };
        this.currentTour = null;
    }

    startTour(tourId) {
        const tour = this.tours[tourId];
        if (!tour) return;

        this.currentTour = tourId;
        this.createTourModal(tour);
    }

    createTourModal(tour) {
        const modal = document.createElement('div');
        modal.className = 'virtual-tour-modal';
        modal.innerHTML = `
            <div class="tour-content">
                <div class="tour-header">
                    <h3>${tour.name}</h3>
                    <button class="close-tour" onclick="this.closest('.virtual-tour-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="tour-viewer">
                    <div class="panorama-container">
                        <img src="${tour.panorama}" alt="${tour.name}" class="panorama-image">
                        ${tour.hotspots.map(hotspot => `
                            <div class="hotspot" style="left: ${hotspot.x}%; top: ${hotspot.y}%;" 
                                 onclick="virtualTourManager.navigateToTour('${hotspot.target}')">
                                <div class="hotspot-pulse"></div>
                                <div class="hotspot-label">${hotspot.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="tour-controls">
                    <button class="tour-btn" onclick="virtualTourManager.startTour('lobby')">Lobby</button>
                    <button class="tour-btn" onclick="virtualTourManager.startTour('deluxe')">Deluxe Room</button>
                    <button class="tour-btn" onclick="virtualTourManager.startTour('spa')">Spa</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    navigateToTour(tourId) {
        const currentModal = document.querySelector('.virtual-tour-modal');
        if (currentModal) {
            currentModal.remove();
        }
        this.startTour(tourId);
    }
}

// Initialize all real-time features
const realTimeConfig = new RealTimeConfig();
const availabilityManager = new AvailabilityManager();
const pricingEngine = new DynamicPricingEngine();
const analyticsManager = new AnalyticsManager();
const currencyConverter = new CurrencyConverter();
const virtualTourManager = new VirtualTourManager();

// Export for global access
window.realTimeConfig = realTimeConfig;
window.availabilityManager = availabilityManager;
window.pricingEngine = pricingEngine;
window.analyticsManager = analyticsManager;
window.currencyConverter = currencyConverter;
window.virtualTourManager = virtualTourManager;

// Auto-start real-time features
document.addEventListener('DOMContentLoaded', () => {
    if (realTimeConfig.features.availabilityTicker) {
        availabilityManager.startTracking();
    }
    
    if (realTimeConfig.features.currencyConverter) {
        currencyConverter.updateRates();
        setInterval(() => currencyConverter.updateRates(), 300000); // Update every 5 minutes
    }
    
    if (realTimeConfig.features.analytics) {
        analyticsManager.trackPageView(window.location.pathname);
    }
});

// CSS for virtual tour (to be added to main CSS)
const virtualTourStyles = `
.virtual-tour-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tour-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 1000px;
    height: 80%;
    display: flex;
    flex-direction: column;
}

.tour-header {
    padding: 20px;
    border-bottom: 1px solid #ecf0f1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-tour {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
}

.tour-viewer {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.panorama-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.panorama-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hotspot {
    position: absolute;
    width: 30px;
    height: 30px;
    cursor: pointer;
    transform: translate(-50%, -50%);
}

.hotspot-pulse {
    width: 100%;
    height: 100%;
    background: #c9a96e;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.hotspot-label {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.hotspot:hover .hotspot-label {
    opacity: 1;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.tour-controls {
    padding: 20px;
    border-top: 1px solid #ecf0f1;
    display: flex;
    gap: 15px;
    justify-content: center;
}

.tour-btn {
    background: #c9a96e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tour-btn:hover {
    background: #2c3e50;
    transform: translateY(-2px);
}
`;

// Inject virtual tour styles
const tourStyleSheet = document.createElement('style');
tourStyleSheet.textContent = virtualTourStyles;
document.head.appendChild(tourStyleSheet);