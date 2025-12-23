import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { Category } from '@/hooks/useCategories';

interface ProductsPreviewProps {
  products: Product[];
  categories: Category[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ProductsPreview = ({ products, categories, selectedFilter, onFilterChange }: ProductsPreviewProps) => {
  const filteredProducts = selectedFilter === 'all'
    ? products
    : products.filter(p => p.category_id === selectedFilter);

  return (
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

      {/* Filter Tabs */}
      <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
        <div className="flex gap-2">
          {categories.slice(0, Math.floor(categories.length / 2)).map((cat) => (
            <Button
              key={cat.id}
              variant={selectedFilter === cat.id ? "default" : "outline"}
              onClick={() => onFilterChange(cat.id)}
              className="rounded-xl px-6 py-3 font-semibold"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <Button
          variant={selectedFilter === 'all' ? "default" : "outline"}
          onClick={() => onFilterChange('all')}
          className="rounded-xl px-8 py-3 font-semibold text-lg shadow-lg"
        >
          All Items
        </Button>

        <div className="flex gap-2">
          {categories.slice(Math.floor(categories.length / 2)).map((cat) => (
            <Button
              key={cat.id}
              variant={selectedFilter === cat.id ? "default" : "outline"}
              onClick={() => onFilterChange(cat.id)}
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
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={product.stock > 0 ? "default" : "secondary"}
                    className="shadow-lg"
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ৳{product.price}
                  </span>
                  <Button 
                    asChild 
                    disabled={product.stock === 0}
                    className="gap-2"
                  >
                    <Link to={`/checkout/${product.id}`}>
                      <ShoppingCart className="w-4 h-4" />
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
  );
};
