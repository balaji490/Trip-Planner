import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Destination } from '../types/trip';
import { ChevronLeft, ChevronRight, Star, Sparkles, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface DestinationCarouselProps {
  destinations: Destination[];
  activeDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
  onPlanTrip: (dest: Destination) => void;
}

export const DestinationCarousel: React.FC<DestinationCarouselProps> = ({
  destinations,
  activeDestination,
  onSelectDestination,
  onPlanTrip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync activeIndex with activeDestination prop
  useEffect(() => {
    const idx = destinations.findIndex(d => d.id === activeDestination.id);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [activeDestination.id]);

  // Animated Starfield Background Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 480;
    };
    window.addEventListener('resize', handleResize);

    const stars: Array<{ x: number; y: number; radius: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.012 + 0.004,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${Math.max(0, star.alpha)})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Navigate
  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(destinations.length - 1, idx));
    setActiveIndex(clamped);
    onSelectDestination(destinations[clamped]);
  }, [destinations, onSelectDestination]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    else if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
  };

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
  };

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Destination showcase carousel"
      className="relative w-full py-4 md:py-6 bg-[#050914] overflow-hidden focus:outline-none select-none"
    >
      {/* Background Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Radiant Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[200px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-4 text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-sky-500/30 text-sky-400 text-[11px] font-semibold backdrop-blur-md shadow-lg">
          <Sparkles className="w-3 h-3 animate-pulse text-sky-400" />
          <span>Curated Global Destinations</span>
        </div>
        <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
          Where Will Your Journey Take You?
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Drag or press arrow keys to explore world-famous places on the convex 3D carousel.
        </p>
      </div>

      {/* 3D Convex Outer Semi-Circle Arc Area */}
      <div className="relative z-10 w-full overflow-hidden" style={{ perspective: '1100px' }}>
        {/* Navigation Buttons */}
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-slate-900/80 hover:bg-sky-500 text-white border border-slate-700 hover:border-sky-400 disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md shadow-xl transition-all"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === destinations.length - 1}
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-slate-900/80 hover:bg-sky-500 text-white border border-slate-700 hover:border-sky-400 disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md shadow-xl transition-all"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Convex 3D Arc Stage (Middle card is UP in front, side cards curve backward & outward) */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            height: '370px',
            transformStyle: 'preserve-3d',
          }}
        >
          {destinations.map((dest, idx) => {
            const offset = idx - activeIndex; // -3, -2, -1, 0, 1, 2, 3
            const absOffset = Math.abs(offset);

            // Convex Arch Math: Center card bulges UP toward viewer, side cards recede back!
            const angleDeg = offset * 22; // 22 degrees per card
            const angleRad = (angleDeg * Math.PI) / 180;

            // X spreads out along sine wave
            const translateX = Math.sin(angleRad) * 410;
            // Z retreats backward into background for side cards (middle card is UP in front at Z=0)
            const translateZ = -absOffset * 95;
            // Convex outer curve: side cards angle outward away from center
            const rotateY = -angleDeg * 0.65;

            const isActive = idx === activeIndex;
            const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.85 : absOffset === 2 ? 0.6 : absOffset === 3 ? 0.35 : 0.15;
            const scale = absOffset === 0 ? 1.08 : absOffset === 1 ? 0.88 : absOffset === 2 ? 0.78 : 0.68;
            // Ensure middle card sits UP in front with highest zIndex
            const zIndex = 100 - absOffset * 10;

            if (absOffset > 4) return null;

            return (
              <div
                key={dest.id}
                onClick={() => goTo(idx)}
                className="absolute cursor-pointer group flex flex-col items-center"
                style={{
                  transform: `
                    translateX(${translateX}px)
                    translateZ(${translateZ}px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  opacity,
                  zIndex,
                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Title Label Above Card */}
                <div className="mb-1.5 tracking-[0.2em] text-[10px] md:text-[11px] font-black text-slate-300 uppercase drop-shadow text-center transition-colors group-hover:text-cyan-300">
                  {dest.name}
                </div>

                {/* Card with INCREASED BREADTH (Wider ratio: 270px width x 255px height) */}
                <div
                  className={cn(
                    "relative w-[210px] sm:w-[245px] md:w-[270px] h-[220px] sm:h-[245px] md:h-[260px] rounded-2xl overflow-hidden border bg-slate-950 shadow-2xl flex flex-col justify-end p-4 transition-all duration-500",
                    isActive
                      ? "border-cyan-400 shadow-cyan-500/50 ring-2 ring-cyan-500/30"
                      : "border-slate-800 hover:border-slate-700"
                  )}
                >
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                      {dest.category.split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-400 text-[9px] font-bold border border-slate-800 backdrop-blur-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>

                  {/* Bottom Details */}
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-1 text-[9px] text-cyan-400 font-bold uppercase tracking-wider">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{dest.country}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none">
                      {dest.name}
                    </h3>

                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlanTrip(dest);
                        }}
                        className="mt-2 w-full py-1.5 px-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>Start Plan</span>
                        <span className="transform group-hover/btn:translate-x-0.5 transition-transform">→</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Glossy Reflective Floor Mirror */}
                <div
                  aria-hidden="true"
                  className="relative w-[92%] h-[60px] sm:h-[75px] mt-1 rounded-xl overflow-hidden pointer-events-none transform scale-y-[-1] opacity-35 select-none"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                  }}
                >
                  <img
                    src={dest.imageUrl}
                    alt=""
                    className="w-full h-full object-cover filter blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#050914] via-slate-950/70 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Counter & Dots */}
      <div className="relative z-10 max-w-xl mx-auto px-6 mt-1 flex flex-col items-center space-y-1.5">
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 tracking-wider">
          <span className="text-cyan-400 font-bold text-xs">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <div className="w-10 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / destinations.length) * 100}%` }}
            />
          </div>
          <span>{String(destinations.length).padStart(2, '0')}</span>
        </div>

        {/* Dots Pagination */}
        <div className="flex items-center gap-1">
          {destinations.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                idx === activeIndex
                  ? "w-5 bg-cyan-400 shadow-md shadow-cyan-400/50"
                  : "w-1 bg-slate-700 hover:bg-slate-500"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
