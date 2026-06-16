import { useEffect, useRef } from "react";

interface WavyDotsBackgroundProps {
  theme: 'dark' | 'light' | 'system';
}

export const WavyDotsBackground = ({ theme }: WavyDotsBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const dotSpacing = 65;
      const rows = Math.ceil(canvas.height / dotSpacing) + 2;
      const cols = Math.ceil(canvas.width / dotSpacing) + 2;

      const { x: mx, y: my } = mouseRef.current;
      
      offsetRef.current.x += (mx - canvas.width / 2 - offsetRef.current.x) * 0.01;
      offsetRef.current.y += (my - canvas.height / 2 - offsetRef.current.y) * 0.01;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const baseX = i * dotSpacing + (offsetRef.current.x * 0.08);
          const baseY = j * dotSpacing + (offsetRef.current.y * 0.08);
          
          const floatX = Math.sin(time + i) * 15;
          const floatY = Math.cos(time + j) * 15;
          
          const x = baseX + floatX;
          const y = baseY + floatY;
          
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const wave = Math.sin(dist * 0.015 - time * 4) * 12;
          
          // Color logic: Fuchsia base, Cyan on hover
          const maxHoverDist = 400;
          const hoverFactor = Math.max(0, Math.min(1, (maxHoverDist - dist) / maxHoverDist));
          
          // Theme-aware colors
          const baseHue = 283; // Fuchsia/Purple
          const hoverHue = 182; // Cyan
          const hue = baseHue - (hoverFactor * (baseHue - hoverHue));
          
          const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
          const baseOpacity = isDark ? 0.1 : 0.15;
          const maxOpacity = isDark ? 0.6 : 0.4;
          const opacity = Math.max(baseOpacity, maxOpacity - (dist / 1200));
          
          const saturation = isDark ? 100 : 80;
          const lightness = isDark ? 50 : 40;
          
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
          
          const maxDist = 350;
          let pushX = 0;
          let pushY = 0;
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            pushX = (dx / dist) * force * 40;
            pushY = (dy / dist) * force * 40;
          }

          ctx.beginPath();
          ctx.arc(x + pushX, y + pushY + wave, 1.8, 0, Math.PI * 2);
          ctx.fill();
          
          if (dist < 250) {
            ctx.shadowBlur = isDark ? 15 : 5;
            ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 0.8})`;
          } else {
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};