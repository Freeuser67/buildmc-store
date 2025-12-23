import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ShopHero } from '@/components/shop/ShopHero';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import { ShopFooter } from '@/components/shop/ShopFooter';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useQuickLinks } from '@/hooks/useQuickLinks';
import { useServerStatus } from '@/hooks/useServerStatus';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { settings } = useSiteSettings();
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const { quickLinks } = useQuickLinks();
  
  const serverIP = settings['server_ip'] || 'play.buildmc.net';
  const discordServerId = settings['discord_server_id'] || '';
  
  const { serverStatus, discordMembers } = useServerStatus(serverIP, discordServerId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <ShopHero
        serverIP={serverIP}
        serverStatus={serverStatus}
        discordMembers={discordMembers}
        discordServerId={discordServerId}
        heroTitle={settings['hero_title'] || 'BuildMC'}
        heroSubtitle={settings['hero_subtitle'] || 'Premium Ranks • Exclusive Kits • Epic Items'}
      />

      <ProductsGrid
        products={products}
        categories={categories}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ShopFooter
        quickLinks={quickLinks}
        discordUrl={settings['discord_url'] || 'https://discord.gg/buildmc'}
        youtubeUrl={settings['youtube_url'] || 'https://youtube.com/@buildmc'}
        activePlayers={settings['active_players'] || '15K+'}
        eventsHosted={settings['events_hosted'] || '500+'}
        uptime={settings['uptime'] || '24/7'}
      />
    </div>
  );
};

export default Shop;
