import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Server, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-minecraft.jpg';
import MouseSparkle from '@/components/MouseSparkle';

interface ShopHeroProps {
  serverIP: string;
  serverStatus: string;
  discordMembers: string;
  discordServerId: string;
  heroTitle: string;
  heroSubtitle: string;
}

export const ShopHero = ({
  serverIP,
  serverStatus,
  discordMembers,
  discordServerId,
  heroTitle,
  heroSubtitle
}: ShopHeroProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      setCopied(true);
      toast.success('Server IP copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy IP');
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <MouseSparkle />
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="BuildMC Minecraft Server" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center space-y-8 px-4 max-w-5xl mx-auto animate-fade-in">
          {/* Server Status Badge */}
          <div className="inline-block mb-4">
            <div className="flex gap-4 items-center">
              <div className="glass-effect flex items-center gap-3 rounded-full px-6 py-3 neon-border hover:scale-105 transition-all">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse glow-effect" />
                <span className="text-primary font-bold text-base">{serverStatus}</span>
              </div>

              {discordServerId && (
                <div className="glass-effect flex items-center gap-3 rounded-full px-6 py-3 neon-border hover:scale-105 transition-all">
                  <MessageCircle className="w-5 h-5 text-secondary animate-pulse" />
                  <span className="text-secondary font-bold text-base">In Discord {discordMembers} Online Members</span>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-float drop-shadow-2xl">
              {heroTitle}
            </span>
          </h1>

          <p className="text-2xl md:text-4xl text-foreground/90 font-semibold max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>

          {/* Server IP Card */}
          <div className="inline-flex items-center gap-4 glass-effect px-10 py-5 rounded-2xl neon-border group hover:scale-105 transition-all">
            <Server className="w-6 h-6 text-primary animate-pulse" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground font-medium">Join Our Server</p>
              <Button
                variant="ghost"
                className="gap-3 text-primary font-mono text-2xl hover:bg-primary/10 font-bold px-4 py-1 rounded-lg h-auto"
                onClick={handleCopyIP}
              >
                {serverIP}
                {copied ? 
                  <Check className="w-6 h-6 text-secondary glow-secondary" /> : 
                  <Copy className="w-6 h-6 group-hover:scale-125 transition-transform" />
                }
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};
