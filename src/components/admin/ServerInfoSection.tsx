import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type } from "lucide-react";

interface ServerInfoSectionProps {
  serverIp: string;
  setServerIp: (value: string) => void;
  serverVersion: string;
  setServerVersion: (value: string) => void;
  discordServerId: string;
  setDiscordServerId: (value: string) => void;
}

export const ServerInfoSection = ({
  serverIp,
  setServerIp,
  serverVersion,
  setServerVersion,
  discordServerId,
  setDiscordServerId,
}: ServerInfoSectionProps) => {
  return (
    <Card className="glass-effect mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Server Information
        </CardTitle>
        <CardDescription>
          Manage server IP and version display
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Server IP</Label>
          <Input
            value={serverIp}
            onChange={(e) => setServerIp(e.target.value)}
            placeholder="e.g., play.buildmc.com"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Server Version</Label>
          <Input
            value={serverVersion}
            onChange={(e) => setServerVersion(e.target.value)}
            placeholder="e.g., 1.20.x"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Discord Server ID</Label>
          <Input
            value={discordServerId}
            onChange={(e) => setDiscordServerId(e.target.value)}
            placeholder="e.g., 1234567890123456789"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Get your server ID from Discord Server Settings → Widget → Enable Widget
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
