import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Point {
  x: number;
  y: number;
  age: number;
}

export const CursorTrail = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (theme !== 'minecraft') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#f967fb', '#53bc28', '#6958d5', '#83f36e', '#fe8a2e', '#ff008a', '#60aed5'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (pointsRef.current.length > 50) {
        pointsRef.current.shift();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointsRef.current = pointsRef.current.filter(p => p.age < 1);
      pointsRef.current.forEach(p => p.age += 0.02);

      if (pointsRef.current.length > 2) {
        for (let i = 1; i < pointsRef.current.length; i++) {
          const p1 = pointsRef.current[i - 1];
          const p2 = pointsRef.current[i];
          const alpha = 1 - p2.age;
          const width = (1 - p2.age) * 8;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = colors[i % colors.length];
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.globalAlpha = alpha * 0.8;
          ctx.shadowBlur = 20;
          ctx.shadowColor = colors[i % colors.length];
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  if (theme !== 'minecraft') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
