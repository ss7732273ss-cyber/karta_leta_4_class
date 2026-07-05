import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  duration: number;
}

interface ConfettiBurstProps {
  trigger: boolean;
}

export default function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#f87171', '#3b82f6', '#facc15', '#10b981', '#a78bfa', '#fb923c'];
    const newParticles: Particle[] = Array.from({ length: 60 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100, // percentage width across screen
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.4,
      size: Math.random() * 12 + 6,
      duration: Math.random() * 2 + 2,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 4500);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50 overflow-hidden no-print">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `-20px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `float-particle ${p.duration}s linear forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
