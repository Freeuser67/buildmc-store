import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trash2, Eye, EyeOff } from 'lucide-react';

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
  };
}

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [visiblePII, setVisiblePII] = useState<Set<string>>(new Set());

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name[0]}${'*'.repeat(Math.min(name.length - 1, 3))}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return `*****${phone.slice(-4)}`;
  };

  const togglePIIVisibility = (orderId: string) => {
    setVisiblePII(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
        toast.info('PII masked for security');
      } else {
        newSet.add(orderId);
        toast.info('Viewing full customer details');
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Order status updated!');
      fetchOrders();
    }
  };

  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to delete order');
    } else {
      toast.success('Order deleted successfully!');
      fetchOrders();
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Manage Orders
          </h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-[0_0_20px_rgba(0,255,128,0.15)] transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{order.products.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8)} •{' '}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusIcon(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePIIVisibility(order.id)}
                    className="gap-2"
                  >
                    {visiblePII.has(order.id) ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        View Full Details
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-medium">{order.customer_real_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Minecraft Name</p>
                    <p className="font-medium">{order.minecraft_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {visiblePII.has(order.id) ? order.customer_email : maskEmail(order.customer_email)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {visiblePII.has(order.id) ? order.customer_phone : maskPhone(order.customer_phone)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-bold text-primary text-xl">৳{order.total_price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-medium">Update Status:</Label>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteOrder(order.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
