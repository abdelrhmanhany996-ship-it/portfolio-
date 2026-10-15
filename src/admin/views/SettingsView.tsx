import React, { useState } from 'react';
import { Plus, X, Download, Upload } from 'lucide-react';
import type { ViewProps } from '../AdminApp';
import { normalizeContent } from '../../context/ContentContext';
import { DEFAULT_CONTENT, SiteSettings } from '../../data/portfolioData';
import { Button, Card, Field, Toggle, inputCls } from '../ui';

export const SettingsView: React.FC<ViewProps> = ({ draft, update, notify }) => {
  const [newCat, setNewCat] = useState('');
  const setSetting = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => update((d) => ({ ...d, settings: { ...d.settings, [k]: v } }));

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const c = newCat.trim().toUpperCase();
    if (!c) return;
    if (draft.categories.includes(c)) return notify('Category already exists', 'error');
    update((d) => ({ ...d, categories: [...d.categories, c] }));
    setNewCat('');
  };

  const removeCategory = (c: string) => {
    const used = draft.projects.filter((p) => p.category === c).length;
    if (used) return notify(`${used} project(s) still use “${c}”. Reassign them first.`, 'error');
    update((d) => ({ ...d, categories: d.categories.filter((x) => x !== c) }));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file?: File) => {
    if (!file) return;
    try {
      const data = normalizeContent(JSON.parse(await file.text()));
      if (!Array.isArray(data.projects)) throw new Error();
      update(() => data);
      notify('Backup loaded — review and publish');
    } catch {
      notify('Invalid backup file', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Experience" description="Interaction settings for visitors.">
        <div className="space-y-6">
          <Toggle
            checked={draft.settings.customCursor}
            onChange={(v) => setSetting('customCursor', v)}
            label="Custom mouse cursor"
            description="Amber dot + trailing ring that reacts to links and images (desktop only)."
          />
          <Field label="Hero slider autoplay" hint="Seconds between slides. 0 disables autoplay.">
            {(id) => (
              <div className="flex items-center gap-4">
                <input
                  id={id}
                  type="range"
                  min={0}
                  max={15}
                  value={draft.settings.heroAutoplaySeconds}
                  onChange={(e) => setSetting('heroAutoplaySeconds', Number(e.target.value))}
                  className="flex-1 accent-[#F59E0B]"
                />
                <span className="font-mono text-sm w-10 text-right">{draft.settings.heroAutoplaySeconds || 'Off'}</span>
              </div>
            )}
          </Field>
        </div>
      </Card>

      <Card title="Portfolio categories" description="Used for gallery filters and the menu.">
        <div className="flex flex-wrap gap-2 mb-4">
          {draft.categories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg bg-[#1C1C20] border border-[#2E2E33] text-xs font-semibold">
              {c}
              <button onClick={() => removeCategory(c)} aria-label={`Remove ${c}`} className="p-0.5 rounded text-[#71717A] hover:text-red-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={addCategory} className="flex gap-2">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" aria-label="New category" className={inputCls} />
          <Button type="submit">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </form>
      </Card>

      <Card title="Backup & restore" description="Download all content as JSON or restore from a backup." className="lg:col-span-2">
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportJson}>
            <Download className="w-4 h-4" /> Export backup
          </Button>
          <label className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-[#1C1C20] border border-[#2E2E33] hover:border-[#F59E0B]/60 cursor-pointer">
            <Upload className="w-4 h-4" /> Import backup
            <input type="file" accept="application/json" className="hidden" onChange={(e) => importJson(e.target.files?.[0])} />
          </label>
          <Button
            variant="danger"
            className="sm:ml-auto"
            onClick={() => {
              if (confirm('Reset all content to the original defaults? You can still discard before publishing.')) {
                update(() => structuredClone(DEFAULT_CONTENT));
              }
            }}
          >
            Reset to defaults
          </Button>
        </div>
      </Card>
    </div>
  );
};
