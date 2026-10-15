import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import type { ViewProps } from '../AdminApp';
import type { Service } from '../../data/portfolioData';
import { Button, Card, Field, ImageInput, TextField, inputCls } from '../ui';

export const ServicesView: React.FC<ViewProps> = ({ draft, update, notify }) => {
  const setServices = (fn: (s: Service[]) => Service[]) => update((d) => ({ ...d, services: fn(d.services) }));
  const patch = (i: number, p: Partial<Service>) => setServices((ss) => ss.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const move = (i: number, dir: -1 | 1) =>
    setServices((ss) => {
      const j = i + dir;
      if (j < 0 || j >= ss.length) return ss;
      const next = [...ss];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() =>
            setServices((ss) => [
              ...ss,
              { id: `service-${Date.now().toString(36)}`, title: 'NEW SERVICE', subtitle: '', image: '', features: [], filterCategory: draft.categories[0] || '' },
            ])
          }
        >
          <Plus className="w-4 h-4" /> Add service
        </Button>
      </div>

      {draft.services.map((s, i) => (
        <Card
          key={s.id}
          title={`${String(i + 1).padStart(2, '0')} · ${s.title || 'Untitled'}`}
          actions={
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" aria-label="Move down" disabled={i === draft.services.length - 1} onClick={() => move(i, 1)}>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" aria-label="Delete service" className="hover:!text-red-400" onClick={() => setServices((ss) => ss.filter((_, j) => j !== i))}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageInput label="Background image" value={s.image} onChange={(v) => patch(i, { image: v })} aspect="aspect-[3/4]" onError={(m) => notify(m, 'error')} />
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField label="Title" value={s.title} onChange={(v) => patch(i, { title: v })} />
                <Field label="“View works” links to">
                  {(id) => (
                    <select id={id} value={s.filterCategory} onChange={(e) => patch(i, { filterCategory: e.target.value })} className={inputCls}>
                      {draft.categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </Field>
                <TextField className="sm:col-span-2" label="Subtitle" value={s.subtitle} onChange={(v) => patch(i, { subtitle: v })} />
              </div>
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#C4C4CC]">Features</span>
                {s.features.map((f, fi) => (
                  <div key={fi} className="flex gap-2">
                    <input
                      aria-label={`Feature ${fi + 1}`}
                      value={f}
                      onChange={(e) => patch(i, { features: s.features.map((x, k) => (k === fi ? e.target.value : x)) })}
                      className={inputCls}
                    />
                    <Button variant="ghost" aria-label="Remove feature" onClick={() => patch(i, { features: s.features.filter((_, k) => k !== fi) })}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" onClick={() => patch(i, { features: [...s.features, ''] })}>
                  <Plus className="w-3.5 h-3.5" /> Add feature
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
