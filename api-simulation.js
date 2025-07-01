// API Simulation for Rosemary Haven Resort
// Simulates backend functionality for frontend demonstration

class APISimulation {
    constructor() {
        this.baseURL = '/api';
        this.delay = 500; // Simulate network delay
        this.bookings = this.loadBookings();
        this.reviews = this.generateReviews();
        this.availability = this.generateAvailability();
        this.weather = this.generateWeather();
        this.analytics = this.initializeAnalytics();
    }

    // Simulate API delay
    async simulateDelay(data, customDelay = null) {
        const delay = customDelay || this.delay;
        return new Promise(resolve => {
            setTimeout(() => resolve(data), delay);
        });
    }

    // Booking API
    async createBooking(bookingData) {
        try {
            const booking = {
                id: 'RH' + Date.now().toString().slice(-6),
                ...bookingData,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
                totalAmount: this.calculateTotalAmount(bookingData),
                confirmationNumber: this.generateConfirmationNumber()
            };

            this.bookings.push(booking);
            this.saveBookings();

            return await this.simulateDelay({
                success: true,
                data: booking,
                message: 'Booking created successfully'
            });
        } catch (error) {
            return await this.simulateDelay({
                success: false,
                error: error.message
            });
        }
    }

    async getBooking(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        
        if (booking) {
            return await this.simulateDelay({
                success: true,
                data: booking
            });
        } else {
            return await this.simulateDelay({
                success: false,
                error: 'Booking not found'
            });
        }
    }

