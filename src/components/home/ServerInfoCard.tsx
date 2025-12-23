import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Package, Copy, Check } from 'lucide-react';

interface ServerInfoCardProps {
  settings: Record<string, string>;
}

export const ServerInfoCard = ({ settings }: ServerInfoCardProps) => {
  const [copiedIP, setCopiedIP] = useState(false);

  const copyServerIP = () => {
    const serverIP = settings['server_ip'] || 'play.buildmc.net';
    navigator.clipboard.writeText(serverIP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  if (!settings['server_ip'] && !settings['server_version']) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-10">
      <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          {settings['server_ip'] && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Server IP</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    🇧🇩 BD
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-foreground">{settings['server_ip']}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyServerIP}
                    className="h-8 w-8"
                  >
                    {copiedIP ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {settings['server_version'] && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-lg font-bold text-foreground">{settings['server_version']}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
