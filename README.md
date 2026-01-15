# Sasha E-Commerce Platform 🛍️

A modern, full-stack **eCommerce web application** built for a clothing brand, delivering a sophisticated and seamless shopping experience. This platform features an elegant user interface, comprehensive admin controls, secure payment processing, and real-time data synchronization.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Usage Guide](#-usage-guide)
- [Admin Panel](#-admin-panel)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**Sasha-Ecom** is a production-ready eCommerce platform designed and developed from the ground up. The application combines modern web technologies with elegant UI/UX design to create an engaging shopping experience that drives user engagement and conversions.

### Key Highlights

✨ **Minimalist Design** - Clean, editorial-style interface with smooth animations  
🔐 **Secure Authentication** - Firebase Auth with email/password and Google sign-in  
📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop devices  
⚡ **Real-time Sync** - Live cart and wishlist updates across devices  
💳 **Payment Integration** - Secure payment processing with status tracking  
🎯 **Advanced Filtering** - Multi-category filtering with dynamic price ranges  
📊 **Admin Dashboard** - Comprehensive product, order, and customer management  

---

## ✨ Features

### 🛍️ Customer-Facing Features

#### **Product Discovery & Browsing**
- **Product Listings** with grid layout and elegant card designs
- **Advanced Search** with real-time suggestions and fuzzy matching
- **Smart Filtering** by category, price range, and sorting options
- **Product Details** page with image gallery, variant selection, and reviews
- **Related Products** suggestions based on category
- **Wishlist/Curation** functionality with heart icon toggle
- **Product Reviews** with rating display and user feedback

#### **Shopping Experience**
- **Shopping Cart** with quantity management and real-time price calculations
- **Guest Cart** support with localStorage persistence
- **User Cart** synchronized with Firebase Firestore for logged-in users
- **Wishlist Management** with add/remove functionality
- **Price Display** showing MRP, sale price, and discounts
- **Stock Information** and availability indicators

#### **Checkout & Payments**
- **Multi-step Checkout** process with progress indication
- **Address Management** - Add, edit, and select shipping addresses
- **Payment Gateway** integration with secure processing
- **Cash on Delivery (COD)** option
- **Order Confirmation** with detailed order summary
- **Payment Status** tracking and verification
- **Email Notifications** for order updates

#### **User Authentication & Accounts**
- **User Registration** with email/password
- **Google Sign-In** for quick authentication
- **Profile Management** with user information
- **Order History** tracking with detailed order views
- **Address Book** for saved shipping addresses
- **Session Management** with persistent login

#### **Additional Features**
- **Smooth Scrolling** with Lenis integration
- **Page Transitions** and micro-animations with Framer Motion
- **Toast Notifications** for user feedback
- **Responsive Navigation** with mobile hamburger menu
- **Store Locator** page for physical locations
- **Policy Pages** - Shipping, Privacy, Terms & Conditions, Refund

---

### 🧑‍💼 Admin Panel Features

#### **Product Management**
- **Add Products** with multiple variants and images
- **Edit Products** with real-time updates
- **Delete Products** with confirmation dialogs
- **Variant Management** - Colors, sizes, and stock levels
- **Category Organization** for better product classification
- **Bulk Operations** for efficient management

#### **Order Management**
- **View All Orders** in a comprehensive dashboard
- **Order Status Updates** - Pending, Processing, Shipped, Delivered
- **Order Details** with customer information and items
- **Payment Status** tracking
- **Order Timeline** with date and status history
- **Search & Filter** orders by status, date, customer

#### **Customer Management**
- **Customer List** with registration dates
- **Customer Details** including email and order history
- **Recent Activity** tracking
- **User Analytics** for insights

#### **Dashboard Analytics**
- **Collection Management** for featured product groups
- **Visual Dashboard** with key metrics
- **Real-time Updates** from Firestore

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19, React Router DOM 7 |
| **Styling** | Tailwind CSS 4, Custom CSS |
| **Backend/Database** | Firebase 12 (Firestore, Auth, Analytics) |
| **State Management** | React Context API (Cart, Wishlist, Auth, Data) |
| **Animations** | Framer Motion 12, Lenis Smooth Scroll |
| **UI Components** | Lucide React (Icons), React Toastify |
| **Build Tool** | Vite 7 |
| **Code Quality** | ESLint 9 |
| **Utilities** | date-fns, uuid |
| **Payment** | Custom Payment Gateway Integration |

---

## 📁 Project Structure

```
sasha_e_com/
├── public/
│   └── 404.jsx                  # Custom 404 page component
│
├── src/
│   ├── Admin/                   # Admin Panel Components
│   │   ├── AdminPanel.jsx       # Main admin dashboard
│   │   ├── Collection.jsx       # Featured collections manager
│   │   ├── CustomerList.jsx     # Customer management
│   │   ├── DashboardView.jsx    # Admin dashboard overview
│   │   ├── OrdersView.jsx       # Order management interface
│   │   └── ProductView.jsx      # Product CRUD operations
│   │
│   ├── assets/                  # Static images and media
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── auth/
│   │   │   ├── Login/
│   │   │   │   └── index.jsx    # Login page
│   │   │   └── Register/
│   │   │       └── index.jsx    # Registration page
│   │   ├── checkout/            # Checkout related components
│   │   ├── home/
│   │   │   └── HotSale.jsx      # Hot sale section
│   │   ├── shop/                # Shop page components
│   │   ├── CarouselCategory.jsx # Category carousel
│   │   ├── Cart.jsx             # Shopping cart page
│   │   ├── Checkout.jsx         # Checkout process
│   │   ├── CodCheckout.jsx      # Cash on Delivery checkout
│   │   ├── Discover.jsx         # Discovery section
│   │   ├── Footer.jsx           # Site footer
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Hero.jsx             # Hero section
│   │   ├── InstagramFeed.jsx    # Instagram integration
│   │   ├── InstagramSection.jsx # Instagram showcase
│   │   ├── MoreLikeProducts.jsx # Related products
│   │   ├── NewInSection.jsx     # New arrivals section
│   │   ├── ProductCard.jsx      # Product card component
│   │   ├── ProductDetails.jsx   # Product detail page
│   │   ├── ProfileContainer.jsx # User profile dropdown
│   │   ├── SaleSection.jsx      # Sale items section
│   │   └── WishList.jsx         # Wishlist page
│   │
│   ├── context/                 # React Context Providers
│   │   ├── AuthContext/
│   │   │   └── index.jsx        # Authentication context
│   │   ├── CartContext.jsx      # Shopping cart state
│   │   ├── Context.js           # Data context
│   │   ├── DataContext.jsx      # Global data provider
│   │   └── WishlistContext.jsx  # Wishlist state management
│   │
│   ├── firebase/                # Firebase Configuration
│   │   ├── auth.js              # Auth helper functions
│   │   └── firebaseConfig.jsx   # Firebase initialization
│   │
│   ├── pages/                   # Page Components
│   │   ├── Clothing/
│   │   │   ├── Accessories.jsx  # Accessories category
│   │   │   ├── Bottom.jsx       # Bottom wear category
│   │   │   ├── Inner.jsx        # Inner wear category
│   │   │   └── TopWear.jsx      # Top wear category
│   │   ├── Home/
│   │   │   └── Home.jsx         # Homepage
│   │   ├── Products/
│   │   │   └── ProductLists.jsx # Product listing page
│   │   ├── StoreLocation/
│   │   │   └── Location.jsx     # Store locator
│   │   ├── PaymentStatus.jsx    # Payment result page
│   │   ├── Privacy.jsx          # Privacy policy
│   │   ├── RefundPolicy.jsx     # Refund policy
│   │   ├── ShippingPolicy.jsx   # Shipping policy
│   │   ├── T&C.jsx              # Terms and conditions
│   │   └── UsersOrders.jsx      # User order history
│   │
│   ├── App.css                  # Global application styles
│   ├── App.jsx                  # Main app component with routing
│   ├── index.css                # Base styles
│   └── main.jsx                 # Application entry point
│
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── firebase.json                # Firebase hosting config
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies
├── README.md                    # Project documentation
└── vite.config.js               # Vite build configuration
```

---

## 🔧 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Firebase Account** (for backend services)
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/Varun2024/Sasha-ecom.git
cd sasha_e_com
```

### Step 2: Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### Step 3: Firebase Setup

1. Create a new project in [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firebase Authentication** (Email/Password and Google providers)
3. Create a **Firestore Database** in production mode
4. Set up the following Firestore collections:
   - `products` - Product catalog
   - `users` - User profiles with cart and wishlist
   - `orders` - Order records
   - `collections` - Featured product collections

5. Get your Firebase configuration from Project Settings

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```


### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_KEY` | Firebase API Key | Yes |
| `VITE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `VITE_PROJECT_ID` | Firebase Project ID | Yes |
| `VITE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `VITE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `VITE_APP_ID` | Firebase App ID | Yes |
| `VITE_MEASUREMENT_ID` | Firebase Analytics Measurement ID | Yes |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 📖 Usage Guide

### For Customers

1. **Browse Products** - Navigate to shop page or click categories
2. **Search** - Use the search bar in header for quick product discovery
3. **Add to Cart** - Click "Add to Cart" on product details page
4. **Wishlist** - Click heart icon to save items for later
5. **Checkout** - Review cart and proceed to checkout
6. **Account** - Register/Login to save cart across devices
7. **Payment** - Complete purchase with secure payment gateway or COD

### For Administrators

1. **Access Admin Panel** - Navigate to `/adminsasha`
2. **Manage Products** - Add, edit, or delete products with variants
3. **Process Orders** - View and update order statuses
4. **View Customers** - Monitor user registrations and activity
5. **Manage Collections** - Create featured product groups

---

## 🎨 Admin Panel

The admin panel provides comprehensive management capabilities:

### Access
Navigate to: `http://localhost:5173/adminsasha`

### Features
- **Dashboard** - Overview of store metrics
- **Product Management** - Full CRUD operations for products
- **Order Management** - View, filter, and update orders
- **Customer Insights** - User analytics and activity
- **Collection Curation** - Featured product collections

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed as a freelance project for a clothing brand. All rights reserved.

---

## 🙏 Acknowledgements

- **Client** - For trusting me with this project
- **Firebase** - For reliable backend infrastructure
- **React Community** - For excellent tools and libraries
- **Tailwind CSS** - For the utility-first CSS framework

---

## 📞 Contact & Support

For questions or support, please open an issue on GitHub.

---

**⭐ If this project helped or inspired you, feel free to star it!**
