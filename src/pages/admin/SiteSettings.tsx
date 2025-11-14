import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { HeroSettingsSection } from "@/components/admin/HeroSettingsSection";
import { ServerInfoSection } from "@/components/admin/ServerInfoSection";
import { StorySection } from "@/components/admin/StorySection";
import { CTASection } from "@/components/admin/CTASection";
import { StatBoxesSection } from "@/components/admin/StatBoxesSection";
import { QuickLinksSection } from "@/components/admin/QuickLinksSection";
import { CommunityStatsSection } from "@/components/admin/CommunityStatsSection";

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

      // Shop stats fields
      setActivePlayers(settingsMap.active_players || "");
      setEventsHosted(settingsMap.events_hosted || "");
      setUptime(settingsMap.uptime || "");

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

        <HeroSettingsSection
          heroGreeting={heroGreeting}
          setHeroGreeting={setHeroGreeting}
          heroTitle={heroTitle}
          setHeroTitle={setHeroTitle}
          heroSubtitle={heroSubtitle}
          setHeroSubtitle={setHeroSubtitle}
          heroButtonText={heroButtonText}
          setHeroButtonText={setHeroButtonText}
        />

        <ServerInfoSection
          serverIp={serverIp}
          setServerIp={setServerIp}
          serverVersion={serverVersion}
          setServerVersion={setServerVersion}
        />

        <CommunityStatsSection
          activePlayers={activePlayers}
          setActivePlayers={setActivePlayers}
          eventsHosted={eventsHosted}
          setEventsHosted={setEventsHosted}
          uptime={uptime}
          setUptime={setUptime}
        />

        <StorySection
          storyTitle={storyTitle}
          setStoryTitle={setStoryTitle}
          storyText={storyText}
          setStoryText={setStoryText}
          storyButtonText={storyButtonText}
          setStoryButtonText={setStoryButtonText}
          storyButtonUrl={storyButtonUrl}
          setStoryButtonUrl={setStoryButtonUrl}
        />

        <CTASection
          ctaTitle={ctaTitle}
          setCtaTitle={setCtaTitle}
          ctaSubtitle={ctaSubtitle}
          setCtaSubtitle={setCtaSubtitle}
          ctaButtonText={ctaButtonText}
          setCtaButtonText={setCtaButtonText}
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

        <StatBoxesSection
          statBoxes={statBoxes}
          onAdd={addStatBox}
          onUpdate={updateStatBox}
          onDelete={deleteStatBox}
          onSave={saveStatBoxes}
        />

        <QuickLinksSection
          quickLinks={quickLinks}
          onAdd={addQuickLink}
          onUpdate={updateQuickLink}
          onDelete={deleteQuickLink}
          onSave={saveQuickLinks}
        />
      </div>
    </div>
  );
};

export default SiteSettings;