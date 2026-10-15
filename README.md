# Labib Studio — Portfolio + CMS Dashboard

React 19 + Vite + Tailwind 4 front end, served by a small Express API that stores editable content on disk.

## Setup

```bash
npm install
cp .env.example .env   # set ADMIN_PASSWORD
npm run dev            # http://localhost:3000  (dashboard: /#/admin)
```

Production:

```bash
npm run build
npm start              # serves dist/ + API on $PORT
```

> Requires a Node host (VPS, Render, Railway, Hostinger Node.js…). On pure static hosting the site shows the bundled default content, and the dashboard and contact form won't work.

## Environment

| Var | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Dashboard password. Required in production (dev falls back to `admin`). |
| `SESSION_SECRET` | Optional token-signing secret (defaults to the password). |
| `DATA_DIR` | Where content is stored (default `./data`). Must be persistent storage. |
| `PORT` | Server port (default 3000). |

## Dashboard (`/#/admin`)

- **Overview**: stats, category breakdown, latest messages.
- **Projects & Gallery**: add/edit/delete, cover + gallery upload (drag & drop or URL), reorder, feature on home slider.
- **Profile**: name, title, brand, bio, portrait, contact info, socials, experience.
- **Services**: cards, images, features, linked category.
- **Messages**: inbox for the contact form.
- **Site Settings**: custom cursor on/off, hero autoplay, categories, JSON backup/restore.

Edits stay drafts until you click **Publish**.

## API

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/content` | – |
| PUT | `/api/content` | ✓ |
| POST | `/api/login` `{password}` → `{token}` | – |
| POST | `/api/upload` `{name, data: dataURL}` → `{url}` | ✓ |
| POST | `/api/messages` `{name,email,message}` | – (rate-limited) |
| GET / PATCH / DELETE | `/api/messages[/:id]` | ✓ |

## Storage (`DATA_DIR`)

```
content.json    # profile, projects, services, categories, settings
messages.json   # contact form submissions
uploads/        # uploaded images, served at /uploads/*
```

Defaults live in `src/data/portfolioData.ts` and are used until the first publish.
