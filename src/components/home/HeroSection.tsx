import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import heroImage from '@/assets/hero-minecraft.jpg';
import MouseSparkle from '@/components/MouseSparkle';

const LavaCube3D = lazy(() => import('@/components/LavaCube3D'));

interface HeroSectionProps {
  settings: Record<string, string>;
}

export const HeroSection = ({ settings }: HeroSectionProps) => {
  const { theme } = useTheme();

  return (
    <div className="relative h-[900px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {theme !== 'minecraft' && (
          <img 
            src={heroImage} 
            alt="Minecraft server" 
            className="w-full h-full object-cover scale-110" 
          />
        )}
        {theme === 'minecraft' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#1b263b]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        {theme === 'minecraft' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `
                linear-gradient(rgba(0,170,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,170,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
            
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-cyan-500/20 via-blue-500/10 to-transparent blur-xl" />
          </>
        )}
      </div>

      {theme === 'minecraft' && (
        <Suspense fallback={null}>
          <LavaCube3D />
        </Suspense>
      )}

      <MouseSparkle />

      <div className="relative container mx-auto px-4 h-full flex items-center z-20">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-block mb-6 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-xl shadow-lg shadow-cyan-500/10">
            <span className="text-cyan-400 font-semibold text-sm tracking-wide">✨ Premium Minecraft Store</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-2xl">
              {settings['hero_greeting'] || 'Welcome to'}
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">{settings['hero_title'] || 'BuildMC Store'}</span>
          </h1>
          
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 shadow-2xl">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              {settings['hero_subtitle'] || 'Your trusted destination for premium ranks, exclusive items, and epic Minecraft experiences!'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-3 text-base px-10 py-7 shadow-xl shadow-cyan-500/25 transition-all duration-300 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 border-none rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40">
              <Link to="/shop">
                <ShoppingBag className="w-5 h-5" />
                Browse Shop
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-3 text-base px-10 py-7 border-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 backdrop-blur-xl rounded-xl hover:scale-105 transition-all duration-300 hover:border-cyan-400/60">
              <Link to="/orders">
                View Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};
