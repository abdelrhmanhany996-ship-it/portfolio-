import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ViewProps } from '../AdminApp';
import type { ArtistInfo } from '../../data/portfolioData';
import { Button, Card, ImageInput, TextField } from '../ui';

export const ProfileView: React.FC<ViewProps> = ({ draft, update, notify }) => {
  const p = draft.profile;
  const set = <K extends keyof ArtistInfo>(key: K, value: ArtistInfo[K]) => update((d) => ({ ...d, profile: { ...d.profile, [key]: value } }));
  const setSocial = (i: number, patch: Partial<ArtistInfo['socials'][number]>) =>
    set('socials', p.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <Card title="Portrait" description="Shown on the About page.">
          <ImageInput value={p.portrait} onChange={(v) => set('portrait', v)} aspect="aspect-[3/4]" onError={(m) => notify(m, 'error')} />
        </Card>
        <Card title="Experience">
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Total years" value={p.experienceYears} onChange={(v) => set('experienceYears', v)} placeholder="10+" />
            <TextField label="Gulf years" value={p.gulfExperienceYears} onChange={(v) => set('gulfExperienceYears', v)} placeholder="5+" />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Full name" value={p.name} onChange={(v) => set('name', v)} />
            <TextField label="Title / role" value={p.title} onChange={(v) => set('title', v)} />
            <TextField label="Brand name" value={p.brand} onChange={(v) => set('brand', v)} hint='Use a dot to accent it, e.g. "labib.studio"' />
            <TextField label="Location" value={p.location} onChange={(v) => set('location', v)} />
            <TextField className="sm:col-span-2" label="Headline" value={p.headline} onChange={(v) => set('headline', v)} multiline={2} />
            <TextField className="sm:col-span-2" label="Biography" value={p.bio} onChange={(v) => set('bio', v)} multiline={5} />
          </div>
        </Card>

        <Card title="Contact details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Email" type="email" value={p.email} onChange={(v) => set('email', v)} />
            <TextField label="Phone" value={p.phone} onChange={(v) => set('phone', v)} />
            <TextField className="sm:col-span-2" label="Working hours" value={p.workingHours} onChange={(v) => set('workingHours', v)} />
          </div>
        </Card>

        <Card
          title="Social links"
          actions={
            <Button size="sm" onClick={() => set('socials', [...p.socials, { label: 'NEW', url: 'https://' }])}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          }
        >
          <div className="space-y-3">
            {p.socials.length === 0 && <p className="text-xs text-[#71717A]">No social links.</p>}
            {p.socials.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
                <TextField label="Label" value={s.label} onChange={(v) => setSocial(i, { label: v })} />
                <TextField label="URL" value={s.url} onChange={(v) => setSocial(i, { url: v })} />
                <Button variant="ghost" aria-label="Remove link" onClick={() => set('socials', p.socials.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
