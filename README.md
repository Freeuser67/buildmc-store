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

### VPS Deployment with Node.js

Deploy your BuildMC Store on any VPS (DigitalOcean, AWS, Linode, etc.) using Node.js and PM2.

#### Prerequisites
- Ubuntu 20.04+ VPS with root access
- Domain name (optional but recommended)
- SSH access

#### Step 1: Initial VPS Setup

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Git
apt install -y git

# Verify installations
node --version
npm --version
```

#### Step 2: Install Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx
```

#### Step 3: Configure Firewall

```bash
# Allow necessary ports
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable
```

#### Step 4: Setup Application

```bash
# Create app directory
mkdir -p /var/www/buildmc
cd /var/www/buildmc

# Clone repository (or upload via FTP/SCP)
git clone YOUR_GITHUB_REPO_URL .

# Create environment file
cat > .env << 'EOF'
VITE_SUPABASE_PROJECT_ID="bcwsvxgkbgrfwkaekblc"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjd3N2eGdrYmdyZndrYWVrYmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTM2OTgsImV4cCI6MjA3NzE4OTY5OH0.ErTCmBzVa8l3mneHK5PtYgtxtYkIoUEFFFxTKvzArcg"
VITE_SUPABASE_URL="https://bcwsvxgkbgrfwkaekblc.supabase.co"
PORT=3000
EOF

# Install dependencies
npm install

# Build production bundle
npm run build
```

#### Step 5: Create Node.js Server

```bash
# Create server file
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Serve static files with caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true
}));

// SPA fallback - all routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BuildMC Store running on port ${PORT}`);
});
EOF

# Install Express and compression
npm install express compression
```

#### Step 6: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name buildmc-store

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command output instructions

# Check status
pm2 status
pm2 logs buildmc-store
```

#### Step 7: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/buildmc << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/buildmc /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

#### Step 8: Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts - choose redirect HTTP to HTTPS

# Verify auto-renewal
certbot renew --dry-run
```

#### Step 9: Create Deployment Script

```bash
# Create deployment script
cat > /var/www/buildmc/deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting deployment..."

cd /var/www/buildmc

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build production bundle
npm run build

# Restart PM2
pm2 restart buildmc-store

echo "✅ Deployment completed at $(date)"
EOF

# Make executable
chmod +x /var/www/buildmc/deploy.sh
```

#### Managing Your Application

**View logs:**
```bash
pm2 logs buildmc-store
pm2 logs buildmc-store --lines 100
```

**Restart application:**
```bash
pm2 restart buildmc-store
```

**Stop application:**
```bash
pm2 stop buildmc-store
```

**Deploy updates:**
```bash
cd /var/www/buildmc
./deploy.sh
```

**Monitor application:**
```bash
pm2 monit
```

**Check Nginx logs:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

#### Docker Deployment (Alternative)

For containerized deployment:

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY server.js ./
RUN npm install --production && npm install express compression
EXPOSE 3000
CMD ["node", "server.js"]
```

**Build and run:**
```bash
docker build -t buildmc-store .
docker run -d -p 3000:3000 --name buildmc --restart always buildmc-store
```

**Using Docker Compose:**
```yaml
version: '3.8'
services:
  buildmc:
    build: .
    ports:
      - "3000:3000"
    restart: always
    environment:
      - PORT=3000
```

#### Important Notes

- **Backend**: Lovable Cloud backend runs separately - only deploy frontend
- **Database**: No database setup needed - handled by Lovable Cloud
- **Environment Variables**: Keep `.env` secure with your Cloud credentials
- **Updates**: Run `./deploy.sh` to deploy new versions
- **Monitoring**: Use `pm2 monit` to track performance
- **Backups**: Backup `/var/www/buildmc` directory regularly

#### Troubleshooting

**Application won't start:**
```bash
# Check PM2 logs
pm2 logs buildmc-store

# Check if port 3000 is available
lsof -i :3000

# Restart PM2
pm2 restart buildmc-store
```

**502 Bad Gateway:**
```bash
# Verify app is running
pm2 status

# Check Nginx configuration
nginx -t

# Restart services
pm2 restart buildmc-store
systemctl restart nginx
```

**Can't connect to backend:**
```bash
# Verify environment variables
cat /var/www/buildmc/.env

# Rebuild application
npm run build
pm2 restart buildmc-store
```

**High memory usage:**
```bash
# Check PM2 stats
pm2 monit

# Restart app to clear memory
pm2 restart buildmc-store
```

#### Security Best Practices

1. **Keep system updated**: `apt update && apt upgrade`
2. **Use SSH keys** instead of password authentication
3. **Enable firewall**: Only allow necessary ports
4. **Install fail2ban**: Prevent brute force attacks
5. **Regular backups**: Backup code and configurations
6. **Use HTTPS**: Always enable SSL certificates
7. **Secure .env**: Keep credentials private, never commit to Git
8. **Monitor logs**: Check for suspicious activity regularly

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
