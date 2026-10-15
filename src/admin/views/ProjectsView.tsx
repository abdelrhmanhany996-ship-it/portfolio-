import React, { useMemo, useState } from 'react';
import { Plus, Search, Star, Pencil, Trash2, ChevronUp, ChevronDown, Images, ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { ViewProps } from '../AdminApp';
import type { Project } from '../../data/portfolioData';
import { Badge, Button, Card, EmptyState, Field, ImageInput, Modal, TextField, Toggle, cx, inputCls } from '../ui';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';

const blankProject = (category: string): Project => ({
  id: '',
  title: '',
  subtitle: '',
  category,
  client: '',
  year: String(new Date().getFullYear()),
  coverImage: '',
  galleryImages: [],
  description: '',
  credits: { artDirection: '', artist: '', retouching: '', agency: '' },
  featured: false,
  behanceUrl: '',
});

export const ProjectsView: React.FC<ViewProps> = ({ draft, update, notify }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('ALL');
  const [editing, setEditing] = useState<{ project: Project; isNew: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return draft.projects.filter(
      (p) => (cat === 'ALL' || p.category === cat) && (!q || `${p.title} ${p.client} ${p.subtitle}`.toLowerCase().includes(q)),
    );
  }, [draft.projects, query, cat]);

  const setProjects = (fn: (ps: Project[]) => Project[]) => update((d) => ({ ...d, projects: fn(d.projects) }));

  const move = (id: string, dir: -1 | 1) =>
    setProjects((ps) => {
      const i = ps.findIndex((p) => p.id === id);
      const j = i + dir;
      if (j < 0 || j >= ps.length) return ps;
      const next = [...ps];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const saveProject = (input: Project, isNew: boolean) => {
    const p = { ...input, galleryImages: input.galleryImages.filter(Boolean) };
    if (!p.title.trim()) return notify('Title is required', 'error');
    if (!p.coverImage) return notify('Cover image is required', 'error');
    if (isNew) {
      const base = slugify(p.title);
      let id = base;
      for (let n = 2; draft.projects.some((x) => x.id === id); n++) id = `${base}-${n}`;
      setProjects((ps) => [{ ...p, id }, ...ps]);
    } else {
      setProjects((ps) => ps.map((x) => (x.id === p.id ? p : x)));
    }
    setEditing(null);
    notify(isNew ? 'Project added — publish to go live' : 'Project updated — publish to go live');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" aria-label="Search projects" className={cx(inputCls, 'pl-9')} />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category" className={cx(inputCls, 'sm:w-52')}>
          <option value="ALL">All categories</option>
          {draft.categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Button variant="primary" onClick={() => setEditing({ project: blankProject(draft.categories[0] || ''), isNew: true })}>
          <Plus className="w-4 h-4" /> New project
        </Button>
      </div>

      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Images className="w-5 h-5" />}
            title={draft.projects.length ? 'No matching projects' : 'No projects yet'}
            text={draft.projects.length ? 'Try a different search or category.' : 'Add your first project to start building your gallery.'}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => {
            const idx = draft.projects.indexOf(p);
            return (
              <article key={p.id} className="group rounded-2xl overflow-hidden bg-[#121214] border border-[#232326] hover:border-[#3A3A40] transition-colors flex flex-col">
                <div className="relative aspect-[16/10] bg-[#0B0B0C]">
                  {p.coverImage && <img src={p.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <Badge tone="amber">{p.category}</Badge>
                  </div>
                  <button
                    onClick={() => setProjects((ps) => ps.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)))}
                    aria-label={p.featured ? 'Remove from home slider' : 'Feature on home slider'}
                    title={p.featured ? 'Featured on home' : 'Feature on home'}
                    className={cx(
                      'absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors',
                      p.featured ? 'bg-[#F59E0B] text-black' : 'bg-black/50 text-white/70 hover:text-white',
                    )}
                  >
                    <Star className={cx('w-3.5 h-3.5', p.featured && 'fill-current')} />
                  </button>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-semibold">
                    {p.galleryImages.length} img
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="min-w-0">
                    <h3 className="font-syne font-bold truncate">{p.title}</h3>
                    <p className="text-xs text-[#8A8A93] truncate">
                      {p.client || '—'} · {p.year}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1">
                    <Button size="sm" onClick={() => setEditing({ project: structuredClone(p), isNew: false })}>
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Move up" disabled={idx === 0} onClick={() => move(p.id, -1)}>
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Move down" disabled={idx === draft.projects.length - 1} onClick={() => move(p.id, 1)}>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Delete project" className="ml-auto hover:!text-red-400" onClick={() => setConfirmDelete(p)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {editing && (
        <ProjectEditor
          key={editing.project.id || 'new'}
          initial={editing.project}
          isNew={editing.isNew}
          categories={draft.categories}
          onClose={() => setEditing(null)}
          onSave={saveProject}
          notify={notify}
        />
      )}

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete project?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setProjects((ps) => ps.filter((x) => x.id !== confirmDelete!.id));
                setConfirmDelete(null);
                notify('Project removed — publish to apply');
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#A1A1AA]">
          “{confirmDelete?.title}” will be removed from the website after you publish.
        </p>
      </Modal>
    </div>
  );
};

const ProjectEditor: React.FC<{
  initial: Project;
  isNew: boolean;
  categories: string[];
  onClose: () => void;
  onSave: (p: Project, isNew: boolean) => void;
  notify: ViewProps['notify'];
}> = ({ initial, isNew, categories, onClose, onSave, notify }) => {
  const [p, setP] = useState<Project>(initial);
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((x) => ({ ...x, [k]: v }));
  const setCredit = (k: keyof Project['credits'], v: string) => setP((x) => ({ ...x, credits: { ...x.credits, [k]: v } }));
  const setGallery = (fn: (g: string[]) => string[]) => setP((x) => ({ ...x, galleryImages: fn(x.galleryImages) }));
  const onError = (m: string) => notify(m, 'error');

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title={isNew ? 'New project' : `Edit · ${initial.title}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(p, isNew)}>
            {isNew ? 'Add project' : 'Apply changes'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-5">
          <ImageInput label="Cover image *" value={p.coverImage} onChange={(v) => set('coverImage', v)} aspect="aspect-[4/3]" onError={onError} />
          <Toggle checked={p.featured} onChange={(v) => set('featured', v)} label="Feature on home" description="Show in the hero slider" />
        </div>
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <TextField className="sm:col-span-2" label="Title *" value={p.title} onChange={(v) => set('title', v)} />
          <TextField className="sm:col-span-2" label="Subtitle" value={p.subtitle} onChange={(v) => set('subtitle', v)} />
          <Field label="Category">
            {(id) => (
              <select id={id} value={p.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                {!categories.includes(p.category) && <option value={p.category}>{p.category || '—'}</option>}
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}
          </Field>
          <TextField label="Year" value={p.year} onChange={(v) => set('year', v)} />
          <TextField label="Client" value={p.client} onChange={(v) => set('client', v)} />
          <TextField label="Behance / external link" value={p.behanceUrl || ''} onChange={(v) => set('behanceUrl', v)} placeholder="https://" />
          <TextField className="sm:col-span-2" label="Description" value={p.description} onChange={(v) => set('description', v)} multiline={4} />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#232326]">
        <h4 className="font-syne font-bold mb-4">Credits</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Art direction" value={p.credits.artDirection} onChange={(v) => setCredit('artDirection', v)} />
          <TextField label="Artist" value={p.credits.artist} onChange={(v) => setCredit('artist', v)} />
          <TextField label="Retouching" value={p.credits.retouching || ''} onChange={(v) => setCredit('retouching', v)} />
          <TextField label="Agency" value={p.credits.agency || ''} onChange={(v) => setCredit('agency', v)} />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#232326]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-syne font-bold">
            Gallery <span className="text-[#71717A] font-normal text-sm">({p.galleryImages.length})</span>
          </h4>
          <div className="flex gap-2">
            {p.coverImage && !p.galleryImages.includes(p.coverImage) && (
              <Button size="sm" variant="ghost" onClick={() => setGallery((g) => [p.coverImage, ...g])}>
                Use cover
              </Button>
            )}
            <Button size="sm" onClick={() => setGallery((g) => [...g, ''])}>
              <Plus className="w-3.5 h-3.5" /> Add image
            </Button>
          </div>
        </div>
        {p.galleryImages.length === 0 ? (
          <p className="text-xs text-[#71717A]">No gallery images. The lightbox will show the cover image only.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {p.galleryImages.map((img, i) => (
              <div key={i} className="space-y-1.5">
                <ImageInput compact value={img} aspect="aspect-square" onError={onError} onChange={(v) => setGallery((g) => g.map((x, j) => (j === i ? v : x)))} />
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <Button size="sm" variant="ghost" aria-label="Move left" disabled={i === 0} onClick={() => setGallery((g) => swap(g, i, i - 1))}>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Move right" disabled={i === p.galleryImages.length - 1} onClick={() => setGallery((g) => swap(g, i, i + 1))}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" aria-label="Remove image" className="hover:!text-red-400" onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

const swap = <T,>(arr: T[], i: number, j: number) => {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
