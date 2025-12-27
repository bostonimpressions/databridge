'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useMotionValueEvent, animate } from 'framer-motion';

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
          setDisplayValue(formatValue(targetValue, originalValue));
        },
      });
      
      return controls.stop;
    } else {
      motionValue.set(0);
      setDisplayValue('0');
    }
  }, [isInView, targetValue, duration, motionValue, originalValue]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}

