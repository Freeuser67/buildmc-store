import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { OrderCardSkeleton } from '@/components/LoadingSkeleton';

interface Order {
  id: string;
  customer_real_name: string;
  minecraft_name: string;
  customer_phone: string;
  customer_email: string;
  payment_method: string;
  status: string;
  total_price: number;
  created_at: string;
  products: {
    name: string;
    description: string | null;
  };
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name, description)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-secondary" />;
      default:
        return <XCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-lg text-muted-foreground">Track and manage your BuildMC purchases</p>
        </div>

        {loading ? (
          <div className="space-y-6 animate-slide-up">
            {[1, 2, 3].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-16 text-center border-2 border-dashed border-border/50 bg-card/30 backdrop-blur rounded-2xl animate-slide-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold text-muted-foreground mb-2">No orders yet</p>
            <p className="text-muted-foreground/70">Start shopping to see your orders here!</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <Card 
                key={order.id} 
                className="group border-2 border-border/50 bg-card/50 backdrop-blur hover-lift hover:border-primary/50 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {order.products.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge 
                        variant={getStatusVariant(order.status)}
                        className="font-semibold px-3 py-1"
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Minecraft Name</p>
                      <p className="text-base font-semibold">{order.minecraft_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                      <p className="text-base font-semibold capitalize">{order.payment_method}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                      <p className="font-bold text-primary text-2xl">৳{order.total_price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
