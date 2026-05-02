"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);
  }, []);

  const checkReady = useCallback(() => {
    // 1. DOM must be fully interactive
    if (document.readyState !== "complete") return false;

    // 2. All visible images must be loaded (or errored — either way, settled)
    const images = document.querySelectorAll("img");
    for (const img of images) {
      // Skip images that are hidden or off-screen (lazy-loaded below fold)
      if (img.loading === "lazy") continue;
      if (!img.complete) return false;
    }

    return true;
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isMobile) {
      setIsReady(true);
      return;
    }

    // Minimum display time so the splash doesn't just flash
    const MIN_SPLASH_MS = 1800;
    const MAX_SPLASH_MS = 6000;
    const startTime = Date.now();
    let minTimerDone = false;
    let resourcesReady = false;

    const tryDismiss = () => {
      if (minTimerDone && resourcesReady) {
        setIsReady(true);
      }
    };

    // Min timer
    const minTimer = setTimeout(() => {
      minTimerDone = true;
      tryDismiss();
    }, MIN_SPLASH_MS);

    // Max timer (safety net — never wait longer than this)
    const maxTimer = setTimeout(() => {
      setIsReady(true);
    }, MAX_SPLASH_MS);

    // Poll for resource readiness
    const poll = setInterval(() => {
      if (checkReady()) {
        resourcesReady = true;
        clearInterval(poll);
        tryDismiss();
      }
    }, 150);

    // Also listen for the window load event
    const onLoad = () => {
      resourcesReady = true;
      clearInterval(poll);
      tryDismiss();
    };
    window.addEventListener("load", onLoad);

    // Listen for custom "app-ready" event from HomeClient
    const onAppReady = () => {
      resourcesReady = true;
      clearInterval(poll);
      tryDismiss();
    };
    window.addEventListener("app-content-ready", onAppReady);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearInterval(poll);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("app-content-ready", onAppReady);
    };
  }, [mounted, isMobile, checkReady]);

  // Desktop — render immediately
  if (!isMobile && mounted) return children;

  // SSR / first paint — render nothing visible to avoid hydration flash
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
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

      {/* Content renders behind the splash — hidden until ready */}
      <div style={{ visibility: isReady ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
