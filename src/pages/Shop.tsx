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

interface QuickLink {
  id: string;
  title: string;
  url: string;
  display_order: number;
}

interface SiteSetting {
  setting_key: string;
  setting_value: string;
}

const Shop = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [discordUrl, setDiscordUrl] = useState('https://discord.gg/buildmc');
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com/@buildmc');
  const [discordMembers, setDiscordMembers] = useState('0');
  const [activePlayers, setActivePlayers] = useState('15K+');
  const [eventsHosted, setEventsHosted] = useState('500+');
  const [uptime, setUptime] = useState('24/7');
  const [heroTitle, setHeroTitle] = useState('BuildMC');
  const [heroSubtitle, setHeroSubtitle] = useState('Premium Ranks • Exclusive Kits • Epic Items');
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [serverIP, setServerIP] = useState('play.buildmc.net');
  const [discordServerId, setDiscordServerId] = useState('');
  
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
    fetchQuickLinks();
    fetchSocialLinks();

    // Fetch initial status immediately
    if (serverIP) {
      fetchMinecraftStatus(serverIP);
    }
    if (discordServerId) {
      fetchDiscordStats(discordServerId);
    }

    // Poll server status every 2 seconds for real-time updates
    const statusInterval = setInterval(() => {
      if (serverIP) {
        fetchMinecraftStatus(serverIP);
      }
      if (discordServerId) {
        fetchDiscordStats(discordServerId);
      }
    }, 2000);

    const settingsChannel = supabase
      .channel('shop_site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => fetchSocialLinks())
      .subscribe();

    return () => {
      clearInterval(statusInterval);
      supabase.removeChannel(settingsChannel);
    };
  }, [serverIP]);

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

  const fetchQuickLinks = async () => {
    const { data, error } = await supabase
      .from('quick_links')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setQuickLinks(data);
    }
  };

  const fetchSocialLinks = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (!error && data) {
      const settings = data as SiteSetting[];
      const discord = settings.find(s => s.setting_key === 'discord_url');
      const youtube = settings.find(s => s.setting_key === 'youtube_url');
      const players = settings.find(s => s.setting_key === 'active_players');
      const events = settings.find(s => s.setting_key === 'events_hosted');
      const uptimeVal = settings.find(s => s.setting_key === 'uptime');
      const title = settings.find(s => s.setting_key === 'hero_title');
      const subtitle = settings.find(s => s.setting_key === 'hero_subtitle');
      const status = settings.find(s => s.setting_key === 'server_status');
      const ip = settings.find(s => s.setting_key === 'server_ip');
      const version = settings.find(s => s.setting_key === 'server_version');
      const discordId = settings.find(s => s.setting_key === 'discord_server_id');
      
      if (discord) setDiscordUrl(discord.setting_value);
      if (youtube) setYoutubeUrl(youtube.setting_value);
      if (players) setActivePlayers(players.setting_value);
      if (events) setEventsHosted(events.setting_value);
      if (uptimeVal) setUptime(uptimeVal.setting_value);
      if (title) setHeroTitle(title.setting_value);
      if (subtitle) setHeroSubtitle(subtitle.setting_value);
      if (status) setServerStatus(status.setting_value);
      if (ip) {
        setServerIP(ip.setting_value);
        // Fetch real-time server status
        fetchMinecraftStatus(ip.setting_value);
      }
      if (discordId) {
        setDiscordServerId(discordId.setting_value);
        fetchDiscordStats(discordId.setting_value);
      }
      // version is fetched for future use on this page if needed
    }
  };

  const fetchMinecraftStatus = async (ip: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('minecraft-status', {
        body: { serverIP: ip }
      });

      if (error) throw error;

      if (data.online) {
        setServerStatus(`Server Online • ${data.players.online} Online Players`);
      } else {
        setServerStatus('Server Offline');
      }
    } catch (error) {
      console.error('Error fetching Minecraft status:', error);
      setServerStatus('Status Unknown');
    }
  };

  const fetchDiscordStats = async (serverId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('discord-stats', {
        body: { serverId }
      });

      if (error) throw error;

      setDiscordMembers(data.memberCount.toString());
    } catch (error) {
      console.error('Error fetching Discord stats:', error);
      setDiscordMembers('0');
    }
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
              <div className="flex gap-4 items-center">
                {/* Minecraft Server Status */}
                <div className="glass-effect flex items-center gap-3 rounded-full px-6 py-3 neon-border hover:scale-105 transition-all">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse glow-effect" />
                  <span className="text-primary font-bold text-base">{serverStatus}</span>
                </div>

                {/* Discord Members */}
                {discordServerId && (
                  <div className="glass-effect flex items-center gap-3 rounded-full px-6 py-3 neon-border hover:scale-105 transition-all">
                    <MessageCircle className="w-5 h-5 text-secondary animate-pulse" />
                    <span className="text-secondary font-bold text-base">{discordMembers} Online Members</span>
                  </div>
                )}
              </div>
            </div>

            {/* BuildMC Logo Text */}
            <h1 className="text-7xl md:text-9xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-float drop-shadow-2xl">
                {heroTitle}
              </span>
            </h1>

            <p className="text-2xl md:text-4xl text-foreground/90 font-semibold max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
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
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            BuildMC Shop
          </h2>
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
                  BuildMC is a top-rated Bangladeshi Minecraft server, known for its survival gameplay, daily events, and low ping for players in Bangladesh
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button 
                    size="lg" 
                    className="gap-2 neon-border glow-effect rounded-xl font-bold hover:scale-110 transition-all"
                    onClick={() => window.open(discordUrl, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Discord
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="gap-2 glass-effect border-2 border-primary/30 rounded-xl font-bold hover:scale-110 transition-all"
                    onClick={() => window.open(youtubeUrl, '_blank')}
                  >
                    <Youtube className="w-5 h-5" />
                    YouTube
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-foreground mb-6">Quick Links</h4>
                {quickLinks.length > 0 ? (
                  <ul className="space-y-3">
                    {quickLinks.map((link) => (
                      <li key={link.id}>
                        <Button 
                          variant="link" 
                          className="text-muted-foreground hover:text-primary text-base font-medium hover:scale-110 transition-all"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          {link.title}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No quick links available</p>
                )}
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
