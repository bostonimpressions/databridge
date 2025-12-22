'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  as?: 'div' | 'li' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  style?: React.CSSProperties;
}

const animationVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

export default function AnimatedElement({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.3,
  once = false,
  amount = 0.3,
  as = 'div',
  style,
}: AnimatedElementProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount,
  });

  const variants = animationVariants[animation];
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionComponent>
  );
}