    async updateBooking(bookingId, updateData) {
        const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
        
        if (bookingIndex !== -1) {
            this.bookings[bookingIndex] = {
                ...this.bookings[bookingIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            
            this.saveBookings();
            
            return await this.simulateDelay({
                success: true,
                data: this.bookings[bookingIndex],
                message: 'Booking updated successfully'
            });
        } else {
            return await this.simulateDelay({
                success: false,
                error: 'Booking not found'
            });
        }
    }

    async cancelBooking(bookingId) {
        return await this.updateBooking(bookingId, { 
            status: 'cancelled',
            cancelledAt: new Date().toISOString()
        });
    }

    // Availability API
    async checkAvailability(checkin, checkout, roomType = null) {
        const availability = this.generateRoomAvailability(checkin, checkout, roomType);
        
        return await this.simulateDelay({
            success: true,
            data: availability
        });
    }

    async getRealTimeAvailability() {
        return await this.simulateDelay({
            success: true,
            data: this.availability
        });
    }

    // Pricing API
    async getPricing(roomType, checkin, checkout, guests = 2) {
        const pricing = this.calculateDynamicPricing(roomType, checkin, checkout, guests);
        
        return await this.simulateDelay({
            success: true,
            data: pricing
        });
    }

    async getBestRates(checkin, checkout, guests = 2) {
        const roomTypes = ['deluxe', 'suite', 'villa', 'presidential'];
        const rates = {};
        
        for (const roomType of roomTypes) {
            rates[roomType] = this.calculateDynamicPricing(roomType, checkin, checkout, guests);
        }
        
        return await this.simulateDelay({
            success: true,
            data: rates
        });
    }

    // Reviews API
    async getReviews(limit = 10, offset = 0) {
        const paginatedReviews = this.reviews.slice(offset, offset + limit);
        
        return await this.simulateDelay({
            success: true,
            data: {
                reviews: paginatedReviews,
                total: this.reviews.length,
                limit,
                offset
            }
        });
    }

    async submitReview(reviewData) {
        const review = {
            id: Date.now().toString(),
            ...reviewData,
            createdAt: new Date().toISOString(),
            verified: false,
            helpful: 0
        };

        this.reviews.unshift(review);
        
        return await this.simulateDelay({
            success: true,
            data: review,
            message: 'Review submitted successfully'
        });
    }

    // Weather API
    async getWeather() {
        return await this.simulateDelay({
            success: true,
            data: this.weather
        });
    }

    // Chat API
    async sendChatMessage(message, sessionId) {
        const response = this.generateChatResponse(message);
        
        return await this.simulateDelay({
            success: true,
            data: {
                message: response,
                timestamp: new Date().toISOString(),
                type: 'bot'
            }
        });
    }

    // Analytics API
    async trackEvent(eventData) {
        this.analytics.events.push({
            ...eventData,
            timestamp: new Date().toISOString()
        });
        
        return await this.simulateDelay({
            success: true,
            message: 'Event tracked successfully'
        });
    }

    async getAnalytics(dateRange = '7d') {
        const analytics = this.generateAnalyticsData(dateRange);
        
        return await this.simulateDelay({
            success: true,
            data: analytics
        });
    }

    // Helper Methods
    calculateTotalAmount(bookingData) {
        const pricing = this.calculateDynamicPricing(
            bookingData.roomType,
            bookingData.checkin,
            bookingData.checkout,
            bookingData.guests
        );
        
        const subtotal = pricing.totalPrice;
        const taxes = Math.floor(subtotal * 0.15);
        const fees = Math.floor(subtotal * 0.05);
        
        return {
            subtotal,
            taxes,
            fees,
            total: subtotal + taxes + fees
        };
    }

    generateConfirmationNumber() {
        return 'RH' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    calculateDynamicPricing(roomType, checkin, checkout, guests) {
        const basePrices = {
            deluxe: 89700,
            suite: 149700,
            villa: 269700,
            presidential: 479700
        };

        const basePrice = basePrices[roomType] || basePrices.deluxe;
        const nights = this.calculateNights(checkin, checkout);
        
        if (nights <= 0) return null;

        // Apply dynamic factors
        let multiplier = 1.0;
        
        // Seasonal adjustment
        const checkinDate = new Date(checkin);
        const month = checkinDate.getMonth();
        if ([11, 0, 6, 7].includes(month)) multiplier *= 1.3; // Peak season
        else if ([2, 3, 8, 9].includes(month)) multiplier *= 1.1; // Shoulder
        else multiplier *= 0.9; // Low season
        
        // Weekend premium
        const dayOfWeek = checkinDate.getDay();
        if ([5, 6].includes(dayOfWeek)) multiplier *= 1.2;
        
        // Advance booking discount
        const daysInAdvance = Math.ceil((checkinDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysInAdvance >= 30) multiplier *= 0.85;
        else if (daysInAdvance >= 14) multiplier *= 0.95;
        else if (daysInAdvance <= 3) multiplier *= 1.15;
        
        // Occupancy-based pricing
        const occupancy = Math.random();
        if (occupancy > 0.8) multiplier *= 1.2;
        else if (occupancy < 0.3) multiplier *= 0.9;

        const adjustedPrice = Math.round(basePrice * multiplier);
        const totalPrice = adjustedPrice * nights;
        
        return {
            roomType,
            basePrice,
            adjustedPrice,
            totalPrice,
            nights,
            multiplier: Math.round(multiplier * 100) / 100,
            savings: basePrice > adjustedPrice ? (basePrice - adjustedPrice) * nights : 0
        };
    }

    calculateNights(checkin, checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        return Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    }

    generateRoomAvailability(checkin, checkout, roomType) {
        const availability = {};
        const roomTypes = roomType ? [roomType] : ['deluxe', 'suite', 'villa', 'presidential'];
        
        roomTypes.forEach(type => {
            const total = { deluxe: 50, suite: 30, villa: 15, presidential: 5 }[type];
            const booked = Math.floor(Math.random() * total * 0.7);
            const available = total - booked;
            
            availability[type] = {
                total,
                booked,
                available,
                status: available > total * 0.3 ? 'available' : available > 0 ? 'limited' : 'unavailable'
            };
        });
        
        return availability;
    }

    generateReviews() {
        const reviews = [];
        const names = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Rodriguez', 'Lisa Thompson', 'James Wilson', 'Maria Garcia', 'Robert Brown', 'Jennifer Davis', 'Christopher Lee'];
        const countries = ['United States', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'Singapore', 'India', 'Sri Lanka'];
        const reviewTexts = [
            'Absolutely stunning resort with impeccable service. The staff went above and beyond to make our stay memorable.',
            'The most luxurious experience we\'ve ever had. Every detail was perfect, from the room to the dining.',
            'Breathtaking views and world-class amenities. The spa treatments were divine and the food was exceptional.',
            'A true paradise on earth. The private villa exceeded all our expectations. Will definitely return!',
            'Outstanding hospitality and attention to detail. The concierge team made our vacation effortless.',
            'The perfect blend of luxury and comfort. The infinity pool and sunset views were absolutely magical.',
            'Exceptional service from check-in to check-out. The room was spacious and beautifully appointed.',
            'An unforgettable experience. The resort\'s commitment to excellence is evident in every aspect.',
            'The finest resort we\'ve stayed at. The butler service and personalized attention were remarkable.',
            'A slice of heaven. The peaceful atmosphere and luxury amenities made for a perfect getaway.'
        ];

        for (let i = 0; i < 50; i++) {
            reviews.push({
                id: (i + 1).toString(),
                guestName: names[Math.floor(Math.random() * names.length)],
                country: countries[Math.floor(Math.random() * countries.length)],
                rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                title: 'Exceptional Experience',
                review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
                roomType: ['deluxe', 'suite', 'villa', 'presidential'][Math.floor(Math.random() * 4)],
                stayDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                verified: true,
                helpful: Math.floor(Math.random() * 20)
            });
        }

        return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    generateAvailability() {
        return {
            deluxe: {
                total: 50,
                available: Math.floor(Math.random() * 20) + 10,
                status: 'available'
            },
            suite: {
                total: 30,
                available: Math.floor(Math.random() * 15) + 5,
                status: 'available'
            },
            villa: {
                total: 15,
                available: Math.floor(Math.random() * 8) + 2,
                status: 'limited'
            },
            presidential: {
                total: 5,
                available: Math.floor(Math.random() * 3) + 1,
                status: 'limited'
            }
        };
    }

    generateWeather() {
        const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            temperature: Math.floor(Math.random() * 10) + 25,
            condition,
            humidity: Math.floor(Math.random() * 30) + 60,
            windSpeed: Math.floor(Math.random() * 15) + 5,
            forecast: this.generateForecast()
        };
    }

    generateForecast() {
        const forecast = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            forecast.push({
                date: date.toISOString().split('T')[0],
                high: Math.floor(Math.random() * 8) + 28,
                low: Math.floor(Math.random() * 8) + 22,
                condition: ['sunny', 'partly-cloudy', 'cloudy'][Math.floor(Math.random() * 3)]
            });
        }
        return forecast;
    }

    generateChatResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            'hello': 'Hello! Welcome to Rosemary Haven Resort. How may I assist you today?',
            'booking': 'I\'d be happy to help you with your booking. What dates are you looking to stay with us?',
            'price': 'Our room rates start from Rs. 89,700 per night. Would you like me to check availability for specific dates?',
            'amenities': 'We offer world-class amenities including our award-winning spa, infinity pool, fine dining restaurants, and 24/7 concierge service. What would you like to know more about?',
            'spa': 'Our wellness spa offers a range of treatments including Ayurvedic therapies, massages, and holistic wellness programs. Would you like to book a treatment?',
            'restaurant': 'We have several dining options including our Michelin-starred restaurant, rooftop bar, and beachside grill. What type of cuisine interests you?',
            'location': 'Rosemary Haven Resort is located in Paradise Valley, Colombo, offering stunning ocean views and easy access to local attractions.',
            'transport': 'We offer luxury airport transfers, helicopter services, and can arrange local transportation. How can we assist with your travel needs?',
            'cancel': 'I can help you with cancellations. Please provide your booking reference number and I\'ll assist you with the process.',
            'weather': `The current weather is ${this.weather.temperature}°C and ${this.weather.condition}. Perfect for enjoying our outdoor amenities!`
        };

        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        return 'Thank you for your message. Our concierge team will be happy to assist you. Is there anything specific about your stay that I can help you with?';
    }

    initializeAnalytics() {
        return {
            events: [],
            sessions: [],
            pageViews: 0,
            bookingConversions: 0,
            averageSessionDuration: 0
        };
    }

    generateAnalyticsData(dateRange) {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const data = {
            pageViews: Math.floor(Math.random() * 1000) + 500,
            uniqueVisitors: Math.floor(Math.random() * 500) + 200,
            bookingConversions: Math.floor(Math.random() * 50) + 20,
            averageSessionDuration: Math.floor(Math.random() * 300) + 180,
            topPages: [
                { page: '/rooms', views: Math.floor(Math.random() * 200) + 100 },
                { page: '/amenities', views: Math.floor(Math.random() * 150) + 80 },
                { page: '/gallery', views: Math.floor(Math.random() * 120) + 60 },
                { page: '/contact', views: Math.floor(Math.random() * 100) + 50 }
            ],
            dailyStats: []
        };

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            data.dailyStats.unshift({
                date: date.toISOString().split('T')[0],
                pageViews: Math.floor(Math.random() * 100) + 50,
                bookings: Math.floor(Math.random() * 10) + 2
            });
        }

        return data;
    }

