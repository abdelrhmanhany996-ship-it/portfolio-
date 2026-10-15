import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImagePlus, Link2, Loader2, X, Upload } from 'lucide-react';
import { api } from '../lib/api';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export const inputCls =
  'w-full bg-[#0B0B0C] border border-[#26262A] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition';

export const Card: React.FC<{ title?: string; description?: string; actions?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  title,
  description,
  actions,
  className,
  children,
}) => (
  <section className={cx('bg-[#121214] border border-[#232326] rounded-2xl', className)}>
    {(title || actions) && (
      <header className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5">
        <div>
          {title && <h3 className="font-syne text-base font-bold text-white">{title}</h3>}
          {description && <p className="text-xs text-[#8A8A93] mt-1">{description}</p>}
        </div>
        {actions}
      </header>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

export const Field: React.FC<{ label: string; hint?: string; children: (id: string) => React.ReactNode; className?: string }> = ({
  label,
  hint,
  children,
  className,
}) => {
  const id = useId();
  return (
    <div className={cx('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-xs font-semibold text-[#C4C4CC]">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-[11px] text-[#71717A]">{hint}</p>}
    </div>
  );
};

export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
  multiline?: number;
  className?: string;
}> = ({ label, value, onChange, hint, placeholder, type = 'text', multiline, className }) => (
  <Field label={label} hint={hint} className={className}>
    {(id) =>
      multiline ? (
        <textarea
          id={id}
          rows={multiline}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cx(inputCls, 'resize-y leading-relaxed')}
        />
      ) : (
        <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )
    }
  </Field>
);

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }> = ({
  checked,
  onChange,
  label,
  description,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between gap-4 text-left group"
  >
    <span>
      <span className="block text-sm font-semibold text-white">{label}</span>
      {description && <span className="block text-xs text-[#8A8A93] mt-0.5">{description}</span>}
    </span>
    <span className={cx('relative shrink-0 w-11 h-6 rounded-full transition-colors', checked ? 'bg-[#F59E0B]' : 'bg-[#2E2E33]')}>
      <span className={cx('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
    </span>
  </button>
);

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md'; loading?: boolean }> = ({
  variant = 'secondary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...rest
}) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={cx(
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
      size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5',
      variant === 'primary' && 'bg-[#F59E0B] text-black hover:bg-[#FBBF24] shadow-lg shadow-[#F59E0B]/15',
      variant === 'secondary' && 'bg-[#1C1C20] text-white border border-[#2E2E33] hover:border-[#F59E0B]/60',
      variant === 'ghost' && 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C20]',
      variant === 'danger' && 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
      className,
    )}
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {children}
  </button>
);

export const Badge: React.FC<{ tone?: 'amber' | 'neutral' | 'green'; children: React.ReactNode }> = ({ tone = 'neutral', children }) => (
  <span
    className={cx(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider',
      tone === 'amber' && 'bg-[#F59E0B]/15 text-[#F59E0B]',
      tone === 'green' && 'bg-emerald-500/15 text-emerald-400',
      tone === 'neutral' && 'bg-[#232326] text-[#A1A1AA]',
    )}
  >
    {children}
  </span>
);

/** Upload a file or paste a URL; shows a preview. */
export const ImageInput: React.FC<{
  label?: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
  onError?: (msg: string) => void;
  compact?: boolean;
}> = ({ label, value, onChange, aspect = 'aspect-video', onError, compact }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange((await api.upload(file)).url);
    } catch (e) {
      onError?.((e as Error).message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <span className="block text-xs font-semibold text-[#C4C4CC]">{label}</span>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files[0]);
        }}
        className={cx(
          'relative overflow-hidden rounded-xl border border-dashed bg-[#0B0B0C] group',
          aspect,
          dragOver ? 'border-[#F59E0B] bg-[#F59E0B]/5' : 'border-[#2E2E33]',
        )}
      >
        {value ? (
          <img src={value} alt="" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#71717A]">
            <ImagePlus className="w-6 h-6" />
            {!compact && <span className="text-xs">Drop an image or click upload</span>}
          </div>
        )}
        <div
          className={cx(
            'absolute inset-0 flex items-center justify-center gap-2 bg-black/60 transition-opacity',
            busy ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100',
          )}
        >
          {busy ? (
            <Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" />
          ) : (
            <>
              <Button type="button" size="sm" variant="primary" onClick={() => fileRef.current?.click()}>
                <Upload className="w-3.5 h-3.5" /> {compact ? '' : 'Upload'}
              </Button>
              <Button type="button" size="sm" onClick={() => setShowUrl((s) => !s)} aria-label="Use image URL">
                <Link2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {showUrl && (
        <input
          autoFocus
          placeholder="https://…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cx(inputCls, 'text-xs')}
        />
      )}
    </div>
  );
};

export const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }> = ({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cx(
              'relative w-full max-h-[92vh] flex flex-col bg-[#121214] border border-[#232326] rounded-t-2xl sm:rounded-2xl shadow-2xl',
              wide ? 'sm:max-w-4xl' : 'sm:max-w-lg',
            )}
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#232326]">
              <h2 className="font-syne text-lg font-bold text-white">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1C1C20]">
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
            {footer && <footer className="flex justify-end gap-2 px-6 py-4 border-t border-[#232326]">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export interface ToastMsg {
  id: number;
  text: string;
  tone: 'success' | 'error';
}

export const Toasts: React.FC<{ items: ToastMsg[] }> = ({ items }) => (
  <div aria-live="polite" className="fixed bottom-5 right-5 left-5 sm:left-auto z-[200] flex flex-col gap-2 items-end">
    <AnimatePresence>
      {items.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={cx(
            'px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-md',
            t.tone === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border-red-500/30 text-red-300',
          )}
        >
          {t.text}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; text?: string; action?: React.ReactNode }> = ({ icon, title, text, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
    <div className="w-12 h-12 rounded-2xl bg-[#1C1C20] border border-[#2E2E33] flex items-center justify-center text-[#F59E0B]">{icon}</div>
    <h4 className="font-syne font-bold text-white">{title}</h4>
    {text && <p className="text-xs text-[#8A8A93] max-w-sm">{text}</p>}
    {action}
  </div>
);
