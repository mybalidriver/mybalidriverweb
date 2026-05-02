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
    }, 2200);

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
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1C1C1E]"
            style={{ touchAction: "none" }}
          >
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#cce823]/10 blur-[100px] pointer-events-none" />

            {/* Logo container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Logo */}
              <img src="/icon.jpg" alt="MyBaliDriver" className="w-24 h-24 rounded-[28px] shadow-[0_0_60px_rgba(204,232,35,0.3)] mb-6 object-contain" />

              {/* Brand name */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-white text-[22px] font-black tracking-tight mb-1"
              >
                mybalidriver
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white text-[11px] font-bold tracking-[0.3em] uppercase"
              >
                Premium Bali Tours
              </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute bottom-[15%] flex flex-col items-center gap-4"
            >
              {/* Animated progress bar */}
              <div className="w-[120px] h-[3px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1/2 h-full bg-[#cce823] rounded-full"
                />
              </div>
            </motion.div>

            {/* Bottom safe area text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-[6%] text-white text-[10px] font-semibold tracking-[0.15em] uppercase"
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
