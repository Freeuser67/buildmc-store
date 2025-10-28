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
      <div className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Minecraft server" className="w-full h-full object-cover scale-105 animate-[scale_20s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <span className="text-primary font-semibold text-sm">🎮 Premium Minecraft Store</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-foreground">BuildMC Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
              Your trusted destination for premium ranks, exclusive items, and epic Minecraft experiences!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all glow-effect">
                <Link to="/shop">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Shop
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-base px-8 py-6 border-2">
                <Link to="/orders">
                  View Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why Choose Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the best Minecraft shopping with our premium features and dedicated support
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift hover:border-primary/50 transition-all">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-10 h-10 text-primary animate-float" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Secure Payments</h3>
            <p className="text-muted-foreground leading-relaxed">Safe and secure bKash payment processing with instant confirmation</p>
          </div>
          
          <div className="group text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift hover:border-primary/50 transition-all">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-10 h-10 text-secondary animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Instant Delivery</h3>
            <p className="text-muted-foreground leading-relaxed">Get your purchases delivered instantly to your account without delays</p>
          </div>
          
          <div className="group text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift hover:border-primary/50 transition-all">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-10 h-10 text-primary animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Premium Items</h3>
            <p className="text-muted-foreground leading-relaxed">Exclusive ranks and items carefully curated for your server</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center" style={{ background: 'var(--gradient-card)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of players who trust BuildMC Store for their premium Minecraft needs
            </p>
            <Button asChild size="lg" className="gap-2 text-base px-10 py-6 shadow-xl glow-effect">
              <Link to="/shop">
                <ShoppingBag className="w-5 h-5" />
                Explore Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
