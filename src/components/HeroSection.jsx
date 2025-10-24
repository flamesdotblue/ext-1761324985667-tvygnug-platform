import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/M2rj0DQ6tP7dSzSz/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-neutral-950/95" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 text-emerald-300 text-xs mb-4">
            <Leaf className="h-3.5 w-3.5" />
            Track • Analyze • Reduce
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            EcoTrack
            <span className="block text-emerald-400">Your Carbon Footprint Companion</span>
          </h1>
          <p className="mt-4 text-neutral-300">
            Monitor emissions across transport, energy, diet, and waste. Visualize city-level emissions and check real-time air quality.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
