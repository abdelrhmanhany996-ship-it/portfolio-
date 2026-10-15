import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import { api } from '../lib/api';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const profile = useContent().content.profile;
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;

    setLoading(true);
    setError('');
    api
      .sendMessage({ name: formData.fullName, email: formData.email, message: formData.message })
      .then(() => setSubmitted(true))
      .catch(() => setError(`Couldn't send right now. Please email ${profile.email} directly.`))
      .finally(() => setLoading(false));
  };

  return (
    <section className="min-h-screen bg-[#080808] pt-28 pb-20 px-6 lg:px-16 lg:pr-24 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#F59E0B] font-semibold block">
            CONTACT US
          </span>
          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-tight">
            Drop me a line
          </h2>
          <p className="text-xs text-[#A1A1AA] uppercase tracking-widest">
            Feel free to contact me anytime from {profile.workingHours}
          </p>
        </div>

        {/* Contact Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121212] border border-[#292929] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <CheckCircle2 className="w-16 h-16 text-[#F59E0B] mx-auto" />
              <h3 className="font-syne text-2xl font-bold uppercase text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                Thank you, {formData.fullName}. Your message has been received. I will get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: '', email: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 bg-[#292929] hover:bg-[#F59E0B] hover:text-black text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-xs uppercase tracking-widest text-[#A1A1AA]">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#080808] border-b-2 border-[#292929] focus:border-[#F59E0B] px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[#A1A1AA]">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#080808] border-b-2 border-[#292929] focus:border-[#F59E0B] px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Your Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-[#A1A1AA]">
                  Your Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, timeline, or campaign goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#080808] border-b-2 border-[#292929] focus:border-[#F59E0B] px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none transition-colors resize-none"
                />
              </div>

              {error && (
                <p role="alert" className="text-center text-xs text-red-400">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-syne text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-[#F59E0B]/20 disabled:opacity-50"
                >
                  <span>{loading ? 'SENDING...' : 'SEND NOW'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Bottom Quick Contact Cards (Matching Reference Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
          <div className="p-6 bg-[#121212] border border-[#292929] rounded-xl space-y-2">
            <Phone className="w-5 h-5 text-[#F59E0B] mx-auto" />
            <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] block">PHONE</span>
            <a
              href={`tel:${profile.phone}`}
              className="font-mono text-sm font-bold text-white hover:text-[#F59E0B] transition-colors block"
            >
              {profile.phone}
            </a>
          </div>

          <div className="p-6 bg-[#121212] border border-[#292929] rounded-xl space-y-2">
            <Mail className="w-5 h-5 text-[#F59E0B] mx-auto" />
            <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] block">EMAIL</span>
            <a
              href={`mailto:${profile.email}`}
              className="text-xs font-bold text-white hover:text-[#F59E0B] transition-colors block"
            >
              {profile.email}
            </a>
          </div>

          <div className="p-6 bg-[#121212] border border-[#292929] rounded-xl space-y-2">
            <MapPin className="w-5 h-5 text-[#F59E0B] mx-auto" />
            <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] block">LOCATION</span>
            <span className="text-xs font-bold text-white block">
              {profile.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
