import { Link } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Shield, Zap, Package, ArrowRight, TrendingUp, Copy, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import heroImage from '@/assets/hero-minecraft.jpg';
import homeBackground from '@/assets/home-background.webp';
import lavaBackground from '@/assets/lava-background.png';
import MouseSparkle from '@/components/MouseSparkle';

const LavaCube3D = lazy(() => import('@/components/LavaCube3D'));
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface StatBox {
  id: string;
  icon: string;
  label: string;
  value: string;
  display_order: number;
}

interface SiteSetting {
  setting_key: string;
  setting_value: string;
}

const Index = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [statBoxes, setStatBoxes] = useState<StatBox[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStatBoxes();
    fetchSiteSettings();

    // Subscribe to realtime updates for site settings
    const settingsChannel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        () => {
          fetchSiteSettings();
        }
      )
      .subscribe();

    // Subscribe to realtime updates for stat boxes
    const statBoxesChannel = supabase
      .channel('stat_boxes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stat_boxes'
        },
        () => {
          fetchStatBoxes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(statBoxesChannel);
    };
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
      .limit(6);
    
    if (!error && data) {
      setProducts(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchStatBoxes = async () => {
    const { data, error } = await supabase
      .from('stat_boxes')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setStatBoxes(data);
    }
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (!error && data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((setting: SiteSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      setSiteSettings(settingsMap);
    }
  };

  const filteredProducts = selectedFilter === 'all'
    ? products
    : products.filter(p => p.category_id === selectedFilter);

  const [copiedIP, setCopiedIP] = useState(false);

  const copyServerIP = () => {
    const serverIP = siteSettings['server_ip'] || 'play.buildmc.net';
    navigator.clipboard.writeText(serverIP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || TrendingUp;
    return IconComponent;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with 3D Cube */}
      <div className="relative h-[900px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {theme !== 'minecraft' && (
            <img 
              src={heroImage} 
              alt="Minecraft server" 
              className="w-full h-full object-cover scale-110" 
            />
          )}
          {/* Blue gradient background for minecraft theme */}
          {theme === 'minecraft' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#1b263b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
          {theme === 'minecraft' && (
            <>
              {/* Glowing orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Grid lines effect */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(0,170,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,170,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }} />
              
              {/* Bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-cyan-500/20 via-blue-500/10 to-transparent blur-xl" />
            </>
          )}
        </div>

        {/* 3D Cube - Only in minecraft theme */}
        {theme === 'minecraft' && (
          <Suspense fallback={null}>
            <LavaCube3D />
          </Suspense>
        )}

        {/* Mouse Sparkle Effect */}
        <MouseSparkle />

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center z-20">
          <div className="max-w-2xl animate-fade-in">
            {/* Glass morphism badge */}
            <div className="inline-block mb-6 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-xl shadow-lg shadow-cyan-500/10">
              <span className="text-cyan-400 font-semibold text-sm tracking-wide">✨ Premium Minecraft Store</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-2xl">
                {siteSettings['hero_greeting'] || 'Welcome to'}
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">{siteSettings['hero_title'] || 'BuildMC Store'}</span>
            </h1>
            
            {/* Glass card for description */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 shadow-2xl">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                {siteSettings['hero_subtitle'] || 'Your trusted destination for premium ranks, exclusive items, and epic Minecraft experiences!'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-3 text-base px-10 py-7 shadow-xl shadow-cyan-500/25 transition-all duration-300 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 border-none rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40">
                <Link to="/shop">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Shop
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-3 text-base px-10 py-7 border-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 backdrop-blur-xl rounded-xl hover:scale-105 transition-all duration-300 hover:border-cyan-400/60">
                <Link to="/orders">
                  View Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* Server Info Section */}
      {(siteSettings['server_ip'] || siteSettings['server_version']) && (
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              {siteSettings['server_ip'] && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Server IP</p>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        🇧🇩 BD
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-foreground">{siteSettings['server_ip']}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={copyServerIP}
                        className="h-8 w-8"
                      >
                        {copiedIP ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {siteSettings['server_version'] && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-lg font-bold text-foreground">{siteSettings['server_version']}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {statBoxes.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {statBoxes.map((stat) => {
              const Icon = getIcon(stat.icon);
              return (
                <div key={stat.id} className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-foreground">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
        </div>
      </div>

      {/* Shop Preview Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BuildMC Shop
          </h2>
          <Button asChild size="lg" className="gap-2">
            <Link to="/shop">
              Shop
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* Filter Tabs - Centered Layout */}
        <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
          {/* Left Side Filters */}
          <div className="flex gap-2">
            {categories.slice(0, Math.floor(categories.length / 2)).map((cat) => (
              <Button
                key={cat.id}
                variant={selectedFilter === cat.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(cat.id)}
                className="rounded-xl px-6 py-3 font-semibold"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Center - All Items */}
          <Button
            variant={selectedFilter === 'all' ? "default" : "outline"}
            onClick={() => setSelectedFilter('all')}
            className="rounded-xl px-8 py-3 font-semibold text-lg shadow-lg"
          >
            All Items
          </Button>

          {/* Right Side Filters */}
          <div className="flex gap-2">
            {categories.slice(Math.floor(categories.length / 2)).map((cat) => (
              <Button
                key={cat.id}
                variant={selectedFilter === cat.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(cat.id)}
                className="rounded-xl px-6 py-3 font-semibold"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-16 text-center border-2 border-dashed">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No products available</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden border-2 bg-card/50 backdrop-blur hover-lift hover:border-primary/50 transition-all rounded-2xl"
              >
                <div className="relative h-56 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Package className="w-10 h-10 text-primary" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={product.stock > 0 ? "default" : "secondary"}
                      className="shadow-lg font-semibold"
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                  <CardDescription>
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-2xl font-bold text-primary">
                      ৳{product.price}
                    </span>
                    <Button 
                      asChild
                      disabled={product.stock === 0}
                      className="gap-2 shadow-lg glow-effect"
                    >
                      <Link to={`/checkout/${product.id}`}>
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
              {siteSettings['cta_title'] || 'Ready to Get Started?'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {siteSettings['cta_subtitle'] || 'Join thousands of players who trust BuildMC Store for their premium Minecraft needs'}
            </p>
            <Button asChild size="lg" className="gap-2 text-base px-10 py-6 shadow-xl glow-effect">
              <Link to="/shop">
                <ShoppingBag className="w-5 h-5" />
                {siteSettings['cta_button_text'] || 'Explore Products'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
