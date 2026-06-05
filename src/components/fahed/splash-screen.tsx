'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_BASE64 } from '@/lib/logo';

interface SplashScreenProps {
  onComplete: () => void;
}

// SVG path for the logo outline (simplified geometric wallet/shield shape)
const LOGO_PATH = 'M40 10 L60 10 Q70 10 70 20 L70 50 Q70 60 60 60 L40 60 Q30 60 30 50 L30 20 Q30 10 40 10 Z';

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'drawing' | 'filling' | 'complete' | 'exiting'>('drawing');
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate particles once
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      });
    }
    return arr;
  }, []);

  // Phase 1: Draw the SVG stroke (0-1500ms)
  useEffect(() => {
    const drawDuration = 1500;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / drawDuration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setPhase('filling');
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Phase 2: Fill transition (1500-2200ms)
  useEffect(() => {
    if (phase !== 'filling') return;
    const timer = setTimeout(() => {
      setPhase('complete');
    }, 700);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 3: Complete - show name (2200-3200ms)
  useEffect(() => {
    if (phase !== 'complete') return;
    const timer = setTimeout(() => {
      setPhase('exiting');
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 4: Exit transition then call onComplete
  useEffect(() => {
    if (phase !== 'exiting') return;
    const timer = setTimeout(() => {
      onComplete();
    }, 500);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  // Calculate stroke-dashoffset for drawing animation
  const pathLength = 200; // approximate path length
  const dashOffset = phase === 'drawing'
    ? pathLength - (pathLength * progress / 100)
    : 0;

  return (
    <AnimatePresence>
      {phase !== 'exiting' ? (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0F0F0F' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: 'rgba(230, 0, 0, 0.12)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0.5],
                  y: [0, -20, -40],
                }}
                transition={{
                  duration: 3,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Subtle radial gradient background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(230,0,0,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Logo with stroke drawing animation */}
          <div className="relative z-10">
            <motion.div
              className="relative flex items-center justify-center"
              style={{ width: 120, height: 120 }}
            >
              {/* Background fill that fades in after drawing completes */}
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: phase === 'drawing' ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  background: 'linear-gradient(145deg, #E60000 0%, #8B0000 100%)',
                  boxShadow: phase !== 'drawing' ? '0 12px 40px rgba(230,0,0,0.4)' : 'none',
                }}
              >
                {/* Logo image inside the filled shape */}
                <div className="w-full h-full flex items-center justify-center p-5">
                  <img
                    src={LOGO_BASE64}
                    alt="محفظة الجنوب"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              </motion.div>

              {/* SVG stroke outline that draws first */}
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="absolute inset-0"
                style={{ zIndex: phase === 'drawing' ? 10 : 0 }}
              >
                <rect
                  x="4"
                  y="4"
                  width="112"
                  height="112"
                  rx="24"
                  ry="24"
                  fill="none"
                  stroke="#E60000"
                  strokeWidth="2"
                  strokeDasharray={pathLength}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition: 'stroke-dashoffset 0.05s linear',
                    opacity: phase === 'drawing' ? 1 : 0,
                  }}
                />
              </svg>

              {/* Glow effect during drawing */}
              {phase === 'drawing' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    boxShadow: '0 0 30px rgba(230,0,0,0.3)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(230,0,0,0.2)',
                      '0 0 40px rgba(230,0,0,0.4)',
                      '0 0 20px rgba(230,0,0,0.2)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </motion.div>
          </div>

          {/* App name - appears after drawing completes */}
          <motion.div
            className="mt-6 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase === 'drawing' ? 0 : 1,
              y: phase === 'drawing' ? 10 : 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h1 className="text-2xl font-bold text-white">محفظة الجنوب</h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-2 text-sm relative z-10"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: phase === 'drawing' ? 0 : 1,
              y: phase === 'drawing' ? 5 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            محفظتك الرقمية الموثوقة
          </motion.p>

          {/* Loading bar */}
          <div className="absolute bottom-12 left-10 right-10 z-10">
            <div
              className="h-[3px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #E60000, #FF3333, #E60000)',
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0"
          style={{ background: '#0F0F0F' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
