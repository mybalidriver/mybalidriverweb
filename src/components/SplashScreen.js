export default function SplashScreen({ children }) {
  // Gutted for performance optimization: Removed artificial loading delays and framer-motion UI blocks
  // to ensure instant perceived rendering.
  return <>{children}</>;
}
