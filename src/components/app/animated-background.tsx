import { useEffect, useRef } from 'react';

interface SakuraPetal {
  x: number;
  y: number;
  rotation: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
}

interface AnimatedBackgroundProps {
  variant?: 'sakura' | 'grid' | 'both';
  intensity?: 'low' | 'medium' | 'high';
}

export function AnimatedBackground({
  variant = 'sakura',
  intensity = 'medium',
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const petalsRef = useRef<SakuraPetal[]>([]);

  const petalCount =
    intensity === 'low' ? 15 : intensity === 'medium' ? 30 : 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize sakura petals
    const initPetals = () => {
      petalsRef.current = Array.from({ length: petalCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        rotation: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 1 + 0.5,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    };

    initPetals();

    const drawSakuraPetal = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;

      // Draw sakura petal shape (simplified - single petal)
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.6, size, 0, 0, 2 * Math.PI);

      // Gradient fill for sakura petal (pink tones)
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `rgba(255, 192, 203, ${opacity * 0.9})`);
      gradient.addColorStop(0.5, `rgba(255, 182, 193, ${opacity * 0.7})`);
      gradient.addColorStop(1, `rgba(255, 160, 180, ${opacity * 0.4})`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add a subtle stroke for definition
      ctx.strokeStyle = `rgba(255, 182, 193, ${opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern if needed
      if (variant === 'grid' || variant === 'both') {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 50;

        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Animate sakura petals
      if (variant === 'sakura' || variant === 'both') {
        petalsRef.current.forEach((petal) => {
          petal.x += petal.speedX;
          petal.y += petal.speedY;
          petal.rotation += 0.5;

          // Reset petal when it goes off screen
          if (petal.y > canvas.height) {
            petal.y = -20;
            petal.x = Math.random() * canvas.width;
          }
          if (petal.x < -20) {
            petal.x = canvas.width + 20;
          }
          if (petal.x > canvas.width + 20) {
            petal.x = -20;
          }

          drawSakuraPetal(
            ctx,
            petal.x,
            petal.y,
            petal.size,
            petal.rotation,
            petal.opacity
          );
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [variant, intensity, petalCount]);

  return (
    <canvas
      ref={canvasRef}
      className='fixed inset-0 pointer-events-none z-0'
      style={{ background: 'transparent' }}
    />
  );
}
