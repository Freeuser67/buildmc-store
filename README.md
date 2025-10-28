# BuildMC Store 🎮

A modern e-commerce platform for Minecraft server items built with React, TypeScript, and Lovable Cloud.

## 🌟 Features

### Customer Features
- 🛍️ Browse and purchase Minecraft server items
- 👤 User authentication (Sign up/Login)
- 📦 Order tracking and history
- 💳 bKash payment integration
- 🎨 Modern, responsive UI
- 🔒 Secure checkout process

### Admin Features
- 📊 Comprehensive dashboard with sales analytics
- 📦 Product management (Create, Edit, Delete)
- 🗂️ Category management
- 📋 Order management and status updates
- 💰 Revenue tracking
- 👥 Customer information management

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form + Zod

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Quick Start Guide

### For Customers

1. **Browse Products**: Visit the Shop page at `/shop`
2. **Create Account**: Click "Sign Up" and register with email/password
3. **Make Purchase**: 
   - Select a product
   - Fill in your details (Real Name, Minecraft Name, Email, Phone)
   - Complete payment via bKash
   - Submit order
4. **Track Orders**: View your orders at `/orders`

### For Administrators

#### First Time Setup

1. **Create Admin Account**: Use the Lovable Cloud backend to manually set a user's role to 'admin' in the `user_roles` table

2. **Access Admin Panel**: Login and navigate to `/admin/dashboard`

#### Managing Products

1. Go to **Admin → Products**
2. Click **"Add Product"**
3. Fill in product details:
   - Name
   - Description
   - Price (in BDT ৳)
   - Stock quantity
   - Category
   - Upload product image
4. Click **"Create Product"**

#### Managing Categories

1. Go to **Admin → Categories**
2. Click **"Add Category"**
3. Enter category name and description
4. Click **"Create Category"**

#### Managing Orders

1. Go to **Admin → Orders**
2. View all customer orders
3. Update order status:
   - Unpaid → Paid → Completed
4. View customer details and payment information

## 💳 Payment Information

The store uses **bKash** as the payment method. Customers need to:

1. Send money to your bKash merchant number
2. Enter the phone number they used to send money
3. Submit the order with payment details

**Admin Action Required**: Verify payments manually through your bKash merchant account and update order status accordingly.

## 🗄️ Database Schema

### Tables

- **profiles**: User profile information
- **user_roles**: User role management (user/admin)
- **categories**: Product categories
- **products**: Product catalog
- **orders**: Customer orders

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own data
- Admins have full access to manage products, categories, and orders

## 🔐 Authentication & Security

- Secure authentication via Lovable Cloud
- Email/Password authentication
- Protected admin routes
- Row Level Security policies
- Auto-confirm email signups enabled for development

## 📱 Server Information

**Minecraft Server IP**: `build-mc.fun`
- Displayed on Shop page with click-to-copy functionality

## 🎨 Customization

### Branding
- Site name: BuildMC Store
- Configured in `index.html` and components
- Hero image located at `src/assets/hero-minecraft.jpg`

### Theme
- Colors and styling defined in `src/index.css`
- Uses HSL color system with semantic tokens
- Customizable via Tailwind config

## 📦 Deployment

### Using Lovable

1. Open your [Lovable Project](https://lovable.dev/projects/e164e291-19a7-4017-a760-637585cd7a37)
2. Click **Share → Publish**
3. Your app will be deployed automatically

### Custom Domain

1. Navigate to **Project → Settings → Domains**
2. Click **"Connect Domain"**
3. Follow the DNS configuration instructions
4. Note: Requires a paid Lovable plan

## 🔧 Environment Variables

The following variables are automatically configured by Lovable Cloud:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

**Note**: Do not manually edit the `.env` file - it's managed automatically.

## 📖 Development Guide

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── Navbar.tsx      # Navigation component
├── hooks/              # Custom React hooks
│   └── useAuth.tsx     # Authentication hook
├── integrations/       # External integrations
│   └── supabase/       # Supabase client & types
├── pages/              # Route pages
│   ├── admin/          # Admin panel pages
│   ├── Auth.tsx        # Login/Signup page
│   ├── Checkout.tsx    # Checkout page
│   ├── Index.tsx       # Home page
│   ├── Orders.tsx      # User orders page
│   └── Shop.tsx        # Product listing page
└── lib/                # Utility functions
```

### Making Changes

#### Using Lovable
Simply visit the [Lovable Project](https://lovable.dev/projects/e164e291-19a7-4017-a760-637585cd7a37) and start prompting.

#### Using Visual Edits
For quick changes to static elements:
1. Click the **Edit** button in the chat box
2. Select elements on the page
3. Edit directly or use prompts
4. Click **Save**

#### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### "Cannot view data" issues
- Check if you're logged in
- Verify RLS policies are correctly set
- Ensure your user role is properly configured

### Image upload issues
- Check that images are under 5MB
- Supported formats: JPG, PNG, WEBP
- Verify storage bucket permissions

### Authentication issues
- Clear browser cache and localStorage
- Check if email confirmation is required
- Verify Supabase Auth configuration

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Cloud Features](https://docs.lovable.dev/features/cloud)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Support

For issues or questions:
1. Check the [Lovable Documentation](https://docs.lovable.dev/)
2. Join the [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
3. Review [Lovable YouTube Tutorials](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

## 📄 License

This project is built with Lovable and uses various open-source technologies.

---

**Minecraft Server**: build-mc.fun | **Currency**: BDT (৳) | **Payment**: bKash
