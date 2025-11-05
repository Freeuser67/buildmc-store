import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Type } from "lucide-react";

interface CTASectionProps {
  ctaTitle: string;
  setCtaTitle: (value: string) => void;
  ctaSubtitle: string;
  setCtaSubtitle: (value: string) => void;
  ctaButtonText: string;
  setCtaButtonText: (value: string) => void;
}

export const CTASection = ({
  ctaTitle,
  setCtaTitle,
  ctaSubtitle,
  setCtaSubtitle,
  ctaButtonText,
  setCtaButtonText,
}: CTASectionProps) => {
  return (
    <Card className="glass-effect mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Call-to-Action Section
        </CardTitle>
        <CardDescription>
          Manage the bottom CTA section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>CTA Title</Label>
          <Input
            value={ctaTitle}
            onChange={(e) => setCtaTitle(e.target.value)}
            placeholder="e.g., Ready to Start?"
            className="mt-2"
          />
        </div>
        <div>
          <Label>CTA Subtitle</Label>
          <Textarea
            value={ctaSubtitle}
            onChange={(e) => setCtaSubtitle(e.target.value)}
            placeholder="e.g., Join our community..."
            className="mt-2 min-h-[60px]"
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={ctaButtonText}
            onChange={(e) => setCtaButtonText(e.target.value)}
            placeholder="e.g., Join Now"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
