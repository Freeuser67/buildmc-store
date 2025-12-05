import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image, Loader2, Trash2 } from "lucide-react";

interface LogoUploadSectionProps {
  currentLogo: string;
  onLogoChange: (url: string) => void;
}

export const LogoUploadSection = ({ currentLogo, onLogoChange }: LogoUploadSectionProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WEBP, SVG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `website-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Save to site settings
      const { error: settingError } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: 'website_logo', 
          setting_value: publicUrl 
        }, { onConflict: 'setting_key' });

      if (settingError) throw settingError;

      onLogoChange(publicUrl);

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('setting_key', 'website_logo');

      if (error) throw error;

      onLogoChange('');

      toast({
        title: "Success",
        description: "Logo removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5 text-primary" />
          Website Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Logo Preview */}
        {currentLogo && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-20 h-20 bg-background rounded-lg flex items-center justify-center overflow-hidden border">
              <img 
                src={currentLogo} 
                alt="Website Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Current Logo</p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleRemoveLogo}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Logo
              </Button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="logo-upload">Upload New Logo</Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="flex-1"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended: PNG or SVG, max 2MB. Logo will appear in the navbar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
