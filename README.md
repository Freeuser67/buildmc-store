# BuildMC Store 🎮

A modern e-commerce platform for Minecraft server items built with React, TypeScript, and Lovable Cloud.

![BuildMC Store](https://img.shields.io/badge/BuildMC-Store-orange?style=for-the-badge&logo=minecraft)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🛍️ **Shop System** - Browse and purchase Minecraft server items
- 👤 **User Authentication** - Secure login with email, Google, and Discord
- 💳 **bKash Payment** - Integrated payment with manual verification
- 📊 **Admin Dashboard** - Full analytics and management panel
- 📦 **Product Management** - Categories, products, and inventory control
- 👑 **Role Management** - Admin user management at `/admin/users`
- 🎨 **Modern UI** - Responsive design with dark theme
- 🔗 **Quick Links** - Customizable navigation links
- 📈 **Live Stats** - Real-time server and Discord statistics

## 🚀 Quick Start

### Installation

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | Frontend framework |
| Tailwind CSS + shadcn/ui | Styling & components |
| Lovable Cloud | Backend & database |
| React Router v6 | Navigation |
| TanStack Query | Data fetching |
| Three.js | 3D graphics |

## 📖 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, stats, and features |
| `/shop` | Product catalog and shopping |
| `/checkout` | Order placement with bKash payment |
| `/orders` | User order history |
| `/auth` | Login and signup |
| `/admin/dashboard` | Admin control panel |
| `/admin/products` | Product management |
| `/admin/categories` | Category management |
| `/admin/orders` | Order management |
| `/admin/users` | Admin role management |
| `/admin/site-settings` | Site configuration |

## 👤 User Roles

### Customer
1. Browse products at `/shop`
2. Sign up or login via email/Google/Discord
3. Purchase items with bKash payment
4. Track orders at `/orders`

### Admin
1. Access admin panel at `/admin/dashboard`
2. Manage products, categories, and orders
3. Add/remove admins at `/admin/users`
4. Configure site settings

## 👑 Admin Management

Admins can be managed through the UI at `/admin/users`:
- View all users with roles
- Add new admins by User ID
- Edit existing user roles
- Remove admin access

**First Admin Setup:** The first admin must be added via database migration.

## 💳 Payment System

1. Customer selects product and proceeds to checkout
2. Customer pays via bKash and enters payment phone number
3. Admin receives order notification
4. Admin verifies payment and updates order status
5. Customer receives item in-game

## 🔒 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Protected admin routes
- ✅ Secure authentication via Lovable Cloud
- ✅ Role-based access control
- ✅ Server-side role verification

## 📊 Minecraft Server Info

| Property | Value |
|----------|-------|
| Server IP | `build-mc.fun` |
| Version | Java Edition |
| Stats Update | Every 2 seconds |

Live stats display online players and Discord members.

## 🛠️ Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## 📝 License

This project is for educational and commercial use.

---

**Built with ❤️ using [Lovable](https://lovable.dev)**
