import React from 'react';
import { Images, Star, Inbox, Layers, ArrowRight, UserRound } from 'lucide-react';
import type { ViewProps, Tab } from '../AdminApp';
import type { ContactMessage } from '../../lib/api';
import { Card, Badge } from '../ui';

export const OverviewView: React.FC<ViewProps & { messages: ContactMessage[]; go: (t: Tab) => void }> = ({ draft, messages, go }) => {
  const { projects, profile, categories, services } = draft;
  const featured = projects.filter((p) => p.featured).length;
  const unread = messages.filter((m) => !m.read).length;
  const images = projects.reduce((n, p) => n + p.galleryImages.length, 0);

  const stats = [
    { label: 'Projects', value: projects.length, sub: `${images} gallery images`, icon: Images, tab: 'projects' as Tab },
    { label: 'Featured on home', value: featured, sub: 'Shown in hero slider', icon: Star, tab: 'projects' as Tab },
    { label: 'Services', value: services.length, sub: `${categories.length} categories`, icon: Layers, tab: 'services' as Tab },
    { label: 'Messages', value: messages.length, sub: `${unread} unread`, icon: Inbox, tab: 'messages' as Tab },
  ];

  const perCategory = categories.map((c) => ({ c, n: projects.filter((p) => p.category === c).length }));
  const max = Math.max(1, ...perCategory.map((x) => x.n));

  return (
    <div className="space-y-6">
      {/* Profile hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#232326] bg-[#121214]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.14),transparent_55%)]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6">
          <img src={profile.portrait} alt="" className="w-20 h-20 rounded-2xl object-cover border border-[#2E2E33]" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#8A8A93]">Welcome back</p>
            <h2 className="font-syne text-2xl font-extrabold truncate">{profile.name}</h2>
            <p className="text-sm text-[#A1A1AA]">{profile.title}</p>
          </div>
          <button onClick={() => go('profile')} className="inline-flex items-center gap-2 text-xs font-semibold text-[#F59E0B] hover:text-white">
            <UserRound className="w-4 h-4" /> Edit profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, tab }) => (
          <button
            key={label}
            onClick={() => go(tab)}
            className="text-left p-5 rounded-2xl bg-[#121214] border border-[#232326] hover:border-[#F59E0B]/50 transition-colors group"
          >
            <div className="flex items-center justify-between text-[#8A8A93]">
              <span className="text-xs font-medium">{label}</span>
              <Icon className="w-4 h-4 group-hover:text-[#F59E0B] transition-colors" />
            </div>
            <div className="font-syne text-3xl font-extrabold mt-3">{value}</div>
            <div className="text-[11px] text-[#71717A] mt-1">{sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card title="Projects by category" className="lg:col-span-2">
          <ul className="space-y-3">
            {perCategory.map(({ c, n }) => (
              <li key={c}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#C4C4CC]">{c}</span>
                  <span className="font-mono text-[#8A8A93]">{n}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1C1C20] overflow-hidden">
                  <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Latest messages"
          className="lg:col-span-3"
          actions={
            <button onClick={() => go('messages')} className="text-xs text-[#F59E0B] inline-flex items-center gap-1 hover:text-white">
              All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          {messages.length === 0 ? (
            <p className="text-xs text-[#71717A] py-6 text-center">No messages yet. Contact form submissions will appear here.</p>
          ) : (
            <ul className="divide-y divide-[#1F1F23] -my-3">
              {messages.slice(0, 5).map((m) => (
                <li key={m.id} className="py-3 flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#1C1C20] flex items-center justify-center text-xs font-bold text-[#F59E0B]">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{m.name}</span>
                      {!m.read && <Badge tone="amber">New</Badge>}
                    </div>
                    <p className="text-xs text-[#8A8A93] truncate">{m.message}</p>
                  </div>
                  <time className="text-[11px] text-[#71717A] shrink-0">{new Date(m.createdAt).toLocaleDateString()}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Recent projects" actions={<button onClick={() => go('projects')} className="text-xs text-[#F59E0B] hover:text-white">Manage</button>}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {projects.slice(0, 8).map((p) => (
            <div key={p.id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0B0B0C] border border-[#232326]">
              <img src={p.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-2 left-2.5 right-2.5 text-xs font-semibold truncate">{p.title}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
