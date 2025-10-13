# AXG E-commerce Platform

A modern, full-stack e-commerce platform built with React, TypeScript, and Node.js, specializing in camera accessories and photography equipment.

## 🚀 Features

### Frontend (React + TypeScript)

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Product Catalog**: Browse and search photography equipment
- **Wishlist System**: Save favorite products with localStorage persistence
- **User Authentication**: Secure login/signup system
- **Profile Management**: Update user information and change passwords
- **Product Reviews**: View and manage product reviews
- **Admin Dashboard**: Comprehensive admin panel for managing products, users, and reviews
- **Responsive Design**: Mobile-first approach with smooth animations

### Backend (Node.js + Express)

- **RESTful API**: Complete API for products, users, and reviews
- **MongoDB Integration**: Robust data persistence
- **File Upload**: Image handling for product photos
- **Authentication**: JWT-based secure authentication
- **Admin Features**: User and product management capabilities
- **Rate Limiting**: API protection and security measures

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lisura123/AXG.git
   cd AXG
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**

   - Create `.env` file in the backend directory
   - Add your MongoDB connection string and JWT secret:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

5. **Start the Application**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm start
   ```

   **Frontend (Terminal 2):**

   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Visit** `http://localhost:5173` for the frontend
2. **API** available at `http://localhost:3001`
3. **Create an account** or login with existing credentials
4. **Browse products** in the catalog
5. **Add items** to your wishlist
6. **Leave reviews** for products you've purchased
7. **Admin users** can access the admin dashboard

## 📁 Project Structure

```
AXG/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── contexts/          # React Context providers
│   ├── lib/               # Utility functions and API calls
│   └── ...
├── backend/               # Backend source code
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API route definitions
│   ├── middleware/       # Custom middleware
│   └── ...
├── public/               # Static assets
└── ...
```

## 🔧 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (development)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

- **GitHub**: [@Lisura123](https://github.com/Lisura123)
- **Repository**: [AXG](https://github.com/Lisura123/AXG)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**AXG** - Your trusted source for camera accessories and photography equipment.
