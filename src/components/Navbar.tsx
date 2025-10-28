import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BuildMC Store
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link to="/admin">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to="/orders">
                  <ShoppingCart className="w-4 h-4" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="gap-2">
              <Link to="/auth">
                <User className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
