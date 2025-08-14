# Railway_Reservation_System_Using_MongoDB
A modern, full-stack web application for railway ticket booking with secure user authentication, payment processing, and comprehensive booking management.

## 🌟 Features

### 🔐 Authentication System
- **User Registration** - Secure signup with validation
- **User Login** - Session-based authentication
- **Profile Management** - View and manage user profile
- **Password Security** - Secure password handling

### 🎫 Booking Management
- **Train Search & Selection** - Browse available trains
- **Real-time Booking** - Instant ticket booking with seat confirmation
- **Passenger Information** - Comprehensive passenger details management
- **Multiple Train Classes** - Support for different reservation types (AC, Sleeper, etc.)

### 💳 Payment System
- **Secure Payments** - Integrated payment processing
- **Payment History** - Complete transaction history tracking
- **Random Pricing** - Dynamic pricing system
- **Payment Confirmation** - Instant booking confirmation

### 📊 User Dashboard
- **Past Tickets** - View all previous bookings
- **Payment History** - Complete payment transaction records
- **Profile Overview** - User information display

## 🛠️ Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup language
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **JavaScript** - Client-side functionality
- **Font Awesome** - Icon library

### Database Collections
- `profile` - User account information
- `train` - Train details and routes
- `passenger` - Passenger information
- `payment` - Payment transaction records
- `tickets` - Booking and ticket information

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### 📁 Project Structure
Mini_Project/
server.js
public/
login.html 
signup.html 
dashboard.html 
style.css 
styledash.css 
auth-style.css 
script.js 
signup.js 
scriptdash.js 
  
## 🔧 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /profile/:userid` - Get user profile

### Booking System
- `GET /train` - Get all available trains
- `POST /book_ticket` - Book a new ticket
- `GET /passenger_status/:userid` - Check passenger information

### History & Records
- `GET /past_tickets/:userid` - Get user's booking history
- `GET /payment_history/:userid` - Get payment transaction history

### Static Routes
- `GET /` - Login page
- `GET /signup` - Registration page  
- `GET /dashboard` - Main dashboard

## 🎨 UI/UX Features

### Modern Design
- **Responsive Layout** - Works on all devices
- **Professional Styling** - Clean, modern interface
- **Smooth Animations** - Enhanced user experience
- **Consistent Theming** - Cohesive design system

### User Experience
- **Intuitive Navigation** - Easy-to-use interface
- **Form Validation** - Real-time input validation
- **Loading States** - Visual feedback for operations
- **Error Handling** - User-friendly error messages

## 📱 Screenshots

### Login Page
<img width="1879" height="833" alt="image" src="https://github.com/user-attachments/assets/4d2f00cb-c185-41ac-ad23-334ae6eca679" />

### Dashboard
<img width="1859" height="845" alt="image" src="https://github.com/user-attachments/assets/7c062d06-f20b-4383-9130-fb69d359d51f" />


### Booking Form
<img width="1879" height="862" alt="image" src="https://github.com/user-attachments/assets/a3ea3188-d1a5-4453-9012-eaf7cce96970" />


### Payment History
<img width="1847" height="837" alt="image" src="https://github.com/user-attachments/assets/844a95f4-09bc-4b33-9f2d-a9e65d3dae90" />


## 🔒 Security Features

- **Input Validation** - Server-side validation for all inputs
- **Session Management** - Secure user session handling
- **CORS Configuration** - Controlled cross-origin requests

## 🚧 Future Enhancements

- [ ] **Email Notifications** - Booking confirmation emails
- [ ] **SMS Integration** - Ticket details via SMS
- [ ] **Advanced Search** - Filter trains by time, price, etc.
- [ ] **Seat Selection** - Visual seat selection interface
- [ ] **Multiple Payment Gateways** - PayPal, Stripe integration
- [ ] **Admin Panel** - Train and user management
- [ ] **Real-time Updates** - Live train status updates
- [ ] **Mobile App** - React Native mobile application

## 🙏 Acknowledgments

- **MongoDB** - For the flexible NoSQL database
- **Express.js** - For the robust web framework
- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For the modern typography

**Project Link** -https://github.com/Pranav-Mohandas/Railway_Reservation_System_Using_MongoDB
