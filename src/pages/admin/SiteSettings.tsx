import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save, ExternalLink, Type } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  display_order: number;
}

interface StatBox {
  id: string;
  icon: string;
  label: string;
  value: string;
  display_order: number;
}

interface SiteSetting {
  id?: string;
  setting_key: string;
  setting_value: string;
  description?: string;
}

const SiteSettings = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [textSettings, setTextSettings] = useState<SiteSetting[]>([]);
  const [statBoxes, setStatBoxes] = useState<StatBox[]>([]);
  const [newSettingKey, setNewSettingKey] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");
  const [newSettingDescription, setNewSettingDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    try {
      // Fetch quick links
      const { data: linksData, error: linksError } = await supabase
        .from("quick_links")
        .select("*")
        .order("display_order");

      if (linksError) throw linksError;
      setQuickLinks(linksData || []);

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("site_settings")
        .select("*")
        .order("setting_key");

      if (settingsError) throw settingsError;
      
      setTextSettings(settingsData || []);

      // Fetch stat boxes
      const { data: statBoxesData, error: statBoxesError } = await supabase
        .from("stat_boxes")
        .select("*")
        .order("display_order");

      if (statBoxesError) throw statBoxesError;
      setStatBoxes(statBoxesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuickLink = () => {
    const newOrder = quickLinks.length > 0 ? Math.max(...quickLinks.map(l => l.display_order)) + 1 : 0;
    setQuickLinks([...quickLinks, { 
      id: crypto.randomUUID(), 
      title: "", 
      url: "", 
      display_order: newOrder 
    }]);
  };

  const updateQuickLink = (id: string, field: keyof QuickLink, value: string | number) => {
    setQuickLinks(quickLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const deleteQuickLink = async (id: string) => {
    if (id.length === 36 && id.includes("-")) {
      const { error } = await supabase
        .from("quick_links")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }
    setQuickLinks(quickLinks.filter(link => link.id !== id));
  };

  const saveQuickLinks = async () => {
    try {
      // Delete all existing links and insert new ones
      const { error: deleteError } = await supabase
        .from("quick_links")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (deleteError) throw deleteError;

      // Filter out empty links
      const validLinks = quickLinks.filter(link => link.title && link.url);

      if (validLinks.length > 0) {
        const { error: insertError } = await supabase
          .from("quick_links")
          .insert(validLinks.map(({ id, ...link }) => link));

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Quick links saved successfully",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTextSetting = (id: string, field: keyof SiteSetting, value: string) => {
    setTextSettings(textSettings.map(setting =>
      setting.id === id ? { ...setting, [field]: value } : setting
    ));
  };

  const addTextSetting = () => {
    if (!newSettingKey || !newSettingValue) {
      toast({
        title: "Error",
        description: "Please fill in both key and value",
        variant: "destructive",
      });
      return;
    }

    const newSetting: SiteSetting = {
      id: crypto.randomUUID(),
      setting_key: newSettingKey,
      setting_value: newSettingValue,
      description: newSettingDescription || undefined,
    };

    setTextSettings([...textSettings, newSetting]);
    setNewSettingKey("");
    setNewSettingValue("");
    setNewSettingDescription("");
  };

  const deleteTextSetting = async (id: string, settingKey: string) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .delete()
        .eq("setting_key", settingKey);

      if (error) throw error;

      setTextSettings(textSettings.filter(s => s.id !== id));
      
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveTextSettings = async () => {
    try {
      for (const setting of textSettings) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(
            {
              setting_key: setting.setting_key,
              setting_value: setting.setting_value,
            },
            { onConflict: 'setting_key' }
          );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "All text settings saved successfully",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Stat Box Management
  const addStatBox = () => {
    const newOrder = statBoxes.length > 0 ? Math.max(...statBoxes.map(s => s.display_order)) + 1 : 0;
    setStatBoxes([...statBoxes, { 
      id: crypto.randomUUID(), 
      icon: "TrendingUp",
      label: "", 
      value: "", 
      display_order: newOrder 
    }]);
  };

  const updateStatBox = (id: string, field: keyof StatBox, value: string | number) => {
    setStatBoxes(statBoxes.map(box => 
      box.id === id ? { ...box, [field]: value } : box
    ));
  };

  const deleteStatBox = async (id: string) => {
    if (id.length === 36 && id.includes("-")) {
      const { error } = await supabase
        .from("stat_boxes")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }
    setStatBoxes(statBoxes.filter(box => box.id !== id));
  };

  const saveStatBoxes = async () => {
    try {
      // Delete all existing stat boxes and insert new ones
      const { error: deleteError } = await supabase
        .from("stat_boxes")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (deleteError) throw deleteError;

      // Filter out empty stat boxes
      const validBoxes = statBoxes.filter(box => box.label && box.value);

      if (validBoxes.length > 0) {
        const { error: insertError } = await supabase
          .from("stat_boxes")
          .insert(validBoxes.map(({ id, ...box }) => box));

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Stat boxes saved successfully",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Site Settings
        </h1>

        {/* Text Content Management */}
        <Card className="glass-effect mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Website Text Content
            </CardTitle>
            <CardDescription>
              Manage all text content including Active Players, Events Hosted, Uptime, hero text, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Current Settings</h3>
              {textSettings.map((setting) => (
                <div key={setting.id} className="p-4 bg-card/50 rounded-lg border border-border/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Setting Key</Label>
                        <Input
                          value={setting.setting_key}
                          onChange={(e) => updateTextSetting(setting.id!, "setting_key", e.target.value)}
                          placeholder="e.g., active_players"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Value</Label>
                        <Textarea
                          value={setting.setting_value}
                          onChange={(e) => updateTextSetting(setting.id!, "setting_value", e.target.value)}
                          placeholder="e.g., 15K+"
                          className="mt-1 min-h-[60px]"
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteTextSetting(setting.id!, setting.setting_key)}
                      className="ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Setting */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Add New Setting</h3>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                <div>
                  <Label htmlFor="newKey">Setting Key</Label>
                  <Input
                    id="newKey"
                    value={newSettingKey}
                    onChange={(e) => setNewSettingKey(e.target.value)}
                    placeholder="e.g., active_players, hero_title, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="newValue">Value</Label>
                  <Textarea
                    id="newValue"
                    value={newSettingValue}
                    onChange={(e) => setNewSettingValue(e.target.value)}
                    placeholder="e.g., 15K+, BuildMC, etc."
                    className="mt-2 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="newDescription">Description (Optional)</Label>
                  <Input
                    id="newDescription"
                    value={newSettingDescription}
                    onChange={(e) => setNewSettingDescription(e.target.value)}
                    placeholder="What this setting controls"
                    className="mt-2"
                  />
                </div>
                <Button onClick={addTextSetting} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Setting
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={saveTextSettings} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All Text Settings
            </Button>
          </CardContent>
        </Card>

        {/* Stat Boxes Management */}
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
                    onChange={(e) => updateStatBox(box.id, "icon", e.target.value)}
                  />
                  <Input
                    placeholder="Label (e.g., Active Players)"
                    value={box.label}
                    onChange={(e) => updateStatBox(box.id, "label", e.target.value)}
                  />
                  <Input
                    placeholder="Value (e.g., 15K+)"
                    value={box.value}
                    onChange={(e) => updateStatBox(box.id, "value", e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteStatBox(box.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={addStatBox} variant="outline" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Stat Box
              </Button>
              <Button onClick={saveStatBoxes} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Stat Boxes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="glass-effect border-primary/20">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Manage footer quick links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickLinks.map((link, index) => (
              <div key={link.id} className="flex gap-2 items-start p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Link Title"
                    value={link.title}
                    onChange={(e) => updateQuickLink(link.id, "title", e.target.value)}
                  />
                  <Input
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateQuickLink(link.id, "url", e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteQuickLink(link.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={addQuickLink} variant="outline" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
              <Button onClick={saveQuickLinks} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Quick Links
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettings;