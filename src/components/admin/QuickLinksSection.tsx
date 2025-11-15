import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Save } from "lucide-react";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  quick_text?: string;
  display_order: number;
  is_text_only?: boolean;
}

interface QuickLinksSectionProps {
  quickLinks: QuickLink[];
  onAdd: () => void;
  onAddText: () => void;
  onUpdate: (id: string, field: keyof QuickLink, value: string | number | boolean) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
}

export const QuickLinksSection = ({
  quickLinks,
  onAdd,
  onAddText,
  onUpdate,
  onDelete,
  onSave,
}: QuickLinksSectionProps) => {
  return (
    <Card className="glass-effect border-primary/20">
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
        <CardDescription>
          Manage footer quick links. Add important links like Discord, Wiki, Rules, or Social Media pages. These will appear in the footer of your site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickLinks.map((link) => (
          <div key={link.id} className="flex gap-2 items-start p-4 bg-card/50 rounded-lg border border-border/50">
            <div className="flex-1 space-y-2">
              <Input
                placeholder={link.is_text_only ? "Text Title" : "Link Title"}
                value={link.title}
                onChange={(e) => onUpdate(link.id, "title", e.target.value)}
              />
              {!link.is_text_only && (
                <Input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => onUpdate(link.id, "url", e.target.value)}
                />
              )}
              <Input
                placeholder={link.is_text_only ? "Text content" : "Quick text (optional description)"}
                value={link.quick_text || ""}
                onChange={(e) => onUpdate(link.id, "quick_text", e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(link.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={onAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
          <Button onClick={onAddText} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Text
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
