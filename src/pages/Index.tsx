import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { ServerInfoCard } from '@/components/home/ServerInfoCard';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { ProductsPreview } from '@/components/home/ProductsPreview';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useStatBoxes } from '@/hooks/useStatBoxes';

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { settings } = useSiteSettings();
  const { products } = useProducts(6);
  const { categories } = useCategories();
  const { statBoxes } = useStatBoxes();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection settings={settings} />
      <ServerInfoCard settings={settings} />
      <StatsSection statBoxes={statBoxes} />
      <FeaturesSection />
      <ProductsPreview 
        products={products}
        categories={categories}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </div>
  );
};

export default Index;
