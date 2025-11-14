# BuildMC Store 🎮

A modern e-commerce platform for Minecraft server items built with React, TypeScript, and Lovable Cloud.

## ✨ Features

- 🛍️ Browse and purchase Minecraft server items
- 👤 User authentication and order tracking
- 💳 bKash payment integration
- 📊 Admin dashboard with analytics
- 📦 Product and category management
- 🎨 Modern, responsive design

## 🚀 Quick Start

### Installation

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Tech Stack

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Lovable Cloud (Supabase)
- React Router v6
- TanStack Query

## 📖 Usage

### Customer

1. Browse products at `/shop`
2. Sign up or login
3. Purchase items with bKash
4. Track orders at `/orders`

### Admin

1. Set user role to 'admin' in the backend database
2. Access admin panel at `/admin/dashboard`
3. Manage products, categories, and orders

## 💳 Payment

Customers pay via bKash and provide their payment phone number. Admins manually verify payments and update order status.

## 🔒 Security

- Row Level Security (RLS) enabled
- Protected admin routes
- Secure authentication via Lovable Cloud

## 📊 Minecraft Server Info

Server IP: `build-mc.fun`

Live stats show online players and Discord members, updated every 2 seconds.

## 📝 License

This project is for educational and commercial use.
