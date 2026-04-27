"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  show: boolean;
}

export function Portal({ children, show }: PortalProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  if (!ref.current) {
    ref.current = document.createElement("div");
    ref.current.id = "portal-root";
  }

  useEffect(() => {
    const portalRoot = ref.current!;
    
    if (show) {
      document.body.appendChild(portalRoot);
    }
    
    return () => {
      if (!show && portalRoot.parentNode) {
        document.body.removeChild(portalRoot);
      }
    };
  }, [show]);

  useEffect(() => {
    return () => {
      if (ref.current?.parentNode) {
        document.body.removeChild(ref.current);
      }
    };
  }, []);

  if (!ref.current || !show) return null;
  return createPortal(children, ref.current);
}