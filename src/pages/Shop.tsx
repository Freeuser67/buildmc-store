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
import { ShoppingCart, Package, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const serverIP = 'build-mc.fun';
  
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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setProducts(data);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  const handleBuyNow = (productId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/checkout/${productId}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Minecraft Shop" 
            className="w-full h-full object-cover scale-105 animate-[scale_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center space-y-6 px-4 animate-fade-in">
            <div className="inline-block mb-2">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary font-semibold text-sm">Server Online</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                BuildMC
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-muted-foreground font-medium">
              Premium Minecraft Items & Resources
            </p>
            <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-xl px-8 py-4 rounded-2xl border-2 border-primary/30 shadow-lg hover:shadow-xl transition-all hover:border-primary/50 group">
              <span className="text-lg font-bold text-foreground">Server IP:</span>
              <Button
                variant="ghost"
                className="gap-2 text-primary font-mono text-xl hover:bg-primary/10 font-bold px-4 py-2 rounded-lg"
                onClick={handleCopyIP}
              >
                {serverIP}
                {copied ? 
                  <Check className="w-5 h-5 text-primary animate-scale-in" /> : 
                  <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                }
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Shop Products
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse our collection of premium Minecraft items
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="mb-10 flex flex-wrap gap-2 bg-muted/50 p-2 rounded-2xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl px-6 py-3 font-semibold transition-all"
            >
              All Items
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl px-6 py-3 font-semibold transition-all"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-8">
            {filteredProducts.length === 0 ? (
              <Card className="p-16 text-center border-2 border-dashed border-border/50 bg-card/30 backdrop-blur rounded-2xl">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-2xl font-semibold text-muted-foreground">No products available yet</p>
                <p className="text-muted-foreground/70 mt-2">Check back soon for new items!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur hover-lift hover:border-primary/50 transition-all rounded-2xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                          className="shadow-lg font-semibold px-3 py-1"
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="space-y-3">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center pt-4 border-t border-border/50">
                        <span className="text-3xl font-bold text-primary">
                          ৳{product.price}
                        </span>
                        <Button 
                          onClick={() => handleBuyNow(product.id)}
                          disabled={product.stock === 0}
                          className="gap-2 px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all glow-effect"
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
      </div>
    </div>
  );
};

export default Shop;
