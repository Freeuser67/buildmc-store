import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import heroImage from '@/assets/hero-minecraft.jpg';
import { ShoppingCart, Package, Copy, Check, Users, Trophy, Sparkles, Youtube, MessageCircle, Server } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCardSkeleton } from '@/components/LoadingSkeleton';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: string | null;
}

const Shop = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const serverIP = 'play.build-mc.fun';
  
  const handleCopyIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      setCopied(true);
      toast.success('Server IP copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy IP');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setProducts(data);
    }
    setIsLoadingProducts(false);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  const handleBuyNow = (productId: string) => {
    if (!user) {
      toast.info('Please sign in to make a purchase');
      navigate('/auth');
      return;
    }
    navigate(`/checkout/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="BuildMC Minecraft Server" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
          <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
          
          {/* Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center space-y-8 px-4 max-w-5xl mx-auto animate-fade-in">
            {/* Server Status Badge */}
            <div className="inline-block mb-4">
              <div className="glass-effect flex items-center gap-3 rounded-full px-6 py-3 neon-border">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse glow-effect" />
                <span className="text-primary font-bold text-base">Server Online • 247 Players</span>
              </div>
            </div>

            {/* BuildMC Logo Text */}
            <h1 className="text-7xl md:text-9xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-float drop-shadow-2xl">
                BuildMC
              </span>
            </h1>

            <p className="text-2xl md:text-4xl text-foreground/90 font-semibold max-w-3xl mx-auto leading-relaxed">
              Premium Ranks • Exclusive Kits • Epic Items
            </p>

            {/* Server IP Card */}
            <div className="inline-flex items-center gap-4 glass-effect px-10 py-5 rounded-2xl neon-border group hover:scale-105 transition-all">
              <Server className="w-6 h-6 text-primary animate-pulse" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground font-medium">Join Our Server</p>
                <Button
                  variant="ghost"
                  className="gap-3 text-primary font-mono text-2xl hover:bg-primary/10 font-bold px-4 py-1 rounded-lg h-auto"
                  onClick={handleCopyIP}
                >
                  {serverIP}
                  {copied ? 
                    <Check className="w-6 h-6 text-secondary glow-secondary" /> : 
                    <Copy className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  }
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 rounded-2xl font-bold glow-effect hover:scale-110 transition-all neon-border"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Browse Store
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-7 rounded-2xl font-bold glass-effect hover:scale-110 transition-all border-2 border-primary/30"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center animate-slide-up">
          <Badge className="mb-4 text-base px-6 py-2 neon-border">Premium Items</Badge>
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Shop Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exclusive ranks, powerful kits, and rare items to dominate the server
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="mb-12 flex flex-wrap gap-3 bg-transparent p-0 justify-center">
            <TabsTrigger 
              value="all" 
              className="glass-effect data-[state=active]:neon-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-8 py-4 font-bold text-lg transition-all hover:scale-105"
            >
              All Items
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="glass-effect data-[state=active]:neon-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-8 py-4 font-bold text-lg transition-all hover:scale-105"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-10">
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-20 text-center glass-effect neon-border rounded-3xl animate-fade-in">
                <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-primary/10 flex items-center justify-center glow-effect">
                  <Package className="w-16 h-16 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">No products available yet</p>
                <p className="text-lg text-muted-foreground">Check back soon for amazing new items!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((product, index) => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden glass-effect hover-lift hover:neon-border transition-all rounded-3xl animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-3 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center glow-effect">
                          <Package className="w-12 h-12 text-primary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={product.stock > 0 ? "default" : "secondary"}
                          className="shadow-2xl font-bold px-4 py-2 text-base neon-border"
                        >
                          {product.stock > 0 ? `${product.stock} Left` : 'Sold Out'}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="space-y-4 pb-4">
                      <CardTitle className="text-3xl font-black group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground/90">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center pt-6 border-t border-border/50">
                        <span className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          ৳{product.price}
                        </span>
                        <Button 
                          onClick={() => handleBuyNow(product.id)}
                          disabled={product.stock === 0}
                          size="lg"
                          className="gap-2 px-8 py-6 text-lg font-bold rounded-xl glow-effect hover:scale-110 transition-all neon-border"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <Badge className="mb-4 text-base px-6 py-2 neon-border">Our Story</Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to BuildMC
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              BuildMC is more than just a Minecraft server—it's a thriving community of builders, 
              warriors, and adventurers. Founded in 2023, we've grown into one of the most popular 
              servers with thousands of active players creating legendary moments every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-effect p-8 text-center hover-lift rounded-3xl neon-border group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center glow-effect group-hover:scale-110 transition-all">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-black text-primary mb-2">15K+</h3>
              <p className="text-lg font-semibold text-foreground mb-1">Active Players</p>
              <p className="text-sm text-muted-foreground">Join our amazing community</p>
            </Card>

            <Card className="glass-effect p-8 text-center hover-lift rounded-3xl neon-border group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center glow-secondary group-hover:scale-110 transition-all">
                <Trophy className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-3xl font-black text-secondary mb-2">500+</h3>
              <p className="text-lg font-semibold text-foreground mb-1">Events Hosted</p>
              <p className="text-sm text-muted-foreground">Epic competitions & prizes</p>
            </Card>

            <Card className="glass-effect p-8 text-center hover-lift rounded-3xl neon-border group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/20 flex items-center justify-center glow-effect group-hover:scale-110 transition-all">
                <Sparkles className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-3xl font-black text-accent mb-2">24/7</h3>
              <p className="text-lg font-semibold text-foreground mb-1">Uptime</p>
              <p className="text-sm text-muted-foreground">Always online, always fun</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-16 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Brand */}
              <div className="text-center md:text-left">
                <h3 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  BuildMC
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  The ultimate Minecraft server experience with custom game modes, exclusive items, and an amazing community.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button 
                    size="lg" 
                    className="gap-2 neon-border glow-effect rounded-xl font-bold"
                    onClick={() => window.open('https://discord.gg/buildmc', '_blank')}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Discord
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="gap-2 glass-effect border-2 border-primary/30 rounded-xl font-bold"
                    onClick={() => window.open('https://youtube.com/@buildmc', '_blank')}
                  >
                    <Youtube className="w-5 h-5" />
                    YouTube
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-foreground mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Button variant="link" className="text-muted-foreground hover:text-primary text-base font-medium">
                      Vote for Us
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="text-muted-foreground hover:text-primary text-base font-medium">
                      Server Rules
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="text-muted-foreground hover:text-primary text-base font-medium">
                      Staff Applications
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="text-muted-foreground hover:text-primary text-base font-medium">
                      Ban Appeals
                    </Button>
                  </li>
                </ul>
              </div>

              {/* Server Info */}
              <div className="text-center md:text-right">
                <h4 className="text-xl font-bold text-foreground mb-6">Server Info</h4>
                <div className="space-y-4">
                  <div className="glass-effect p-4 rounded-xl inline-block">
                    <p className="text-sm text-muted-foreground mb-1">Server IP</p>
                    <p className="text-lg font-mono font-bold text-primary">{serverIP}</p>
                  </div>
                  <div className="glass-effect p-4 rounded-xl inline-block">
                    <p className="text-sm text-muted-foreground mb-1">Version</p>
                    <p className="text-lg font-bold text-foreground">1.20.x - 1.21.x</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-border/50 text-center">
              <p className="text-muted-foreground text-sm">
                © 2025 BuildMC. All rights reserved. Not affiliated with Mojang or Microsoft.
              </p>
              <p className="text-muted-foreground/60 text-xs mt-2">
                Made with ❤️ for the Minecraft community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Shop;
