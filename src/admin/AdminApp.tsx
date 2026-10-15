import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Images,
  UserRound,
  Layers,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Lock,
  Loader2,
} from 'lucide-react';
import { SiteContent } from '../data/portfolioData';
import { normalizeContent, useContent } from '../context/ContentContext';
import { api, ApiError, auth, ContactMessage } from '../lib/api';
import { BrandMark } from '../components/BrandMark';
import { Button, cx, inputCls, Toasts, ToastMsg } from './ui';
import { OverviewView } from './views/OverviewView';
import { ProjectsView } from './views/ProjectsView';
import { ProfileView } from './views/ProfileView';
import { ServicesView } from './views/ServicesView';
import { MessagesView } from './views/MessagesView';
import { SettingsView } from './views/SettingsView';

export type Tab = 'overview' | 'projects' | 'profile' | 'services' | 'messages' | 'settings';

export interface ViewProps {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
  notify: (text: string, tone?: ToastMsg['tone']) => void;
}

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects & Gallery', icon: Images },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'messages', label: 'Messages', icon: Inbox },
  { id: 'settings', label: 'Site Settings', icon: Settings },
];

const tabFromHash = (): Tab => {
  const t = window.location.hash.split('/')[2] as Tab;
  return NAV.some((n) => n.id === t) ? t : 'overview';
};

export default function AdminApp() {
  const [status, setStatus] = useState<'checking' | 'out' | 'in'>(auth.token ? 'checking' : 'out');

  useEffect(() => {
    document.title = 'Dashboard — Studio CMS';
    if (!auth.token) return;
    api
      .verify()
      .then(() => setStatus('in'))
      .catch(() => {
        auth.clear();
        setStatus('out');
      });
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#F59E0B] animate-spin" />
      </div>
    );
  }
  if (status === 'out') return <Login onSuccess={() => setStatus('in')} />;
  return (
    <Dashboard
      onLogout={() => {
        auth.clear();
        setStatus('out');
      }}
    />
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const { content } = useContent();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await api.login(password);
      auth.set(token);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Server unreachable. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.12),transparent_60%)]" />
      <form onSubmit={submit} className="relative w-full max-w-sm bg-[#121214] border border-[#232326] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <BrandMark brand={content.profile.brand} className="block font-syne text-xl font-extrabold uppercase text-white" />
          <p className="text-xs text-[#8A8A93]">Sign in to manage your portfolio</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pw" className="block text-xs font-semibold text-[#C4C4CC]">
            Admin password
          </label>
          <input id="pw" type="password" autoFocus required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          {error && (
            <p role="alert" className="text-xs text-red-400 pt-1">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Sign in
        </Button>
        <a href="#/" className="block text-center text-xs text-[#8A8A93] hover:text-[#F59E0B]">
          ← Back to website
        </a>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { content, setContent, loading } = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [navOpen, setNavOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const toastId = useRef(0);

  // Sync draft once server content arrives.
  useEffect(() => {
    if (!loading) setDraft(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const notify = useCallback((text: string, tone: ToastMsg['tone'] = 'success') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const handleAuthError = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) {
        onLogout();
        return true;
      }
      return false;
    },
    [onLogout],
  );

  const loadMessages = useCallback(() => {
    api
      .getMessages()
      .then(setMessages)
      .catch((e) => !handleAuthError(e) && notify('Could not load messages', 'error'));
  }, [handleAuthError, notify]);

  useEffect(loadMessages, [loadMessages]);

  const update = useCallback((fn: (d: SiteContent) => SiteContent) => setDraft((d) => fn(d)), []);

  const save = async () => {
    setSaving(true);
    try {
      const saved = normalizeContent(await api.saveContent(draft));
      setContent(saved);
      setDraft(saved);
      notify('Changes published to the website');
    } catch (e) {
      if (!handleAuthError(e)) notify((e as Error).message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const go = (t: Tab) => {
    window.location.hash = `#/admin/${t}`;
    setNavOpen(false);
    window.scrollTo({ top: 0 });
  };

  const unread = messages.filter((m) => !m.read).length;
  const viewProps: ViewProps = { draft, update, notify };
  const current = NAV.find((n) => n.id === tab)!;

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      {/* Sidebar */}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F11] border-r border-[#1F1F23] flex flex-col transition-transform lg:translate-x-0',
          navOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1F1F23]">
          <BrandMark brand={draft.profile.brand} className="font-syne text-lg font-extrabold uppercase tracking-tight" />
          <button className="lg:hidden p-1.5 text-[#A1A1AA]" onClick={() => setNavOpen(false)} aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={cx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                tab === id ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E]',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {id === 'messages' && unread > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#F59E0B] text-black text-[10px] font-bold flex items-center justify-center">{unread}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#1F1F23] space-y-1">
          <a href="#/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E]">
            <ExternalLink className="w-4 h-4" /> View website
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/5">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>
      {navOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setNavOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-8 bg-[#0B0B0C]/85 backdrop-blur-md border-b border-[#1F1F23]">
          <button className="lg:hidden p-2 -ml-2 text-[#A1A1AA]" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-syne text-lg font-bold flex-1 truncate">{current.label}</h1>
          {dirty && <span className="hidden sm:inline text-xs text-[#F59E0B]">● Unsaved changes</span>}
          <Button variant="ghost" size="sm" disabled={!dirty || saving} onClick={() => setDraft(content)}>
            Discard
          </Button>
          <Button variant="primary" size="sm" disabled={!dirty} loading={saving} onClick={save}>
            Publish
          </Button>
        </header>

        <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-6xl">
          {tab === 'overview' && <OverviewView {...viewProps} messages={messages} go={go} />}
          {tab === 'projects' && <ProjectsView {...viewProps} />}
          {tab === 'profile' && <ProfileView {...viewProps} />}
          {tab === 'services' && <ServicesView {...viewProps} />}
          {tab === 'messages' && <MessagesView messages={messages} setMessages={setMessages} reload={loadMessages} notify={notify} />}
          {tab === 'settings' && <SettingsView {...viewProps} />}
        </main>
      </div>

      <Toasts items={toasts} />
    </div>
  );
}
