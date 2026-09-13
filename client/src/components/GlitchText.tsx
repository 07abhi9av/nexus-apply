import React, { useState, useEffect, useRef } from 'react';

// Cyberpunk glyph characters for text scramble decoding
const CYBER_GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@#$%^&*<>[]_+-=~';

interface GlitchTextProps {
  text: string;
  trigger?: any;
  className?: string;
  style?: React.CSSProperties;
  duration?: number; // Duration of glitch scramble in ms (default: 260ms)
  animateOnMount?: boolean; // Whether to scramble on first component mount
}

/**
 * GlitchText: Authentic Cyberpunk Text Glitch & Character Scramble Decoder
 *
 * Scrambles characters through digital glyphs while applying chromatic RGB text-shadow,
 * resolving progressively into the final text without shaking or shifting layout containers.
 */
export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  trigger,
  className = '',
  style,
  duration = 320,
  animateOnMount = true,
}) => {
  const [displayText, setDisplayText] = useState<string>(() => {
    if (animateOnMount && text) {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ' || char === '·' || char === '—' || char === '-' || char === '(' || char === ')' || char === '/' || char === ':') {
          result += char;
        } else {
          result += CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
        }
      }
      return result;
    }
    return text;
  });
  const [isGlitching, setIsGlitching] = useState<boolean>(Boolean(animateOnMount && text));

  const lastAnimatedTriggerRef = useRef<any>(undefined);
  const lastAnimatedTextRef = useRef<any>(undefined);
  const rafIdRef = useRef<number | null>(null);
  const lastScrambleTickRef = useRef<number>(0);

  useEffect(() => {
    const triggerChanged = lastAnimatedTriggerRef.current !== trigger;
    const textChanged = lastAnimatedTextRef.current !== text;
    const isFirstRun = lastAnimatedTriggerRef.current === undefined;

    lastAnimatedTriggerRef.current = trigger;
    lastAnimatedTextRef.current = text;

    const shouldAnimate = isFirstRun ? animateOnMount : (triggerChanged || textChanged);

    if (!shouldAnimate || !text) {
      setDisplayText(text);
      setIsGlitching(false);
      return;
    }

    // Cancel any ongoing animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    setIsGlitching(true);
    const startTime = performance.now();
    const targetLen = text.length;

    // Pre-calculate pseudo-random reveal thresholds so characters resolve organically
    // rather than strictly like a typewriter
    const thresholds = new Float32Array(targetLen);
    for (let i = 0; i < targetLen; i++) {
      // Deterministic spread based on character index for organic staggered lock-in
      const pseudoSpread = ((i * 17 + 3) % 23) / 23;
      thresholds[i] = 0.15 + 0.85 * (0.6 * (i / Math.max(targetLen - 1, 1)) + 0.4 * pseudoSpread);
    }

    let currentScramble = text;

    const updateFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Throttle random glyph regeneration to every ~28ms for high-definition flicker
      const shouldFlickerGlyphs = (now - lastScrambleTickRef.current) >= 28 || progress >= 1;
      if (shouldFlickerGlyphs) {
        lastScrambleTickRef.current = now;

        let result = '';
        for (let i = 0; i < targetLen; i++) {
          const char = text[i];
          // Preserve spaces and common delimiters so word wrapping and width remain 100% stationary
          if (char === ' ' || char === '·' || char === '—' || char === '-' || char === '(' || char === ')' || char === '/' || char === ':') {
            result += char;
          } else if (progress >= thresholds[i] || progress >= 0.98) {
            result += char;
          } else {
            result += CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
          }
        }
        currentScramble = result;
        setDisplayText(currentScramble);
      }

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      } else {
        setDisplayText(text);
        setIsGlitching(false);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [text, trigger, duration, animateOnMount]);

  return (
    <span
      className={`${className} ${isGlitching ? 'cyber-glitch-text-active' : ''}`}
      style={style}
    >
      {displayText}
    </span>
  );
};
