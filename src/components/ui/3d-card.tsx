import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, MapPin, Star, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Destination } from '@/types/trip';

export interface InteractiveTravelCardProps {
  destination: Destination;
  onActionClick: (destination: Destination) => void;
  actionText?: string;
  className?: string;
}

export const InteractiveTravelCard: React.FC<InteractiveTravelCardProps> = ({
  destination,
  onActionClick,
  actionText = "Plan a trip here",
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for X & Y tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for spring physics (stiffness 260, damping 30)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10.5, -10.5]), {
    stiffness: 260,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10.5, 10.5]), {
    stiffness: 260,
    damping: 30,
  });

  // Glare / sheen effect
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className={cn("w-full flex items-center justify-center py-4", className)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-sm sm:max-w-md h-[430px] rounded-3xl overflow-hidden border border-slate-700/50 bg-slate-900/90 shadow-2xl transition-shadow duration-300 hover:shadow-sky-500/20 group cursor-pointer"
      >
        {/* Background Image with Zoom on Hover */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover transform scale-105 group-hover:scale-115 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
        </div>

        {/* Dynamic Glare Sheen Overlay */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Top Floating Bar */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative z-10 p-5 flex items-center justify-between"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-sky-400 border border-sky-500/30 backdrop-blur-md shadow-lg">
            <Compass className="w-3.5 h-3.5" /> {destination.category}
          </span>

          <a
            href={destination.quickFactsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Read quick facts on Wikipedia"
            className="p-2.5 rounded-full bg-slate-900/70 hover:bg-sky-500 text-white border border-slate-700 hover:border-sky-400 backdrop-blur-md transition-all duration-300 shadow-md group/link"
          >
            <ArrowUpRight className="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Content Overlay */}
        <div
          style={{ transform: "translateZ(50px)" }}
          className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end space-y-3"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.country}</span>
              {destination.flightDuration && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 normal-case">{destination.flightDuration}</span>
                </>
              )}
            </div>

            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:text-sky-200 transition-colors">
              {destination.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {destination.tagline || destination.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{destination.rating}</span>
              <span className="text-slate-400 font-normal">({destination.reviewCount.toLocaleString()})</span>
            </div>

            {/* Glassmorphism Action Button */}
            <button
              type="button"
              onClick={() => onActionClick(destination)}
              style={{ transform: "translateZ(20px)" }}
              className="px-4 py-2.5 rounded-xl bg-sky-500/90 hover:bg-sky-400 text-white font-semibold text-xs border border-sky-300/40 backdrop-blur-md shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 transition-all duration-300 flex items-center gap-2 group/btn"
            >
              <span>{actionText}</span>
              <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Aliased as DestinationSearchCard for search integration
export const DestinationSearchCard = InteractiveTravelCard;
