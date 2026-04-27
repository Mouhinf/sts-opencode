"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingElementProps {
  delay?: number;
  amplitude?: number;
  duration?: number;
  children: ReactNode;
  className?: string;
}

export function FloatingElement({
  delay = 0,
  amplitude = 10,
  duration = 3,
  children,
  className,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}