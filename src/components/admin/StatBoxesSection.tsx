import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Save, Type } from "lucide-react";

interface StatBox {
  id: string;
  icon: string;
  label: string;
  value: string;
  display_order: number;
}

interface StatBoxesSectionProps {
  statBoxes: StatBox[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof StatBox, value: string | number) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
}

export const StatBoxesSection = ({
  statBoxes,
  onAdd,
  onUpdate,
  onDelete,
  onSave,
}: StatBoxesSectionProps) => {
  return (
    <Card className="glass-effect mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          Homepage Statistics
        </CardTitle>
        <CardDescription>
          Manage the stat boxes (Active Players, Events Hosted, Uptime, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statBoxes.map((box) => (
          <div key={box.id} className="flex gap-2 items-start p-4 bg-card/50 rounded-lg border border-border/50">
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Icon Name (e.g., Users, Calendar, Clock)"
                value={box.icon}
                onChange={(e) => onUpdate(box.id, "icon", e.target.value)}
              />
              <Input
                placeholder="Label (e.g., Active Players)"
                value={box.label}
                onChange={(e) => onUpdate(box.id, "label", e.target.value)}
              />
              <Input
                placeholder="Value (e.g., 15K+)"
                value={box.value}
                onChange={(e) => onUpdate(box.id, "value", e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(box.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Button onClick={onAdd} variant="outline" className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Stat Box
          </Button>
          <Button onClick={onSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Stat Boxes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
