import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Package, ShoppingCart, FolderOpen, DollarSign, Settings, Users } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  totalRevenue: number;
  pendingOrders: number;
}

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [isAdmin, navigate]);

  const fetchStats = async () => {
    const [productsRes, ordersRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_price), 0);
    const pendingOrders = orders.filter(o => o.status !== 'completed').length;

    setStats({
      totalProducts: productsRes.count || 0,
      totalOrders: orders.length,
      totalCategories: categoriesRes.count || 0,
      totalRevenue,
      pendingOrders,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-[0_0_20px_rgba(0,255,128,0.15)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-[0_0_20px_rgba(0,255,128,0.15)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-[0_0_20px_rgba(0,255,128,0.15)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-[0_0_20px_rgba(0,255,128,0.15)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">৳{stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Button asChild size="lg" className="h-32 hover:scale-105 transition-all">
            <Link to="/admin/categories" className="flex flex-col gap-2">
              <FolderOpen className="w-8 h-8" />
              <span>Manage Categories</span>
            </Link>
          </Button>

          <Button asChild size="lg" className="h-32 hover:scale-105 transition-all">
            <Link to="/admin/products" className="flex flex-col gap-2">
              <Package className="w-8 h-8" />
              <span>Manage Products</span>
            </Link>
          </Button>

          <Button asChild size="lg" className="h-32 hover:scale-105 transition-all">
            <Link to="/admin/orders" className="flex flex-col gap-2">
              <ShoppingCart className="w-8 h-8" />
              <span>Manage Orders</span>
            </Link>
          </Button>

          <Button asChild size="lg" className="h-32 hover:scale-105 transition-all bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
            <Link to="/admin/users" className="flex flex-col gap-2">
              <Users className="w-8 h-8" />
              <span>Manage Admins</span>
            </Link>
          </Button>

          <Button asChild size="lg" className="h-32 hover:scale-105 transition-all" variant="outline">
            <Link to="/admin/settings" className="flex flex-col gap-2">
              <Settings className="w-8 h-8" />
              <span>Site Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
