import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type } from "lucide-react";

interface CommunityStatsSectionProps {
  activePlayers: string;
  setActivePlayers: (value: string) => void;
  eventsHosted: string;
  setEventsHosted: (value: string) => void;
  uptime: string;
  setUptime: (value: string) => void;
}

export const CommunityStatsSection = ({
  activePlayers,
  setActivePlayers,
  eventsHosted,
  setEventsHosted,
  uptime,
  setUptime,
}: CommunityStatsSectionProps) => {
  return (
    <Card className="glass-effect mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Community Stats (Shop Page)
        </CardTitle>
        <CardDescription>
          Edit the Active Players, Events Hosted, and Uptime values displayed on the Shop page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Active Players</Label>
          <Input
            value={activePlayers}
            onChange={(e) => setActivePlayers(e.target.value)}
            placeholder="e.g., 15K+"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Events Hosted</Label>
          <Input
            value={eventsHosted}
            onChange={(e) => setEventsHosted(e.target.value)}
            placeholder="e.g., 500+"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Uptime</Label>
          <Input
            value={uptime}
            onChange={(e) => setUptime(e.target.value)}
            placeholder="e.g., 24/7"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
