import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import { Package } from 'lucide-react';

const checkoutSchema = z.object({
  customerRealName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  minecraftName: z.string().trim().min(2, 'Minecraft name is required'),
  customerPhone: z.string().trim().min(10, 'Valid phone number required'),
  customerEmail: z.string().trim().email('Invalid email address'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
}

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerRealName: '',
    minecraftName: '',
    customerPhone: '',
    customerEmail: user?.email || '',
    paymentMethod: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId, user, navigate]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (!error && data) {
      setProduct(data);
    } else {
      toast.error('Product not found');
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      checkoutSchema.parse(formData);

      if (!product || !user) return;

      if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
      }

      setLoading(true);

      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        product_id: product.id,
        customer_real_name: formData.customerRealName,
        minecraft_name: formData.minecraftName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail,
        payment_method: formData.paymentMethod,
        total_price: product.price,
        status: 'unpaid',
      });

      if (error) throw error;

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error.message || 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-24 h-24 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg">Total</span>
                <span className="text-3xl font-bold text-primary">${product.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
              <CardDescription>Fill in your information for the order</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerRealName">Real Name *</Label>
                  <Input
                    id="customerRealName"
                    value={formData.customerRealName}
                    onChange={(e) => setFormData({ ...formData, customerRealName: e.target.value })}
                    className={errors.customerRealName ? 'border-destructive' : ''}
                  />
                  {errors.customerRealName && <p className="text-sm text-destructive">{errors.customerRealName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minecraftName">Minecraft Username *</Label>
                  <Input
                    id="minecraftName"
                    value={formData.minecraftName}
                    onChange={(e) => setFormData({ ...formData, minecraftName: e.target.value })}
                    className={errors.minecraftName ? 'border-destructive' : ''}
                  />
                  {errors.minecraftName && <p className="text-sm text-destructive">{errors.minecraftName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className={errors.customerPhone ? 'border-destructive' : ''}
                  />
                  {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className={errors.customerEmail ? 'border-destructive' : ''}
                  />
                  {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger className={errors.paymentMethod ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="venmo">Venmo</SelectItem>
                      <SelectItem value="cashapp">Cash App</SelectItem>
                      <SelectItem value="zelle">Zelle</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
