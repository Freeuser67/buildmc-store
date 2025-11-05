import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Type } from "lucide-react";

interface StorySectionProps {
  storyTitle: string;
  setStoryTitle: (value: string) => void;
  storyText: string;
  setStoryText: (value: string) => void;
  storyButtonText: string;
  setStoryButtonText: (value: string) => void;
  storyButtonUrl: string;
  setStoryButtonUrl: (value: string) => void;
}

export const StorySection = ({
  storyTitle,
  setStoryTitle,
  storyText,
  setStoryText,
  storyButtonText,
  setStoryButtonText,
  storyButtonUrl,
  setStoryButtonUrl,
}: StorySectionProps) => {
  return (
    <Card className="glass-effect mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Our Story Section
        </CardTitle>
        <CardDescription>
          Manage the story section content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Story Title</Label>
          <Input
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            placeholder="e.g., Our Story"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Story Text</Label>
          <Textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Tell your story..."
            className="mt-2 min-h-[120px]"
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={storyButtonText}
            onChange={(e) => setStoryButtonText(e.target.value)}
            placeholder="e.g., Learn More"
            className="mt-2"
          />
        </div>
        <div>
          <Label>Button URL</Label>
          <Input
            value={storyButtonUrl}
            onChange={(e) => setStoryButtonUrl(e.target.value)}
            placeholder="e.g., /about"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
