import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2 transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow glow-effect">
            <span className="text-2xl font-black text-primary-foreground">B</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            BuildMC Store
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant={theme === "minecraft" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("minecraft")}
              className="text-xs"
            >
              Normal
            </Button>
            <Button
              variant={theme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme("light")}
              className="text-xs"
            >
              <Sun className="w-3 h-3 mr-1" />
              Light
            </Button>
          </div>
          
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="gap-2 border-2 hover:border-primary/50 transition-all">
                  <Link to="/admin">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm" className="gap-2 border-2 hover:border-primary/50 transition-all">
                <Link to="/orders">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Orders</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="gap-2 shadow-lg hover:shadow-xl transition-all glow-effect">
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
