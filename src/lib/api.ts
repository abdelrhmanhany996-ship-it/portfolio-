import type { SiteContent } from '../data/portfolioData';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const TOKEN_KEY = 'admin_token';

export const auth = {
  get token() {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch {
      return '';
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
  const res = await fetch(`/api${path}`, { ...init, headers: { ...headers, ...(init.headers as object) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || res.statusText);
  return data as T;
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export const api = {
  getContent: () => request<SiteContent>('/content'),
  saveContent: (content: SiteContent) =>
    request<SiteContent>('/content', { method: 'PUT', body: JSON.stringify(content) }),
  login: (password: string) =>
    request<{ token: string }>('/login', { method: 'POST', body: JSON.stringify({ password }) }),
  verify: () => request<{ ok: true }>('/session'),
  upload: async (file: File) =>
    request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ name: file.name, data: await fileToDataUrl(file) }),
    }),
  sendMessage: (msg: { name: string; email: string; message: string }) =>
    request<{ ok: true }>('/messages', { method: 'POST', body: JSON.stringify(msg) }),
  getMessages: () => request<ContactMessage[]>('/messages'),
  updateMessage: (id: string, patch: Partial<ContactMessage>) =>
    request<ContactMessage>(`/messages/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteMessage: (id: string) => request<{ ok: true }>(`/messages/${id}`, { method: 'DELETE' }),
};
