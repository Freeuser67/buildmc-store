import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCardSkeleton } from '@/components/LoadingSkeleton';
import { Product } from '@/hooks/useProducts';
import { Category } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';

interface ProductsGridProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const ProductsGrid = ({
  products,
  categories,
  isLoading,
  selectedCategory,
  onCategoryChange
}: ProductsGridProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <section id="products" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center animate-slide-up">
        <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          BuildMC Shop
        </h2>
      </div>

      <Tabs defaultValue="all" onValueChange={onCategoryChange} className="w-full">
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
          {isLoading ? (
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
  );
};
