import React, { useState } from 'react';
import { Inbox, Mail, Trash2, RefreshCw, MailOpen } from 'lucide-react';
import { api, ContactMessage } from '../../lib/api';
import type { ViewProps } from '../AdminApp';
import { Badge, Button, Card, EmptyState, cx } from '../ui';

export const MessagesView: React.FC<{
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  reload: () => void;
  notify: ViewProps['notify'];
}> = ({ messages, setMessages, reload, notify }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = messages.find((m) => m.id === activeId) || null;

  const setRead = async (m: ContactMessage, read: boolean) => {
    setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, read } : x)));
    api.updateMessage(m.id, { read }).catch(() => notify('Could not update message', 'error'));
  };

  const open = (m: ContactMessage) => {
    setActiveId(m.id);
    if (!m.read) setRead(m, true);
  };

  const remove = async (m: ContactMessage) => {
    try {
      await api.deleteMessage(m.id);
      setMessages((ms) => ms.filter((x) => x.id !== m.id));
      setActiveId(null);
      notify('Message deleted');
    } catch {
      notify('Delete failed', 'error');
    }
  };

  if (messages.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Inbox className="w-5 h-5" />}
          title="Inbox is empty"
          text="When visitors use the contact form on your website, their messages will appear here."
          action={
            <Button size="sm" onClick={reload}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2 overflow-hidden" title={`${messages.length} message${messages.length === 1 ? "" : "s"}`} actions={<Button size="sm" variant="ghost" aria-label="Refresh" onClick={reload}><RefreshCw className="w-4 h-4" /></Button>}>
        <ul className="-mx-5 sm:-mx-6 -my-5 sm:-my-6 divide-y divide-[#1F1F23] max-h-[70vh] overflow-y-auto">
          {messages.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => open(m)}
                className={cx(
                  'w-full text-left px-5 sm:px-6 py-4 flex gap-3 transition-colors',
                  m.id === activeId ? 'bg-[#F59E0B]/5' : 'hover:bg-[#17171A]',
                )}
              >
                <span className={cx('mt-1.5 w-2 h-2 shrink-0 rounded-full', m.read ? 'bg-transparent' : 'bg-[#F59E0B]')} />
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2">
                    <span className={cx('text-sm truncate', m.read ? 'text-[#C4C4CC]' : 'font-bold text-white')}>{m.name}</span>
                    <time className="text-[11px] text-[#71717A] shrink-0">{new Date(m.createdAt).toLocaleDateString()}</time>
                  </span>
                  <span className="block text-xs text-[#8A8A93] truncate">{m.message}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="lg:col-span-3">
        {active ? (
          <article className="space-y-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-syne text-xl font-bold">{active.name}</h3>
                <a href={`mailto:${active.email}`} className="text-sm text-[#F59E0B] hover:underline">
                  {active.email}
                </a>
                <p className="text-xs text-[#71717A] mt-1">{new Date(active.createdAt).toLocaleString()}</p>
              </div>
              {!active.read ? <Badge tone="amber">Unread</Badge> : <Badge>Read</Badge>}
            </header>
            <p className="text-sm text-[#D4D4D8] leading-relaxed whitespace-pre-wrap border-t border-[#1F1F23] pt-5">{active.message}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={`mailto:${active.email}?subject=${encodeURIComponent('Re: your message')}`}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-[#F59E0B] text-black hover:bg-[#FBBF24]"
              >
                <Mail className="w-4 h-4" /> Reply
              </a>
              <Button onClick={() => setRead(active, !active.read)}>
                <MailOpen className="w-4 h-4" /> Mark as {active.read ? 'unread' : 'read'}
              </Button>
              <Button variant="danger" onClick={() => remove(active)}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </article>
        ) : (
          <EmptyState icon={<Mail className="w-5 h-5" />} title="Select a message" text="Choose a message from the list to read it." />
        )}
      </Card>
    </div>
  );
};
