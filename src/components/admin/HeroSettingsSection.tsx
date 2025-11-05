import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Type } from "lucide-react";

interface HeroSettingsSectionProps {
  heroGreeting: string;
  setHeroGreeting: (value: string) => void;
  heroTitle: string;
  setHeroTitle: (value: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (value: string) => void;
  heroButtonText: string;
  setHeroButtonText: (value: string) => void;
}

export const HeroSettingsSection = ({
  heroGreeting,
  setHeroGreeting,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  heroButtonText,
  setHeroButtonText,
}: HeroSettingsSectionProps) => {
  return (
    <Card className="glass-effect mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Hero Section
        </CardTitle>
        <CardDescription>
          Manage the main hero banner text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Greeting Text</Label>
          <Input
            value={heroGreeting}
            onChange={(e) => setHeroGreeting(e.target.value)}
            placeholder="e.g., Welcome to BuildMC"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Main Title</Label>
          <Input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="e.g., Build Your Dreams"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="e.g., Join thousands of players..."
            className="mt-2 min-h-[80px]"
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={heroButtonText}
            onChange={(e) => setHeroButtonText(e.target.value)}
            placeholder="e.g., Start Playing"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
