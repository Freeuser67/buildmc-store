import { Youtube, MessageCircle, Users, Trophy, Sparkles } from 'lucide-react';
import { QuickLink } from '@/hooks/useQuickLinks';
import { toExternalUrl } from '@/lib/utils';

interface ShopFooterProps {
  quickLinks: QuickLink[];
  discordUrl: string;
  youtubeUrl: string;
  activePlayers: string;
  eventsHosted: string;
  uptime: string;
  websiteLogo?: string;
}

export const ShopFooter = ({
  quickLinks,
  discordUrl,
  youtubeUrl,
  activePlayers,
  eventsHosted,
  uptime,
  websiteLogo
}: ShopFooterProps) => {
  const safeDiscordUrl = toExternalUrl(discordUrl);
  const safeYoutubeUrl = toExternalUrl(youtubeUrl);

  return (
    <footer className="relative border-t border-border/50 py-16 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {websiteLogo ? (
                  <img 
                    src={websiteLogo} 
                    alt="BuildMC Logo" 
                    className="w-16 h-16 rounded-2xl object-cover glow-effect"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center glow-effect">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BuildMC</h3>
                  <p className="text-muted-foreground font-medium">Premium Minecraft Store</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your ultimate destination for premium Minecraft ranks, kits, and exclusive items. Join thousands of players who trust BuildMC!
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-foreground">Quick Links</h4>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  link.is_text_only ? (
                    <p key={link.id} className="text-muted-foreground">
                      {link.quick_text || link.title}
                    </p>
                  ) : (
                    <a
                      key={link.id}
                      href={toExternalUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {link.title}
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-foreground">Community Stats</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="glass-effect rounded-xl p-4 text-center neon-border">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-black text-foreground">{activePlayers}</p>
                  <p className="text-sm text-muted-foreground">Active Players</p>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center neon-border">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-black text-foreground">{eventsHosted}</p>
                  <p className="text-sm text-muted-foreground">Events Hosted</p>
                </div>
              </div>
              <div className="glass-effect rounded-xl p-4 text-center neon-border">
                <p className="text-3xl font-black text-primary">{uptime}</p>
                <p className="text-muted-foreground font-medium">Server Uptime</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-border/50">
            <a
              href={safeDiscordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-effect rounded-2xl px-8 py-4 flex items-center gap-3 hover:neon-border hover:scale-105 transition-all group"
            >
              <MessageCircle className="w-6 h-6 text-[#5865F2] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-foreground">Join Discord</span>
            </a>
            <a
              href={safeYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-effect rounded-2xl px-8 py-4 flex items-center gap-3 hover:neon-border hover:scale-105 transition-all group"
            >
              <Youtube className="w-6 h-6 text-[#FF0000] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-foreground">Subscribe</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} BuildMC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
