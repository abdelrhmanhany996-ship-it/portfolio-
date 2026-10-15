import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_CONTENT, SiteContent } from '../data/portfolioData';
import { api } from '../lib/api';

interface ContentState {
  content: SiteContent;
  loading: boolean;
  /** Replace content locally (after a successful save). */
  setContent: (c: SiteContent) => void;
  reload: () => Promise<void>;
}

const ContentContext = createContext<ContentState>({
  content: DEFAULT_CONTENT,
  loading: false,
  setContent: () => {},
  reload: async () => {},
});

/** Merge stored content over defaults so newly added fields always exist. */
export const normalizeContent = (c: Partial<SiteContent>): SiteContent => ({
  ...DEFAULT_CONTENT,
  ...c,
  profile: { ...DEFAULT_CONTENT.profile, ...c.profile },
  settings: { ...DEFAULT_CONTENT.settings, ...c.settings },
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setContent(normalizeContent(await api.getContent()));
    } catch {
      // API unavailable (static hosting) — keep bundled defaults.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <ContentContext.Provider value={{ content, loading, setContent, reload }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
