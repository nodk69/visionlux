import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

export default function GlassesViewer3D({ size = 'hero' }) {
  const containerRef = useRef(null);
  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(5);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Auto-rotate logic
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const loop = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      if (!isDragging) {
        rotateY.set(rotateY.get() + (20 * deltaTime) / 1000);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, rotateY]);

  // Hide hint after 3 seconds of interaction
  useEffect(() => {
    if (isDragging && showHint) {
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isDragging, showHint]);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    const movementX = e.movementX;
    const movementY = e.movementY;
    
    rotateY.set(rotateY.get() + movementX * 0.9);
    
    const newRotateX = rotateX.get() - movementY * 0.5;
    rotateX.set(Math.max(-20, Math.min(20, newRotateX)));
  };

  const glowOpacity = useTransform(rotateY, (value) => {
    return 0.15 + Math.sin(value * Math.PI / 180) * 0.1;
  });

  const scale = size === 'hero' ? 1.2 : 0.9;
  const width = size === 'hero' ? 'max-w-[600px]' : 'max-w-[400px]';

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-center ${width} perspective-1400 touch-none select-none`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <motion.div
        className="relative w-full aspect-[2/1] preserve-3d"
        style={{ rotateX, rotateY, scale }}
      >
        {/* Glow halo */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(212,175,55,1) 0%, transparent 60%)",
            opacity: glowOpacity,
            transform: 'translateZ(-40px)'
          }}
        />

        {/* Layer 1: Shadow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none blur-xl opacity-40" style={{ transform: 'translateZ(-18px)' }}>
          <div className="w-[80%] h-[40%] bg-black rounded-[100px]" />
        </div>

        {/* Layer 2: Temples */}
        <svg viewBox="0 0 500 220" className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(-8px)' }}>
          <defs>
            <linearGradient id="templeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <filter id="templeGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M40 95 Q-20 95 -20 120 L-20 170" stroke="url(#templeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#templeGlow)" />
          <path d="M460 95 Q520 95 520 120 L520 170" stroke="url(#templeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#templeGlow)" />
        </svg>

        {/* Layer 3: Main Frame */}
        <svg viewBox="0 0 500 220" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl" style={{ transform: 'translateZ(0px)' }}>
          <defs>
            <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F5D060" />
              <stop offset="100%" stopColor="#A68A1A" />
            </linearGradient>
            <linearGradient id="lensTint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0a14" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Left lens frame */}
          <rect x="25" y="55" width="185" height="130" rx="35" ry="35" fill="#0a0a14" stroke="url(#frameGrad)" strokeWidth="4" />
          <rect x="30" y="60" width="175" height="120" rx="30" ry="30" fill="url(#lensTint)" />
          
          {/* Bridge */}
          <path d="M210 95 Q250 80 290 95" stroke="url(#frameGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          
          {/* Right lens frame */}
          <rect x="290" y="55" width="185" height="130" rx="35" ry="35" fill="#0a0a14" stroke="url(#frameGrad)" strokeWidth="4" />
          <rect x="295" y="60" width="175" height="120" rx="30" ry="30" fill="url(#lensTint)" />

          {/* Nose pads */}
          <ellipse cx="225" cy="115" rx="7" ry="5" fill="url(#frameGrad)" opacity="0.9" />
          <ellipse cx="275" cy="115" rx="7" ry="5" fill="url(#frameGrad)" opacity="0.9" />

          {/* Reflections */}
          <line x1="50" y1="80" x2="110" y2="95" stroke="#ffffff" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
          <line x1="315" y1="80" x2="375" y2="95" stroke="#ffffff" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
        </svg>

        {/* Layer 4: Lens Shine */}
        <div className="absolute inset-0 pointer-events-none flex" style={{ transform: 'translateZ(8px)' }}>
          <div className="flex-1 h-full relative">
            <div className="absolute top-[25%] left-[6%] w-[35%] h-[60%] rounded-[30px]" 
              style={{ background: 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.18) 0%, transparent 60%)' }} />
          </div>
          <div className="flex-1 h-full relative">
            <div className="absolute top-[25%] left-[58%] w-[35%] h-[60%] rounded-[30px]" 
              style={{ background: 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.18) 0%, transparent 60%)' }} />
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-[-40px] flex items-center justify-center gap-2 text-primary/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowLeftRight className="w-4 h-4" />
        <span className="text-xs font-bold tracking-widest uppercase">Drag to rotate 360&deg;</span>
      </motion.div>
    </div>
  );
}
