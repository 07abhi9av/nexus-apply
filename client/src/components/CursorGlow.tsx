import React, { useEffect, useRef, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const glowBackRef = useRef<HTMLDivElement>(null);
  const glowFrontRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only run on clients with a fine pointer (mouse / trackpad)
    if (typeof window === 'undefined') return;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics LERP loop for silky organic glow movement
    const updatePosition = () => {
      const ease = 0.16; // Lerp damping factor
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      const x = Math.round(currentPos.current.x);
      const y = Math.round(currentPos.current.y);

      if (glowBackRef.current) {
        glowBackRef.current.style.setProperty('--cursor-x', `${x}px`);
        glowBackRef.current.style.setProperty('--cursor-y', `${y}px`);
      }
      if (glowFrontRef.current) {
        glowFrontRef.current.style.setProperty('--cursor-x', `${x}px`);
        glowFrontRef.current.style.setProperty('--cursor-y', `${y}px`);
      }

      animFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  return (
    <>
      {/* 1. Deep Atmospheric Background Glow (Behind cards & text) */}
      <div
        ref={glowBackRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(
              620px circle at var(--cursor-x, -1000px) var(--cursor-y, -1000px),
              rgba(0, 245, 212, 0.085) 0%,
              rgba(10, 132, 255, 0.055) 32%,
              rgba(191, 90, 242, 0.025) 58%,
              transparent 78%
            )`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 2. Delicate Surface Illuminator (Softly highlights cards, buttons & borders) */}
      <div
        ref={glowFrontRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          overflow: 'hidden',
          opacity: isVisible ? 0.6 : 0,
          transition: 'opacity 0.4s ease',
          mixBlendMode: 'screen',
        }}
      >
        {/* Core Spotlight Halo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(
              250px circle at var(--cursor-x, -1000px) var(--cursor-y, -1000px),
              rgba(0, 245, 212, 0.07) 0%,
              rgba(10, 132, 255, 0.04) 45%,
              transparent 80%
            )`,
            pointerEvents: 'none',
          }}
        />
        {/* Concentrated Radiant Center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(
              55px circle at var(--cursor-x, -1000px) var(--cursor-y, -1000px),
              rgba(255, 255, 255, 0.14) 0%,
              rgba(0, 245, 212, 0.09) 50%,
              transparent 85%
            )`,
            filter: 'blur(5px)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
};
