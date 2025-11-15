import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { ServerInfoSection } from "@/components/admin/ServerInfoSection";
import { QuickLinksSection } from "@/components/admin/QuickLinksSection";
import { CommunityStatsSection } from "@/components/admin/CommunityStatsSection";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  quick_text?: string;
  display_order: number;
  is_text_only?: boolean;
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
  const [loading, setLoading] = useState(true);
  
  // Server Info fields
  const [serverIp, setServerIp] = useState("");
  const [serverVersion, setServerVersion] = useState("");
  const [discordServerId, setDiscordServerId] = useState("");
  
  // Additional fields for Shop page
  const [activePlayers, setActivePlayers] = useState("");
  const [eventsHosted, setEventsHosted] = useState("");
  const [uptime, setUptime] = useState("");

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
      
      setServerIp(settingsMap.server_ip || "");
      setServerVersion(settingsMap.server_version || "");
      setDiscordServerId(settingsMap.discord_server_id || "");

      // Shop stats fields
      setActivePlayers(settingsMap.active_players || "");
      setEventsHosted(settingsMap.events_hosted || "");
      setUptime(settingsMap.uptime || "");
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

  const addTextOnlyLink = () => {
    const newOrder = quickLinks.length > 0 ? Math.max(...quickLinks.map(l => l.display_order)) + 1 : 0;
    setQuickLinks([...quickLinks, { 
      id: crypto.randomUUID(), 
      title: "", 
      url: "", 
      quick_text: "",
      display_order: newOrder,
      is_text_only: true
    }]);
  };

  const updateQuickLink = (id: string, field: keyof QuickLink, value: string | number | boolean) => {
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

      // Filter out empty entries - keep links with URLs or text-only entries
      const validLinks = quickLinks.filter(link => 
        link.title && (link.url || link.is_text_only)
      );

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
        { setting_key: "server_ip", setting_value: serverIp },
        { setting_key: "server_version", setting_value: serverVersion },
        { setting_key: "discord_server_id", setting_value: discordServerId },
        // Shop metrics
        { setting_key: "active_players", setting_value: activePlayers },
        { setting_key: "events_hosted", setting_value: eventsHosted },
        { setting_key: "uptime", setting_value: uptime },
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

        <ServerInfoSection
          serverIp={serverIp}
          setServerIp={setServerIp}
          serverVersion={serverVersion}
          setServerVersion={setServerVersion}
          discordServerId={discordServerId}
          setDiscordServerId={setDiscordServerId}
        />

        <CommunityStatsSection
          activePlayers={activePlayers}
          setActivePlayers={setActivePlayers}
          eventsHosted={eventsHosted}
          setEventsHosted={setEventsHosted}
          uptime={uptime}
          setUptime={setUptime}
        />

        {/* Save All Button */}
        <Card className="glass-effect mb-8 border-primary/20">
          <CardContent className="pt-6">
            <Button onClick={saveAllSettings} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All Website Settings
            </Button>
          </CardContent>
        </Card>

        <QuickLinksSection
          quickLinks={quickLinks}
          onAdd={addQuickLink}
          onAddText={addTextOnlyLink}
          onUpdate={updateQuickLink}
          onDelete={deleteQuickLink}
          onSave={saveQuickLinks}
        />
      </div>
    </div>
  );
};

export default SiteSettings;