import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  rotation: number;
  vx: number;
  vy: number;
  rotationSpeed: number;
  color: string;
}

const StarCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const { theme } = useTheme();

  const colors = theme === 'minecraft' 
    ? ['#00d4ff', '#00a8cc', '#0088aa', '#ffffff', '#88eeff']
    : ['#B19EEF', '#9B87F5', '#7E69AB', '#ffffff', '#D6BCFA'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size / 2;

      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 2;
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current = starsRef.current.filter(star => {
        star.x += star.vx;
        star.y += star.vy;
        star.alpha -= 0.02;
        star.rotation += star.rotationSpeed;
        star.size *= 0.98;

        if (star.alpha > 0 && star.size > 0.5) {
          drawStar(ctx, star.x, star.y, star.size, star.rotation, star.alpha, star.color);
          return true;
        }
        return false;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Create stars based on movement speed
      const starCount = Math.min(Math.floor(distance / 5), 3);
      
      for (let i = 0; i < starCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        
        starsRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 12 + 6,
          alpha: Math.random() * 0.5 + 0.5,
          rotation: Math.random() * Math.PI * 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      // Limit total stars
      if (starsRef.current.length > 50) {
        starsRef.current = starsRef.current.slice(-50);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};

export default StarCursor;
