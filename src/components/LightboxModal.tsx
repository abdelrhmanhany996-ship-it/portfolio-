import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Share2, Download, ExternalLink } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface LightboxModalProps {
  project: Project | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Reset index when modal opens with a new project
  useEffect(() => {
    setActiveImageIndex(0);
    setShowShareMenu(false);
  }, [project]);

  // Keyboard navigation & ESC listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        const images = [project.coverImage, ...project.galleryImages];
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        const images = [project.coverImage, ...project.galleryImages];
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const allImages = Array.from(new Set([project.coverImage, ...project.galleryImages]));
  const currentImageUrl = allImages[activeImageIndex] || project.coverImage;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentImageUrl;
    a.download = `${project.id}-artwork-${activeImageIndex + 1}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#080808]/98 backdrop-blur-xl flex flex-col justify-between overflow-hidden"
      >
        {/* Top Header Toolbar */}
        <div className="p-6 lg:px-12 flex items-center justify-between border-b border-[#292929] z-20 bg-[#080808]/90">
          {/* Left Metadata */}
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 bg-[#F59E0B] text-black text-[10px] font-bold uppercase tracking-widest rounded-xs">
              {project.category}
            </span>
            <div>
              <h2 className="font-syne text-lg font-bold uppercase text-white tracking-tight">
                {project.title}
              </h2>
              <span className="text-xs text-[#A1A1AA] uppercase">
                {project.client} · {project.year}
              </span>
            </div>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-3">
            {/* Counter */}
            <div className="text-xs font-mono font-bold tracking-widest text-[#A1A1AA] mr-4 hidden sm:block">
              <span className="text-[#F59E0B]">{activeImageIndex + 1}</span> / {allImages.length}
            </div>

            {/* Share Menu Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                aria-label="Share options"
                className="p-2.5 bg-[#121212] hover:bg-[#292929] border border-[#292929] hover:border-[#F59E0B] rounded-full text-white transition-colors focus-visible:outline-none"
              >
                <Share2 className="w-4 h-4 text-[#F59E0B]" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 top-12 w-48 bg-[#121212] border border-[#292929] rounded-xl shadow-2xl p-2 z-30 space-y-1">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 text-xs text-[#A1A1AA] hover:text-white hover:bg-[#292929] rounded-lg transition-colors"
                  >
                    Share on Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(project.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 text-xs text-[#A1A1AA] hover:text-white hover:bg-[#292929] rounded-lg transition-colors"
                  >
                    Tweet Project
                  </a>
                  <button
                    onClick={handleDownload}
                    className="w-full text-left px-3 py-2 text-xs text-[#A1A1AA] hover:text-white hover:bg-[#292929] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Download Image</span>
                    <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Lightbox"
              className="p-2.5 bg-[#121212] hover:bg-[#F59E0B] border border-[#292929] hover:border-[#F59E0B] rounded-full text-white hover:text-black transition-colors focus-visible:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Media Canvas Container */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 select-none">
          {/* Previous Button */}
          {allImages.length > 1 && (
            <button
              onClick={prevImage}
              aria-label="Previous Image"
              className="absolute left-4 lg:left-8 z-20 p-3 bg-[#121212]/80 hover:bg-[#F59E0B] text-white hover:text-black border border-[#292929] hover:border-[#F59E0B] rounded-full backdrop-blur-md transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image Display */}
          <motion.div
            key={currentImageUrl}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl max-h-[75vh] flex items-center justify-center"
          >
            <img
              src={currentImageUrl}
              alt={`${project.title} artwork ${activeImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-[#292929]"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              onClick={nextImage}
              aria-label="Next Image"
              className="absolute right-4 lg:right-8 z-20 p-3 bg-[#121212]/80 hover:bg-[#F59E0B] text-white hover:text-black border border-[#292929] hover:border-[#F59E0B] rounded-full backdrop-blur-md transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Details Footer */}
        <div className="p-6 lg:px-12 bg-[#080808]/90 border-t border-[#292929] z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1 max-w-3xl">
            <p className="text-xs text-[#A1A1AA] line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-wider text-[#A1A1AA]">
              <span>Art Direction: <strong className="text-white">{project.credits.artDirection}</strong></span>
              <span>·</span>
              <span>Artist: <strong className="text-white">{project.credits.artist}</strong></span>
              {project.credits.retouching && (
                <>
                  <span>·</span>
                  <span>Retouching: <strong className="text-white">{project.credits.retouching}</strong></span>
                </>
              )}
            </div>
          </div>

          {project.behanceUrl && (
            <a
              href={project.behanceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] hover:bg-[#F59E0B] text-white hover:text-black border border-[#292929] hover:border-[#F59E0B] text-xs font-syne font-bold uppercase tracking-widest rounded-full transition-all shrink-0"
            >
              <span>VIEW ON BEHANCE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
