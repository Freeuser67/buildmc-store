import * as LucideIcons from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { StatBox } from '@/hooks/useStatBoxes';

interface StatsSectionProps {
  statBoxes: StatBox[];
}

const getIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName] || TrendingUp;
  return IconComponent;
};

export const StatsSection = ({ statBoxes }: StatsSectionProps) => {
  if (statBoxes.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-3 gap-8">
        {statBoxes.map((stat) => {
          const Icon = getIcon(stat.icon);
          return (
            <div key={stat.id} className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur border border-border hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-foreground">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
