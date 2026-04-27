"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export function WhatsAppButton({ phoneNumber = "221771234567" }: WhatsAppButtonProps) {
  const waLink = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;

  return (
    <motion.a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-sts-green rounded-full animate-ping opacity-75" />
        <div className="relative w-14 h-14 bg-sts-green rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.a>
  );
}