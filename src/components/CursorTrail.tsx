import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Point {
  x: number;
  y: number;
  age: number;
  hue: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  hue: number;
  size: number;
  type: 'circle' | 'star' | 'diamond';
}

interface Sparkle {
  x: number;
  y: number;
  age: number;
  hue: number;
  size: number;
}

export const CursorTrail = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const hueRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (theme !== 'minecraft') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Blue theme hue range: 180-260 (cyan to purple)
      hueRef.current = 180 + ((hueRef.current + 1) % 80);
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0, hue: hueRef.current });
      if (pointsRef.current.length > 60) {
        pointsRef.current.shift();
      }

      // Add random sparkles along the trail
      if (Math.random() > 0.6) {
        sparklesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          age: 0,
          hue: hueRef.current,
          size: 2 + Math.random() * 4
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"], [onclick]');
      if (isInteractive) return;

      const particleCount = 30;
      const types: ('circle' | 'star' | 'diamond')[] = ['circle', 'star', 'diamond'];
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
        const speed = 4 + Math.random() * 8;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          age: 0,
          hue: (hueRef.current + i * 12) % 360,
          size: 5 + Math.random() * 10,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
    };
    window.addEventListener('click', handleClick, { passive: true });

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size / 2;
      let rotation = Math.PI / 2 * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rotation) * outerRadius, y + Math.sin(rotation) * outerRadius);
        rotation += step;
        ctx.lineTo(x + Math.cos(rotation) * innerRadius, y + Math.sin(rotation) * innerRadius);
        rotation += step;
      }
      ctx.lineTo(x, y - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.7, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.7, y);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rainbow cursor trail
      pointsRef.current = pointsRef.current.filter(p => p.age < 1);
      pointsRef.current.forEach(p => p.age += 0.015);

      if (pointsRef.current.length > 2) {
        for (let i = 1; i < pointsRef.current.length; i++) {
          const p1 = pointsRef.current[i - 1];
          const p2 = pointsRef.current[i];
          const alpha = (1 - p2.age) * 0.9;
          const width = (1 - p2.age) * 12;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(${p2.hue}, 100%, 60%, ${alpha})`;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 25;
          ctx.shadowColor = `hsla(${p2.hue}, 100%, 50%, 0.8)`;
          ctx.stroke();
        }
      }

      // Draw sparkles
      sparklesRef.current = sparklesRef.current.filter(s => s.age < 1);
      sparklesRef.current.forEach(s => {
        s.age += 0.03;
        s.y -= 0.5;

        const alpha = (1 - s.age) * Math.sin(s.age * Math.PI);
        const size = s.size * (1 - s.age * 0.3);
        const pulse = 1 + Math.sin(frameRef.current * 0.3 + s.x) * 0.3;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(frameRef.current * 0.05);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${alpha})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 50%, ${alpha})`;
        drawStar(ctx, 0, 0, size * pulse);
        ctx.restore();
      });

      // Draw click particles
      particlesRef.current = particlesRef.current.filter(p => p.age < 1);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.vx *= 0.98;
        p.age += 0.02;

        const alpha = (1 - p.age) * 0.9;
        const size = p.size * (1 - p.age * 0.5);
        const rotation = frameRef.current * 0.1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(rotation);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, ${alpha})`;

        if (p.type === 'star') {
          drawStar(ctx, 0, 0, size);
        } else if (p.type === 'diamond') {
          drawDiamond(ctx, 0, 0, size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
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
