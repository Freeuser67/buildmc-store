import { Shield, Zap } from 'lucide-react';

export const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Why Choose Us?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the best Minecraft shopping with our premium features and dedicated support
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="group text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift hover:border-primary/50 transition-all">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="w-10 h-10 text-primary animate-float" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-foreground">Secure Payments</h3>
          <p className="text-muted-foreground leading-relaxed">Safe and secure bKash payment processing with instant confirmation</p>
        </div>
        
        <div className="group text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift hover:border-primary/50 transition-all">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-10 h-10 text-secondary animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-foreground">Instant Delivery</h3>
          <p className="text-muted-foreground leading-relaxed">Get your purchases delivered instantly to your account without delays</p>
        </div>
      </div>
    </div>
  );
};
