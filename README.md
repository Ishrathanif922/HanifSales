# Hanif Sales - Full Stack Multi-Vendor E-Commerce Platform

**Everything You Need, One Trusted Store**

A production-ready, modern, responsive, multi-vendor e-commerce platform built with Next.js, Express.js, TypeScript, MongoDB, and Tailwind CSS.

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** + Custom Theme
- **Framer Motion** (Animations)
- **React Hook Form** + **Zod** (Validation)
- **TanStack Query** (Data Fetching)
- **Axios** (HTTP Client)
- **Radix UI** (Components)
- **Lucide React** (Icons)

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **Stripe** Payments
- **Cloudinary** File Storage
- **Nodemailer** Emails

---

## Project Structure

```
hanif-sales/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Cloudinary, Stripe, Nodemailer
│   │   ├── controllers/     # Auth, Product, Order, Cart, Review, Admin, etc.
│   │   ├── middleware/      # Auth, Validation, Error Handler
│   │   ├── models/          # User, Product, Category, Order, Review, Coupon, etc.
│   │   ├── routes/          # All API routes
│   │   ├── validations/     # Zod schemas
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers, Tokens, Response
│   │   ├── types/           # TypeScript interfaces
│   │   ├── constants/       # App constants
│   │   └── seeds/           # Database seeding
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── (main)/      # Main storefront pages
│   │   │   └── (admin)/     # Admin dashboard pages
│   │   └── components/      # Reusable UI components
│   ├── components/          # Layout, Product, Cart components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities, Constants
│   ├── services/            # API service layer
│   ├── store/               # React Context state management
│   ├── types/               # TypeScript types
│   └── config/              # App configuration
```

---

## Features

### Authentication & Authorization
- JWT with refresh tokens
- Email/password registration & login
- Google OAuth login
- Role-based access (Customer, Seller, Admin)
- Forgot/reset password via email

### Product Management
- Full CRUD for products
- Image upload via Cloudinary
- Product variants (color, size, material)
- Specifications, tags, categories, brands
- Featured, New Arrival, Best Seller flags
- SKU and barcode support

### Shopping Experience
- Advanced search with filters
- Category browsing with mega menu
- Product image gallery with zoom
- Reviews and ratings system
- Wishlist functionality
- Recently viewed products
- Related products

### Cart & Checkout
- Add/update/remove cart items
- Coupon application
- Address management
- Stripe payment + Cash on Delivery
- Order confirmation and tracking

### Customer Dashboard
- Profile management
- Order history and tracking
- Wishlist management
- Address book
- Account settings

### Seller Dashboard
- Product management
- Order management
- Sales analytics
- Revenue tracking

### Admin Dashboard
- Platform statistics with charts
- User management
- Product moderation
- Order management
- Category management
- Coupon management
- Review moderation
- Support ticket system

### UI/UX
- Fully responsive design
- Dark mode support
- Smooth page transitions (Framer Motion)
- Loading skeletons
- Glassmorphism effects
- Animated hero sections
- Toast notifications

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your environment variables
npm install
npm run seed    # Seed categories, brands, and demo data
npm run dev     # Start development server on port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Start development server on port 3000
```

### Default Accounts (after seeding)
- **Admin:** admin@hanifsales.com / admin123
- **Seller:** seller@hanifsales.com / seller123

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/products | List products |
| GET | /api/products/slug/:slug | Get product by slug |
| POST | /api/cart/add | Add to cart |
| GET | /api/cart | Get cart |
| POST | /api/orders | Create order |
| GET | /api/orders/my-orders | My orders |
| GET | /api/admin/dashboard | Admin dashboard stats |

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render)
```bash
cd backend
npm run build
# Deploy to Render
```

### Database
- MongoDB Atlas (cloud-hosted)

---

## License

MIT License - Hanif Sales 2025
