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
  const [statBoxes, setStatBoxes] = useState<StatBox[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Our Story fields
  const [storyTitle, setStoryTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storyButtonText, setStoryButtonText] = useState("");
  const [storyButtonUrl, setStoryButtonUrl] = useState("");
  
  // Server Info fields
  const [serverIp, setServerIp] = useState("");
  const [serverVersion, setServerVersion] = useState("");
  
  // Hero Section fields
  const [heroGreeting, setHeroGreeting] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");
  
  // CTA Section fields
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaSubtitle, setCtaSubtitle] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");

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
        .select("*");

      if (settingsError) throw settingsError;
      
      // Map settings to state
      const settingsMap = settingsData?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, string>) || {};
      
      setStoryTitle(settingsMap.story_title || "");
      setStoryText(settingsMap.story_text || "");
      setStoryButtonText(settingsMap.story_button_text || "");
      setStoryButtonUrl(settingsMap.story_button_url || "");
      setServerIp(settingsMap.server_ip || "");
      setServerVersion(settingsMap.server_version || "");
      setHeroGreeting(settingsMap.hero_greeting || "");
      setHeroTitle(settingsMap.hero_title || "");
      setHeroSubtitle(settingsMap.hero_subtitle || "");
      setHeroButtonText(settingsMap.hero_button_text || "");
      setCtaTitle(settingsMap.cta_title || "");
      setCtaSubtitle(settingsMap.cta_subtitle || "");
      setCtaButtonText(settingsMap.cta_button_text || "");

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

  const saveAllSettings = async () => {
    try {
      console.log("Saving all settings...");
      const settings = [
        { setting_key: "story_title", setting_value: storyTitle },
        { setting_key: "story_text", setting_value: storyText },
        { setting_key: "story_button_text", setting_value: storyButtonText },
        { setting_key: "story_button_url", setting_value: storyButtonUrl },
        { setting_key: "server_ip", setting_value: serverIp },
        { setting_key: "server_version", setting_value: serverVersion },
        { setting_key: "hero_greeting", setting_value: heroGreeting },
        { setting_key: "hero_title", setting_value: heroTitle },
        { setting_key: "hero_subtitle", setting_value: heroSubtitle },
        { setting_key: "hero_button_text", setting_value: heroButtonText },
        { setting_key: "cta_title", setting_value: ctaTitle },
        { setting_key: "cta_subtitle", setting_value: ctaSubtitle },
        { setting_key: "cta_button_text", setting_value: ctaButtonText },
      ];

      console.log("Settings to save:", settings);

      for (const setting of settings) {
        const { data, error } = await supabase
          .from("site_settings")
          .upsert(setting, { onConflict: 'setting_key' })
          .select();

        console.log("Upsert result for", setting.setting_key, ":", data, error);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "All settings saved successfully",
      });
      
      await fetchData();
    } catch (error: any) {
      console.error("Save settings error:", error);
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
      console.log("Saving stat boxes:", statBoxes);
      
      // Delete all existing stat boxes and insert new ones
      const { error: deleteError } = await supabase
        .from("stat_boxes")
        .delete()
        .gte("id", "00000000-0000-0000-0000-000000000000");

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

      // Filter out empty stat boxes
      const validBoxes = statBoxes.filter(box => box.label && box.value);
      console.log("Valid boxes to insert:", validBoxes);

      if (validBoxes.length > 0) {
        const { data, error: insertError } = await supabase
          .from("stat_boxes")
          .insert(validBoxes.map(({ id, ...box }) => box))
          .select();

        console.log("Insert result:", data, insertError);
        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Stat boxes saved successfully",
      });
      
      await fetchData();
    } catch (error: any) {
      console.error("Save stat boxes error:", error);
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

        {/* Hero Section */}
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

        {/* Server Info */}
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
          </CardContent>
        </Card>

        {/* Our Story Section */}
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

        {/* CTA Section */}
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

        {/* Save All Button */}
        <Card className="glass-effect mb-8 border-primary/20">
          <CardContent className="pt-6">
            <Button onClick={saveAllSettings} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All Website Settings
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