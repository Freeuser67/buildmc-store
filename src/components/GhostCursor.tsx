import { useEffect, useRef, useCallback } from 'react';
import './GhostCursor.css';

interface GhostCursorProps {
  color?: string;
  size?: number;
  trailLength?: number;
  zIndex?: number;
}

interface Trail {
  x: number;
  y: number;
  alpha: number;
}

const GhostCursor = ({
  color = '#00d4ff',
  size = 20,
  trailLength = 20,
  zIndex = 50
}: GhostCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Trail[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add current mouse position to trail
    trailRef.current.unshift({
      x: mouseRef.current.x,
      y: mouseRef.current.y,
      alpha: 1
    });

    // Limit trail length
    if (trailRef.current.length > trailLength) {
      trailRef.current.pop();
    }

    // Draw trail
    trailRef.current.forEach((point, index) => {
      const progress = index / trailLength;
      const currentSize = size * (1 - progress * 0.5);
      const alpha = (1 - progress) * 0.6;

      // Glow effect
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, currentSize * 2
      );
      gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`);

      ctx.beginPath();
      ctx.arc(point.x, point.y, currentSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(point.x, point.y, currentSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.fill();
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [color, size, trailLength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    resize();
    window.addEventListener('resize', resize);
    parent.addEventListener('mousemove', handleMouseMove);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      parent.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="ghost-cursor-canvas"
      style={{ zIndex }}
    />
  );
};

export default GhostCursor;
