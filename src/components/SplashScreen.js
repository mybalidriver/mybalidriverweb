"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  // Detect mobile once on mount
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setMounted(true);

    // Only show splash on FIRST cold load, not on back-navigation
    if (sessionStorage.getItem("splashDone")) {
      setShowSplash(false);
      setIsReady(true);
    }
  }, []);

  const checkReady = useCallback(() => {
    if (document.readyState !== "complete") return false;
    const images = document.querySelectorAll("img");
    for (const img of images) {
      if (img.loading === "lazy") continue;
      if (!img.complete) return false;
    }
    return true;
  }, []);

  useEffect(() => {
    if (!mounted || !showSplash) return;
    if (!isMobile) {
      setIsReady(true);
      return;
    }

    const MIN_SPLASH_MS = 2000;
    const MAX_SPLASH_MS = 6000;
    let minTimerDone = false;
    let resourcesReady = false;

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Fast to 30%, slow through 30-70%, then wait at 85% for resources
        if (prev < 30) return prev + 3;
        if (prev < 60) return prev + 1.5;
        if (prev < 85) return prev + 0.8;
        if (resourcesReady) return Math.min(prev + 5, 100);
        return prev; // Hold at ~85 until resources ready
      });
    }, 50);

    const tryDismiss = () => {
      if (minTimerDone && resourcesReady) {
        // Jump to 100% then dismiss
        setProgress(100);
        setTimeout(() => {
          setIsReady(true);
          sessionStorage.setItem("splashDone", "1");
        }, 300);
      }
    };

    // Min timer
    const minTimer = setTimeout(() => {
      minTimerDone = true;
      tryDismiss();
    }, MIN_SPLASH_MS);

    // Max timer (safety net)
    const maxTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsReady(true);
        sessionStorage.setItem("splashDone", "1");
      }, 200);
    }, MAX_SPLASH_MS);

    // Poll for resource readiness
    const poll = setInterval(() => {
      if (checkReady()) {
        resourcesReady = true;
        clearInterval(poll);
        tryDismiss();
      }
    }, 150);

    const onLoad = () => {
      resourcesReady = true;
      clearInterval(poll);
      tryDismiss();
    };
    window.addEventListener("load", onLoad);

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
      clearInterval(progressInterval);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("app-content-ready", onAppReady);
    };
  }, [mounted, isMobile, showSplash, checkReady]);

  // Desktop or splash already shown this session — render immediately
  if ((!isMobile && mounted) || !showSplash) return children;

  // SSR — hide children to prevent flash
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
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

            {/* Progress section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute bottom-[14%] flex flex-col items-center gap-3 w-[200px]"
            >
              {/* Progress bar */}
              <div className="w-full h-[3px] bg-black/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#cce823] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: "linear" }}
                />
              </div>

              {/* Percentage */}
              <span className="text-[#1C1C1E]/40 text-[11px] font-bold tabular-nums tracking-wide">
                {Math.round(progress)}%
              </span>
            </motion.div>

            {/* Bottom tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-[6%] text-[#1C1C1E] text-[10px] font-semibold tracking-[0.15em] uppercase"
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
