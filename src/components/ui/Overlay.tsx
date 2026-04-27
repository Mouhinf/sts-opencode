"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OverlayProps {
  children: React.ReactNode;
  show: boolean;
}

export function Overlay({ children, show }: OverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!mounted) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col h-screen">
      {children}
    </div>,
    document.body
  );
}