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
- **Payment Gateways** - Multiple Payment Methods

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

```text
📁 Mini_Project/
│
├── 📄 server.js                 # Main backend server (Node.js + Express)
│
├── 📁 public/                   # Frontend files
│   ├── 📄 login.html             # Login page
│   ├── 📄 signup.html            # Signup page
│   ├── 📄 dashboard.html         # User dashboard
│   ├── 🎨 style.css              # Styles for login/signup pages
│   ├── 🎨 styledash.css          # Styles for dashboard
│   ├── 🎨 auth-style.css         # Additional authentication styles
│   ├── 📜 script.js              # Login functionality
│   ├── 📜 signup.js              # Signup functionality
│   └── 📜 scriptdash.js          # Dashboard functionality

```
### Dependencies 
```bash
npm init -y
npm install express cors mongodb
```

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
<img width="1626" height="843" alt="Screenshot 2025-08-02 103819" src="https://github.com/user-attachments/assets/a9c2c1dc-8436-41d2-9b99-702a316959f7" />


### Dashboard
<img width="1616" height="857" alt="Screenshot 2025-08-02 104044" src="https://github.com/user-attachments/assets/2c1a8c78-415e-4d80-872b-106dce0e988c" />



### Booking Form
<img width="1485" height="856" alt="Screenshot 2025-08-02 104140" src="https://github.com/user-attachments/assets/1df6c813-d300-45cf-b231-0aa55e3bfc82" />
<img width="1268" height="836" alt="Screenshot 2025-08-02 104230" src="https://github.com/user-attachments/assets/88036574-f31a-4d01-8ccc-9e20e9086cae" />

### Past Tickets
<img width="1199" height="778" alt="Screenshot 2025-08-02 104526" src="https://github.com/user-attachments/assets/1a77e94c-44e2-4eb2-a9ae-0c7832554d49" />

### Payment History
<img width="1182" height="834" alt="Screenshot 2025-08-02 104351" src="https://github.com/user-attachments/assets/a6b4042b-b4e7-484a-8eb7-a878a9f66794" />


## 🔒 Security Features

- **Input Validation** - Server-side validation for all inputs
- **Session Management** - Secure user session handling
- **CORS Configuration** - Controlled cross-origin requests

## 🚧 Future Enhancements

- [ ] **Email Notifications** - Booking confirmation emails
- [ ] **SMS Integration** - Ticket details via SMS
- [ ] **Advanced Search** - Filter trains by time, price, etc.
- [ ] **Seat Selection** - Visual seat selection interface
- [ ] **Admin Panel** - Train and user management
- [ ] **Real-time Updates** - Live train status updates
- [ ] **Mobile App** - React Native mobile application

## 🙏 Acknowledgments

- **MongoDB** - For the flexible NoSQL database
- **Express.js** - For the robust web framework
- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For the modern typography

**Project Link** -https://github.com/Pranav-Mohandas/Railway_Reservation_System_Using_MongoDB
