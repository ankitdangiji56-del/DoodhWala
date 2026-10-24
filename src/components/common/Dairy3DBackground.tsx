import React, { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  vz: number;
  type: 'milk' | 'ghee' | 'bubble';
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const Dairy3DBackground: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  density?: number;
  interactive?: boolean;
}> = ({ className = '', style = {}, density = 28, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    // Mouse coordinates for 3D parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !canvas || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.touches[0].clientX - rect.left;
      targetMouseY = e.touches[0].clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initialize 3D particles (Milk drops, Ghee globules, and Cream bubbles)
    const particles: Particle3D[] = [];
    for (let i = 0; i < density; i++) {
      const isGhee = i % 4 === 0;
      const isBubble = i % 5 === 1;
      const baseRadius = isGhee ? Math.random() * 12 + 10 : isBubble ? Math.random() * 8 + 6 : Math.random() * 16 + 12;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200, // Z depth from -200 (far) to +200 (near)
        radius: baseRadius,
        baseRadius,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -Math.random() * 0.4 - 0.2, // Gentle upward buoyant drift
        vz: (Math.random() - 0.5) * 0.3,
        type: isGhee ? 'ghee' : isBubble ? 'bubble' : 'milk',
        alpha: Math.random() * 0.4 + 0.45,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const focalLength = 300;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const mouseOffsetX = (mouseX - width / 2) * 0.06;
      const mouseOffsetY = (mouseY - height / 2) * 0.06;

      // Sort by Z for realistic 3D depth rendering (painters algorithm)
      particles.sort((a, b) => a.z - b.z);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulsePhase += p.pulseSpeed;

        // Wrap around boundaries
        if (p.y < -p.radius * 2) {
          p.y = height + p.radius * 2;
          p.x = Math.random() * width;
        }
        if (p.x < -p.radius * 2) p.x = width + p.radius * 2;
        if (p.x > width + p.radius * 2) p.x = -p.radius * 2;
        if (p.z > 250) p.vz = -Math.abs(p.vz);
        if (p.z < -250) p.vz = Math.abs(p.vz);

        // 3D Perspective Projection
        const scale = focalLength / (focalLength + p.z);
        const projectedX = p.x + mouseOffsetX * (1 + p.z / 200);
        const projectedY = p.y + mouseOffsetY * (1 + p.z / 200);
        const currentRadius = Math.max(2, p.baseRadius * scale * (1 + Math.sin(p.pulsePhase) * 0.08));

        // Depth Blur / Alpha fading with distance
        const depthAlpha = Math.min(1, Math.max(0.15, p.alpha * scale));

        ctx.save();
        ctx.translate(projectedX, projectedY);

        if (p.type === 'milk') {
          // 3D Sphere Shading for Pure Milk Droplet
          const grad = ctx.createRadialGradient(
            -currentRadius * 0.35,
            -currentRadius * 0.35,
            currentRadius * 0.05,
            0,
            0,
            currentRadius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${depthAlpha * 0.95})`);
          grad.addColorStop(0.3, `rgba(248, 250, 252, ${depthAlpha * 0.85})`);
          grad.addColorStop(0.7, `rgba(226, 238, 255, ${depthAlpha * 0.65})`);
          grad.addColorStop(1, `rgba(180, 210, 245, ${depthAlpha * 0.15})`);

          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(30, 90, 168, 0.15)';
          ctx.shadowBlur = 12 * scale;
          ctx.fill();

          // 3D Specular Highlight on surface
          ctx.beginPath();
          ctx.arc(
            -currentRadius * 0.3,
            -currentRadius * 0.3,
            currentRadius * 0.22,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.9})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        } else if (p.type === 'ghee') {
          // 3D Sphere Shading for Golden Bilona Ghee Globule
          const grad = ctx.createRadialGradient(
            -currentRadius * 0.3,
            -currentRadius * 0.3,
            currentRadius * 0.08,
            0,
            0,
            currentRadius
          );
          grad.addColorStop(0, `rgba(255, 248, 220, ${depthAlpha * 0.95})`);
          grad.addColorStop(0.35, `rgba(245, 176, 65, ${depthAlpha * 0.85})`);
          grad.addColorStop(0.75, `rgba(217, 130, 43, ${depthAlpha * 0.65})`);
          grad.addColorStop(1, `rgba(180, 83, 9, ${depthAlpha * 0.1})`);

          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(245, 176, 65, 0.3)';
          ctx.shadowBlur = 16 * scale;
          ctx.fill();

          // Golden Specular Core
          ctx.beginPath();
          ctx.arc(
            -currentRadius * 0.3,
            -currentRadius * 0.3,
            currentRadius * 0.24,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 240, ${depthAlpha * 0.9})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        } else {
          // Translucent Cream Bubble with prismatic rim
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha * 0.75})`;
          ctx.lineWidth = 1.5 * scale;
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.08})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 8 * scale;
          ctx.fill();
          ctx.stroke();

          // Subtle internal arc
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius * 0.7, -0.6, 0.6);
          ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha * 0.5})`;
          ctx.lineWidth = 1 * scale;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`dairy-3d-background ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
