'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, animate, AnimatePresence } from 'framer-motion';

interface CountUpProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export default function CountUp({ value, duration = 2000, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('0');
  const [showGhost, setShowGhost] = useState(false);
  const [ghostValue, setGhostValue] = useState('');

  // Parse the value to extract the number
  const parseValue = (val: string | number): number => {
    if (typeof val === 'number') return val;
    const cleaned = val.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Format the number back to the original format
  const formatValue = (num: number, original: string | number): string => {
    if (typeof original === 'number') {
      return original % 1 === 0 ? Math.floor(num).toString() : num.toFixed(2);
    }

    const originalStr = original.toString().trim();
    const hasCommas = originalStr.includes(',');
    const intValue = Math.round(num);
    
    let formatted = intValue.toString();
    if (hasCommas && intValue >= 1000) {
      formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    return formatted;
  };

  const targetValue = parseValue(value);
  const originalValue = value;

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      // Reset to 0 first
      motionValue.set(0);
      setDisplayValue('0');
      setShowGhost(false);
      
      // Start animation with a faster, smoother easing curve
      const controls = animate(motionValue, targetValue, {
        duration: duration / 1000,
        ease: [0.25, 0.1, 0.25, 1], // Faster ease-out that doesn't slow too much
        onUpdate: (latest) => {
          // Update display during animation - use Math.ceil to avoid pause at end
          const displayNum = latest >= targetValue - 0.5 ? targetValue : latest;
          setDisplayValue(formatValue(displayNum, originalValue));
        },
        onComplete: () => {
          // Ensure we end exactly at target
          const finalValue = formatValue(targetValue, originalValue);
          setDisplayValue(finalValue);
          
          // Trigger ghost effect
          setGhostValue(finalValue);
          setShowGhost(true);
          
          // Hide ghost after animation
          setTimeout(() => {
            setShowGhost(false);
          }, 1000);
        },
      });
      
      return controls.stop;
    } else {
      motionValue.set(0);
      setDisplayValue('0');
      setShowGhost(false);
    }
  }, [isInView, targetValue, duration, motionValue, originalValue]);

  return (
    <span ref={ref} className={`${className} relative inline-block tracking-normal`}>
      {/* Original number */}
      <span className="relative z-10 tracking-normal">{displayValue}</span>
      
      {/* Ghost effect - absolutely positioned clone */}
      <AnimatePresence>
        {showGhost && (
          <motion.span
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1.5, 
              y: -30 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            style={{ 
              left: 0,
              top: 0,
            }}
          >
            {ghostValue}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