    // Local Storage Methods
    loadBookings() {
        const stored = localStorage.getItem('rosemary_bookings');
        return stored ? JSON.parse(stored) : [];
    }

    saveBookings() {
        localStorage.setItem('rosemary_bookings', JSON.stringify(this.bookings));
    }

    // Public API Methods
    async api(endpoint, method = 'GET', data = null) {
        const [resource, action] = endpoint.split('/').filter(Boolean);
        
        try {
            switch (resource) {
                case 'booking':
                    return await this.handleBookingAPI(action, method, data);
                case 'availability':
                    return await this.handleAvailabilityAPI(action, method, data);
                case 'pricing':
                    return await this.handlePricingAPI(action, method, data);
                case 'reviews':
                    return await this.handleReviewsAPI(action, method, data);
                case 'weather':
                    return await this.getWeather();
                case 'chat':
                    return await this.handleChatAPI(action, method, data);
                case 'analytics':
                    return await this.handleAnalyticsAPI(action, method, data);
                default:
                    throw new Error('Unknown API endpoint');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async handleBookingAPI(action, method, data) {
        switch (method) {
            case 'POST':
                return await this.createBooking(data);
            case 'GET':
                return action ? await this.getBooking(action) : { success: false, error: 'Booking ID required' };
            case 'PUT':
                return action ? await this.updateBooking(action, data) : { success: false, error: 'Booking ID required' };
            case 'DELETE':
                return action ? await this.cancelBooking(action) : { success: false, error: 'Booking ID required' };
            default:
                throw new Error('Unsupported method');
        }
    }

    async handleAvailabilityAPI(action, method, data) {
        if (action === 'check') {
            return await this.checkAvailability(data.checkin, data.checkout, data.roomType);
        } else {
            return await this.getRealTimeAvailability();
        }
    }

    async handlePricingAPI(action, method, data) {
        if (action === 'best-rates') {
            return await this.getBestRates(data.checkin, data.checkout, data.guests);
        } else {
            return await this.getPricing(data.roomType, data.checkin, data.checkout, data.guests);
        }
    }

    async handleReviewsAPI(action, method, data) {
        switch (method) {
            case 'GET':
                return await this.getReviews(data?.limit, data?.offset);
            case 'POST':
                return await this.submitReview(data);
            default:
                throw new Error('Unsupported method');
        }
    }

    async handleChatAPI(action, method, data) {
        if (method === 'POST') {
            return await this.sendChatMessage(data.message, data.sessionId);
        }
        throw new Error('Unsupported method');
    }

    async handleAnalyticsAPI(action, method, data) {
        switch (method) {
            case 'POST':
                return await this.trackEvent(data);
            case 'GET':
                return await this.getAnalytics(data?.dateRange);
            default:
                throw new Error('Unsupported method');
        }
    }
}

// Initialize API simulation
const apiSimulation = new APISimulation();

// Export for global access
window.apiSimulation = apiSimulation;

// Create a fetch-like interface for the simulated API
window.hotelAPI = {
    async get(endpoint, params = {}) {
        const queryString = Object.keys(params).length ? 
            '?' + new URLSearchParams(params).toString() : '';
        return await apiSimulation.api(endpoint + queryString, 'GET', params);
    },
    
    async post(endpoint, data) {
        return await apiSimulation.api(endpoint, 'POST', data);
    },
    
    async put(endpoint, data) {
        return await apiSimulation.api(endpoint, 'PUT', data);
    },
    
    async delete(endpoint) {
        return await apiSimulation.api(endpoint, 'DELETE');
    }
};

console.log('Hotel API Simulation initialized. Use window.hotelAPI for API calls.');