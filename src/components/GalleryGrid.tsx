import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface GalleryGridProps {
  projects: Project[];
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
  onOpenProject: (project: Project) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  projects,
  selectedCategory = 'ALL',
  onSelectCategory,
  onOpenProject,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = ['ALL', 'MASTER KV', 'CAMPAIGN', 'RETOUCHING', 'POST PRODUCTION', 'SM DESIGNS'];

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-[#080808] pt-28 pb-20 px-6 lg:px-16 lg:pr-24">
      {/* Header & Filter Controls */}
      <div className="max-w-7xl mx-auto mb-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#292929] pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#F59E0B] font-semibold block mb-2">
              PORTFOLIO SHOWCASE
            </span>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              Selected Works
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase font-semibold tracking-wider rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F59E0B] ${
                    isActive
                      ? 'bg-[#F59E0B] text-black shadow-md shadow-[#F59E0B]/20'
                      : 'bg-[#121212] text-[#A1A1AA] border border-[#292929] hover:border-[#F59E0B] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onOpenProject(project)}
                className="group relative h-96 bg-[#121212] border border-[#292929] rounded-xl overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-[#F59E0B]"
              >
                {/* Project Image */}
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Default Bottom Gradient Bar */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Always-Visible Bottom Title Banner */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">
                      {project.category}
                    </span>
                    <h3 className="font-syne text-xl font-bold uppercase text-white tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#121212]/80 border border-[#292929] group-hover:border-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-black flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>

                {/* Hover Reveal Card Overlay */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: hoveredId === project.id ? 1 : 0,
                    y: hoveredId === project.id ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-[#080808]/90 backdrop-blur-xs p-6 flex flex-col justify-between z-20 pointer-events-none"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-[#F59E0B] text-black text-[10px] font-bold uppercase tracking-widest rounded-xs">
                        {project.category}
                      </span>
                      <span className="text-xs text-[#A1A1AA] uppercase">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="font-syne text-2xl font-extrabold uppercase text-white tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] line-clamp-3">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#292929] flex items-center justify-between text-xs font-semibold text-[#F59E0B] uppercase tracking-wider">
                    <span>VIEW PROJECT DETAILS</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <p className="text-[#A1A1AA] text-sm uppercase tracking-widest">
              No projects found in this category.
            </p>
            <button
              onClick={() => onSelectCategory('ALL')}
              className="px-6 py-2 bg-[#F59E0B] text-black font-semibold text-xs uppercase tracking-widest rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      <div className="fixed bottom-8 right-6 lg:right-24 z-30">
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-12 h-12 bg-[#121212]/90 hover:bg-[#F59E0B] text-white hover:text-black border border-[#292929] hover:border-[#F59E0B] rounded-full flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 focus-visible:outline-none"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
