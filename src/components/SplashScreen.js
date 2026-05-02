"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    if (!mobile) {
      setIsLoading(false);
      return;
    }

    // Check if already shown this session
    const hasShown = sessionStorage.getItem("splashShown");
    if (hasShown) {
      setIsLoading(false);
      return;
    }

    // Wait for critical resources, then dismiss
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("splashShown", "1");
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (!isMobile) return children;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
            style={{ touchAction: "none" }}
          >
            {/* Soft ambient gradient */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#cce823]/8 blur-[120px]" />
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-sky-200/20 blur-[100px]" />
            </div>

            {/* Logo container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Logo with pulse ring */}
              <div className="relative mb-8">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: [0, 0.15, 0] }}
                  transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
                  className="absolute inset-[-16px] rounded-full border-2 border-[#cce823]/30"
                />
                <img
                  src="/icon.jpg"
                  alt="MyBaliDriver"
                  className="w-[88px] h-[88px] rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] object-contain"
                />
              </div>

              {/* Brand name */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#1C1C1E] text-[22px] font-black tracking-tight mb-1.5"
              >
                mybalidriver
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.45, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#1C1C1E] text-[11px] font-semibold tracking-[0.25em] uppercase"
              >
                Premium Bali Tours
              </motion.p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="absolute bottom-[16%] flex items-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-[6px] h-[6px] rounded-full bg-[#cce823]"
                />
              ))}
            </motion.div>

            {/* Bottom tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-[7%] text-[#1C1C1E] text-[10px] font-semibold tracking-[0.15em] uppercase"
            >
              Bali, Indonesia
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always render children behind splash */}
      <div style={{ visibility: isLoading ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}
