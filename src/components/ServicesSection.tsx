import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicesSectionProps {
  onSelectCategory: (category: string) => void;
  onNavigateContact: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectCategory,
  onNavigateContact,
}) => {
  const { services } = useContent().content;

  return (
    <section className="min-h-screen bg-[#080808] pt-28 pb-20 px-6 lg:px-16 lg:pr-24 flex flex-col justify-center">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full mb-12 border-b border-[#292929] pb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-[#F59E0B] font-semibold block mb-2">
          CREATIVE CAPABILITIES
        </span>
        <h2 className="font-syne text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight">
          Services &amp; Specializations
        </h2>
      </div>

      {/* 3 Full-Height Split Column Cards */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative h-[500px] lg:h-[600px] bg-[#121212] border border-[#292929] rounded-2xl overflow-hidden flex flex-col justify-between p-8 hover:border-[#F59E0B] transition-all duration-500"
          >
            {/* Background Image */}
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-30 group-hover:opacity-40"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent z-10" />

            {/* Top Content */}
            <div className="relative z-20 space-y-3">
              <span className="text-xs font-mono font-bold text-[#F59E0B] tracking-widest">
                {String(idx + 1).padStart(2, '0')} // CAPABILITY
              </span>
              <h3 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
                {service.title}
              </h3>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider">
                {service.subtitle}
              </p>
            </div>

            {/* Bottom Content & Feature List */}
            <div className="relative z-20 space-y-6">
              <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
                {service.features.map((feat, i) => (
                  <li key={feat + i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-[#292929] flex items-center justify-between">
                <button
                  onClick={() => onSelectCategory(service.filterCategory)}
                  className="inline-flex items-center gap-2 text-xs font-syne font-bold uppercase tracking-widest text-[#F59E0B] hover:text-white transition-colors"
                >
                  <span>VIEW WORKS</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Footer Banner */}
      <div className="max-w-7xl mx-auto w-full mt-12 p-8 sm:p-12 bg-[#121212] border border-[#292929] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-syne text-2xl font-bold uppercase text-white tracking-tight">
            Have a commercial project or campaign in mind?
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Let's collaborate to build extraordinary visual master key art for your brand.
          </p>
        </div>
        <button
          onClick={onNavigateContact}
          className="px-8 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-black font-syne text-xs font-bold uppercase tracking-widest rounded-full transition-all shrink-0 shadow-lg shadow-[#F59E0B]/20"
        >
          START COLLABORATION
        </button>
      </div>
    </section>
  );
};
