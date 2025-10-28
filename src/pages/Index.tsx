import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-minecraft.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Minecraft server" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to BuildMC Store
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your trusted Minecraft server shop for premium ranks, exclusive items, and more!
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/shop">
                <ShoppingBag className="w-5 h-5" />
                Browse Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-card border border-border">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
            <p className="text-muted-foreground">Safe and secure bKash payment processing</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border">
            <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
            <p className="text-muted-foreground">Get your purchases delivered instantly</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Premium Items</h3>
            <p className="text-muted-foreground">Exclusive ranks and items for your server</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
