import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { Mail, Lock, User, Chrome } from 'lucide-react';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }).max(255, { message: 'Email too long' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password too long' }),
  fullName: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).max(100, { message: 'Name too long' }).optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle, signInWithDiscord, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'website_logo')
        .maybeSingle();
      
      if (data?.setting_value) {
        setLogoUrl(data.setting_value);
      }
    };

    fetchLogo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const data = isLogin 
        ? { email, password } 
        : { email, password, fullName };
      
      authSchema.parse(data);

      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 border-2 border-primary/20 shadow-2xl backdrop-blur-xl bg-card/80 animate-fade-in overflow-hidden">
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <div className="p-8 space-y-6">
          {/* Logo and title */}
          <div className="text-center space-y-4">
            <Link to="/" className="inline-block">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="mx-auto w-20 h-20 rounded-3xl object-contain shadow-lg hover:scale-105 transition-transform" />
              ) : (
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg glow-effect transform hover:scale-105 transition-transform">
                  <span className="text-4xl font-black text-white">B</span>
                </div>
              )}
            </Link>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className={`h-12 bg-background/50 border-2 transition-all ${
                    errors.fullName 
                      ? 'border-destructive focus:border-destructive' 
                      : 'border-primary/20 focus:border-primary'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-12 bg-background/50 border-2 transition-all ${
                  errors.email 
                    ? 'border-destructive focus:border-destructive' 
                    : 'border-primary/20 focus:border-primary'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`h-12 bg-background/50 border-2 transition-all ${
                  errors.password 
                    ? 'border-destructive focus:border-destructive' 
                    : 'border-primary/20 focus:border-primary'
                }`}
              />
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  {errors.password}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all glow-effect"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social sign in buttons */}
          <div className="space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 gap-3 text-base font-semibold border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              onClick={signInWithGoogle}
            >
              <Chrome className="w-5 h-5 group-hover:text-primary transition-colors" />
              Continue with Google
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 gap-3 text-base font-semibold border-2 border-[#5865F2]/30 hover:border-[#5865F2]/60 hover:bg-[#5865F2]/10 transition-all group"
              onClick={signInWithDiscord}
            >
              <svg className="w-5 h-5 group-hover:text-[#5865F2] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Continue with Discord
            </Button>
          </div>

          {/* Toggle auth mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setEmail('');
                setPassword('');
                setFullName('');
              }}
              className="text-sm font-medium text-primary hover:text-secondary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
