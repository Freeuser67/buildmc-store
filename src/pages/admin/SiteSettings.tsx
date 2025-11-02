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
import { Trash2, Plus, Save, ExternalLink } from "lucide-react";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  display_order: number;
}

interface SiteSetting {
  setting_key: string;
  setting_value: string;
}

const SiteSettings = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [discordUrl, setDiscordUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
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
        .select("*");

      if (settingsError) throw settingsError;
      
      const settings = settingsData as SiteSetting[];
      setDiscordUrl(settings.find(s => s.setting_key === "discord_url")?.setting_value || "");
      setYoutubeUrl(settings.find(s => s.setting_key === "youtube_url")?.setting_value || "");
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

  const saveSocialLinks = async () => {
    try {
      const { error: discordError } = await supabase
        .from("site_settings")
        .upsert({ setting_key: "discord_url", setting_value: discordUrl });

      if (discordError) throw discordError;

      const { error: youtubeError } = await supabase
        .from("site_settings")
        .upsert({ setting_key: "youtube_url", setting_value: youtubeUrl });

      if (youtubeError) throw youtubeError;

      toast({
        title: "Success",
        description: "Social links saved successfully",
      });
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

        {/* Social Links */}
        <Card className="glass-effect mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Social Links
            </CardTitle>
            <CardDescription>Manage Discord and YouTube links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="discord">Discord URL</Label>
              <Input
                id="discord"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                placeholder="https://discord.gg/buildmc"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input
                id="youtube"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@buildmc"
                className="mt-2"
              />
            </div>
            <Button onClick={saveSocialLinks} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Social Links
            </Button>
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