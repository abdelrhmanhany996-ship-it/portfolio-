import { useState } from 'react';
import { Project } from './data/portfolioData';
import { useContent } from './context/ContentContext';
import { CustomCursor } from './components/CustomCursor';
import { NavigationEdge } from './components/NavigationEdge';
import { HeaderBar } from './components/HeaderBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HeroSlider } from './components/HeroSlider';
import { GalleryGrid } from './components/GalleryGrid';
import { LightboxModal } from './components/LightboxModal';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';

export default function App() {
  const { content } = useContent();
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedProjectForLightbox, setSelectedProjectForLightbox] = useState<Project | null>(null);

  const handleNavigate = (view: string, categoryFilter?: string) => {
    setActiveView(view);
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProjectForLightbox(project);
  };

  const handleCloseLightbox = () => {
    setSelectedProjectForLightbox(null);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#F59E0B] selection:text-black relative">
      {/* Fixed Sticky Edge Sidebar Navigation (Desktop) */}
      <NavigationEdge
        activeView={activeView}
        onNavigate={(view) => handleNavigate(view)}
      />

      {/* Fixed Header Bar */}
      <HeaderBar
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        activeView={activeView}
        onNavigateHome={() => handleNavigate('home')}
      />

      {/* Navigation Flyout Drawer */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeView={activeView}
        onNavigate={handleNavigate}
        selectedCategory={selectedCategory}
      />

      {/* Main View Area */}
      <main className="w-full min-h-screen">
        {activeView === 'home' && (
          <HeroSlider
            projects={content.projects}
            onOpenProject={handleOpenProject}
            socials={content.profile.socials}
            autoplaySeconds={content.settings.heroAutoplaySeconds}
          />
        )}

        {activeView === 'gallery' && (
          <GalleryGrid
            projects={content.projects}
            categories={content.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onOpenProject={handleOpenProject}
          />
        )}

        {activeView === 'services' && (
          <ServicesSection
            onSelectCategory={handleSelectCategory}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {activeView === 'about' && (
          <AboutSection
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {activeView === 'contact' && (
          <ContactSection />
        )}
      </main>

      {content.settings.customCursor && <CustomCursor />}

      {/* Interactive Lightbox / Modal Project Viewer */}
      <LightboxModal
        project={selectedProjectForLightbox}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
