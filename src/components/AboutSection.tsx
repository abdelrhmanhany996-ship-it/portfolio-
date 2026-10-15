import React from 'react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import { Mail, Phone, MapPin, Award, CheckCircle } from 'lucide-react';

interface AboutSectionProps {
  onNavigateContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigateContact }) => {
  const profile = useContent().content.profile;
  return (
    <section className="min-h-screen bg-[#080808] pt-28 pb-20 px-6 lg:px-16 lg:pr-24 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="border-b border-[#292929] pb-8 mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#F59E0B] font-semibold block mb-2">
            {profile.title}
          </span>
          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight">
            About {profile.name}
          </h2>
        </div>

        {/* Grid Split: Portrait & Biography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Portrait Photography */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] bg-[#121212] border border-[#292929] rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={profile.portrait}
                alt={profile.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />

              {/* Stat Badge Overlay */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-[#F59E0B] text-black rounded-xl font-syne font-extrabold text-2xl tracking-tight shadow-xl flex items-center gap-1">
                <span>{profile.experienceYears}</span>
                <span className="text-xs font-semibold uppercase tracking-widest block leading-tight">
                  YEARS<br />EXP
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
                  {profile.brand} FOUNDER
                </span>
                <h3 className="font-syne text-2xl font-extrabold text-white uppercase">
                  {profile.name}
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Prose & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight leading-snug">
                {profile.headline}
              </h3>
              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Key Accomplishments Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#292929]">
              <div className="p-4 bg-[#121212] border border-[#292929] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <Award className="w-4 h-4" />
                  <span className="font-syne font-extrabold text-xl text-white">{profile.experienceYears} Years</span>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  International &amp; regional agency art direction.
                </p>
              </div>

              <div className="p-4 bg-[#121212] border border-[#292929] rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-syne font-extrabold text-xl text-white">{profile.gulfExperienceYears} Years</span>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Dedicated experience in the Gulf market (KSA, UAE, Kuwait).
                </p>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="pt-6 border-t border-[#292929] flex flex-wrap gap-6 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F59E0B]" />
                <span className="font-mono text-white">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-white">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-white">{profile.location}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onNavigateContact}
                className="px-8 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-black font-syne text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg shadow-[#F59E0B]/20"
              >
                GET IN TOUCH NOW
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
