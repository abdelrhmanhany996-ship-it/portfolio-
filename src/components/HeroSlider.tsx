import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface HeroSliderProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ projects, onOpenProject }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const featuredProjects = projects.filter((p) => p.featured).length > 0
    ? projects.filter((p) => p.featured)
    : projects;

  const totalSlides = featuredProjects.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Handle keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle mouse wheel for sliding
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 40) {
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const currentProject = featuredProjects[currentIndex];

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen overflow-hidden bg-[#080808] select-none"
    >
      {/* Background Showcase Carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentProject.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Cover Image */}
          <img
            src={currentProject.coverImage}
            alt={currentProject.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Gradient Scrims for Editorial Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-[#080808]/50" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Overlay Content (Bottom-Left) */}
      <div className="absolute bottom-12 sm:bottom-16 left-6 lg:left-16 z-20 max-w-2xl pr-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Category Kicker */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#F59E0B] text-black text-[10px] font-bold uppercase tracking-widest rounded-xs">
                {currentProject.category}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#A1A1AA]">
                {currentProject.client} · {currentProject.year}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-none drop-shadow-md">
              {currentProject.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#A1A1AA] max-w-xl font-normal line-clamp-2">
              {currentProject.subtitle}
            </p>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => onOpenProject(currentProject)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-syne text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#F59E0B]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>VIEW PROJECT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows & Counter (Bottom Right) */}
      <div className="absolute bottom-12 sm:bottom-16 right-6 lg:right-24 z-20 flex items-center gap-6 bg-[#121212]/80 backdrop-blur-md px-5 py-3 rounded-full border border-[#292929]">
        {/* Slide Counter */}
        <div className="font-syne text-sm font-bold tracking-widest text-white">
          <span className="text-[#F59E0B]">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-[#292929] mx-1.5">/</span>
          <span className="text-[#A1A1AA]">
            {String(totalSlides).padStart(2, '0')}
          </span>
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="p-2 text-[#A1A1AA] hover:text-[#F59E0B] hover:bg-[#292929] rounded-full transition-colors focus-visible:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="p-2 text-[#A1A1AA] hover:text-[#F59E0B] hover:bg-[#292929] rounded-full transition-colors focus-visible:outline-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Left Social Links Bar */}
      <div className="hidden lg:flex fixed bottom-8 left-16 z-20 items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#F59E0B] transition-colors"
        >
          INSTAGRAM
        </a>
        <span>·</span>
        <a
          href="https://behance.net"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#F59E0B] transition-colors"
        >
          BEHANCE
        </a>
        <span>·</span>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#F59E0B] transition-colors"
        >
          LINKEDIN
        </a>
      </div>
    </div>
  );
};
