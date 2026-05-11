import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isClicking, setIsClicking] = useState(false);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      return;
    }
    
    const moveMouse = (e) => {
      cursorX.set(e.clientX - 14);
      cursorY.set(e.clientY - 14);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center"
      style={{ x, y }}
      animate={{ scale: isClicking ? 0.6 : 1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="w-[28px] h-[28px] rounded-full border-2 border-primary/50 flex items-center justify-center">
        <div className="w-[6px] h-[6px] bg-primary rounded-full" />
      </div>
    </motion.div>
  );
}
