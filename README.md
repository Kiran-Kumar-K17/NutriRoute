# NutriRoute 🍔📍

A full-stack food delivery application that connects customers with restaurants, manages orders in real-time, and enables delivery tracking with live location updates.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Installation & Running](#installation--running)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Real-time Features](#real-time-features)
- [Configuration](#configuration)

---

## 🎯 Project Overview

NutriRoute is a comprehensive food delivery platform built with modern web technologies. It enables:

- **Customers** to browse restaurants and foods, place orders, and track deliveries in real-time
- **Restaurants** to manage their menu and receive orders
- **Delivery Partners** to accept and complete deliveries with live location tracking
- **Real-time Communication** between all parties using WebSockets

---

## ✨ Features

### Customer Features

- User registration and authentication with JWT
- Browse restaurants and food items with images
- Search and filter functionality
- Place orders with multiple items
- Real-time order tracking with delivery partner location
- Address management
- Order history

### Restaurant Features

- Manage restaurant profile and information
- Upload restaurant images (via Cloudinary)
- Add and manage food menu items with images and pricing
- View incoming orders
- Update order status

### Delivery Features

- Accept delivery assignments
- Real-time location tracking via WebSockets
- Navigate to delivery locations using integrated maps (Leaflet)
- Update delivery status

### Additional Features

- Secure payment integration (Razorpay)
- Real-time WebSocket communication for order updates and location tracking
- JWT-based authentication and authorization
- Image management via Cloudinary
- Responsive design with Leaflet maps for location tracking

---

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Real-time**: Socket.io v4.8.3
- **File Upload**: Multer v2.1.1
- **Image Storage**: Cloudinary
- **Payment**: Razorpay
- **CORS**: CORS middleware for cross-origin requests
- **Environment**: dotenv for configuration management

### Frontend

- **Framework**: React 19.2.6 with Vite
- **Styling**: Custom CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client v4.8.3
- **Maps**: Leaflet + react-leaflet for location tracking
- **Linting**: ESLint
- **Build Tool**: Vite

---

## 📁 Project Structure

```
NutriRoute/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── db.js              # MongoDB connection
│   │   └── razorpay.js        # Razorpay payment setup
│   ├── controllers/           # Business logic
│   │   ├── user.controller.js
│   │   ├── restaurant.controller.js
│   │   ├── food.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   └── delivery.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT verification
│   │   └── upload.middleware.js # File upload handling
│   ├── models/                # Database schemas
│   │   ├── user.model.js
│   │   ├── restaurant.model.js
│   │   ├── food.model.js
│   │   └── order.model.js
│   ├── routes/                # API endpoints
│   │   ├── user.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── food.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   └── delivery.routes.js
│   ├── utils/
│   │   ├── jwt.js             # JWT utilities
│   │   ├── socket.js          # WebSocket handlers
│   │   ├── uploadToCloudinary.js
│   │   └── deleteFromCloudinary.js
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── package.json
│   └── env-example.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Axios instance with base URL
│   │   ├── components/        # Reusable React components
│   │   ├── context/           # React Context for state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/
│   │   │   ├── leafletIcon.js # Leaflet map configuration
│   │   │   └── socket.js      # Socket.io client setup
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Main page displaying foods
│   │   │   └── TrackOrder.jsx # Order tracking page
│   │   ├── styles/
│   │   │   └── HomePage.css
│   │   ├── App.jsx
│   │   └── main.jsx           # React entry point
│   ├── public/                # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

### Required Services/Accounts

1. **MongoDB**: Database service (local or cloud)
2. **Cloudinary**: Image hosting service (sign up at [cloudinary.com](https://cloudinary.com))
3. **Razorpay**: Payment gateway (sign up at [razorpay.com](https://razorpay.com))
4. **JWT Secret**: Any strong string for token signing

---

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nutriroute?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Configuration
PORT=8000
NODE_ENV=development
```

Reference: See `backend/env-example.txt` for the template.

### Frontend Configuration

The frontend is configured to connect to:

- **Backend API**: `http://localhost:8000/api`
- **Socket.io Server**: `http://localhost:8000`

These are defined in:

- `frontend/src/api/axios.js` (API base URL)
- `frontend/src/lib/socket.js` (Socket.io connection)

---

## 📦 Installation & Running

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with variables (see Environment Setup above)

4. Run development server:

```bash
npm run dev
```

Or production server:

```bash
npm start
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Open browser to `http://localhost:5173`

### Build Frontend for Production

```bash
npm run build
```

---

## 🔌 API Endpoints

### User Routes (`/api/users`)

- `POST /register` - Register new user
- `POST /login` - User login

### Restaurant Routes (`/api/restaurants`)

- `POST /` - Create restaurant
- `GET /` - Get all restaurants
- `GET /:id` - Get restaurant details
- `PUT /:id` - Update restaurant
- `DELETE /:id` - Delete restaurant

### Food Routes (`/api/foods`)

- `POST /` - Add new food item
- `GET /getAll` - Get all foods (populated with restaurant info)
- `GET /:id` - Get food details
- `PUT /:id` - Update food item
- `DELETE /:id` - Delete food item
- `GET /restaurant/:restaurantId` - Get foods by restaurant

### Order Routes (`/api/orders`)

- `POST /create` - Create new order (requires auth)
- `PATCH /:orderId/status` - Update order status (requires auth)
- `GET /:orderId/tracking` - Get order tracking info (requires auth)
- `PATCH /:orderId/assign-delivery` - Assign delivery partner (requires auth)

### Payment Routes (`/api/payments`)

- Payment processing endpoints for Razorpay integration

### Delivery Routes (`/api/delivery`)

- Delivery partner related endpoints

---

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String (10 digits),
  role: Enum["customer", "restaurant", "delivery"],
  address: {
    street: String,
    village: String,
    city: String,
    pincode: String
  },
  currentLocation: {
    lat: Number,
    lon: Number
  }
}
```

### Restaurant Model

```javascript
{
  name: String,
  description: String,
  image: String (Cloudinary URL),
  imagePublicId: String,
  phone: String (unique),
  email: String (unique),
  address: {
    street: String,
    area: String,
    city: String,
    state: String
  },
  location: {
    lat: Number,
    lon: Number
  }
}
```

### Food Model

```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String (Cloudinary URL),
  imagePublicId: String,
  category: String,
  restaurantId: ObjectId (ref: Restaurant),
  stock: Number
}
```

### Order Model

```javascript
{
  userId: ObjectId (ref: User),
  restaurantId: ObjectId (ref: Restaurant),
  items: [{
    foodId: ObjectId (ref: Food),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  deliveryAddress: {
    street: String,
    village: String,
    city: String,
    pincode: String
  },
  status: Enum["pending", "confirmed", "preparing", "ready", "delivering", "delivered"],
  deliveryPartner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Real-time Features

### WebSocket Events (Socket.io)

The application uses WebSockets for real-time communication:

**Order Room Joining**

- `join-order-room` - Join specific order room for updates
  ```javascript
  socket.emit("join-order-room", orderId);
  ```

**Location Tracking**

- `location-update` - Send delivery partner's live location
  ```javascript
  socket.emit("location-update", {
    orderId: string,
    latitude: number,
    longitude: number,
  });
  ```

**Order Status Updates**

- `order-status-update` - Receive real-time order status changes

**Connected Delivery Partners**

- Real-time notification when delivery partner accepts order
- Live location broadcast to customer

The Socket.io server is configured with CORS to accept connections from `http://localhost:5173`.

---

## ⚙️ Configuration

### Cloudinary Integration

- Used for storing restaurant and food item images
- Configured in `backend/config/cloudinary.js`
- Images are uploaded to Cloudinary and URLs are stored in database

### Razorpay Integration

- Payment processing configured in `backend/config/razorpay.js`
- Handles secure payment transactions

### Authentication

- JWT tokens used for secure API endpoints
- Token verification middleware in `backend/middleware/auth.middleware.js`
- Protected routes require `Authorization: Bearer <token>` header

### CORS Configuration

- Backend allows requests from `http://localhost:5173` (frontend)
- Socket.io configured with CORS for WebSocket connections

---

## 📝 Development Notes

- **State Management**: Frontend uses React Context (see `frontend/src/context/`)
- **Custom Hooks**: Check `frontend/src/hooks/` for reusable logic
- **Map Integration**: Leaflet maps with custom icons for real-time delivery tracking
- **Error Handling**: Comprehensive error handling in controllers and middleware
- **Modular Architecture**: Clean separation of concerns with controllers, routes, models

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

## 📜 License

ISC License

---

## 👨‍💻 Author

NutriRoute Development Team

---

## 🎓 Getting Help

For issues or questions:

1. Check the existing code documentation
2. Review environment variable setup
3. Ensure all services (MongoDB, Cloudinary, Razorpay) are properly configured
4. Check browser console and backend logs for error messages

Happy coding! 🚀
