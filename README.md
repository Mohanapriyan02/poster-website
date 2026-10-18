# LUMINA & ARCHIVE — Premium Wall Poster Showcase & Admin CMS

A complete, professional web application designed for a luxury wall poster and art print brand. It provides two distinct interfaces within one modular codebase:

1. **Public Showcase Website** (`http://localhost:5173`): An elegant, museum-grade art catalogue designed for collector browsing and direct prefilled WhatsApp enquiries.
2. **Admin Dashboard Console** (`http://localhost:5173/admin`): A clean, minimal content management console that writes directly to local JSON files on disk (`src/data/`), manages image uploads, controls discounts and sale pricing, edits drafts, and takes automated snapshot backups.

---

## ⚡ Quick Start: Running Locally

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **npm** (v10+)

### 2. Start Both the Backend and Frontend with One Command
```bash
npm run dev
```

This single command launches both services concurrently:
- **Local Express Backend**: strictly bound to `http://127.0.0.1:5001`
- **Vite React Frontend**: `http://localhost:5173` (with `/api` and `/images/posters` automatically proxied to the local backend)

You can also run them in separate terminals if preferred:
```bash
# Terminal 1: Backend only
npm run server

# Terminal 2: Frontend only
npm run client
```

---

## 🧭 Navigation & URLs

| Interface | URL | Description |
| :--- | :--- | :--- |
| **Public Showcase** | `http://localhost:5173/` | Editorial customer catalogue with interactive framing & WhatsApp enquiry routing |
| **Admin Dashboard** | `http://localhost:5173/admin` | Catalogue management overview, statistics, and quick actions |
| **All Posters** | `http://localhost:5173/admin/posters` | Searchable, filterable catalogue table with inline status toggling |
| **Add New Poster** | `http://localhost:5173/admin/posters/new` | Full creation form with image uploader and discount calculator |
| **Drafts Workspace** | `http://localhost:5173/admin/drafts` | Inspect and publish draft posters (hidden from public visitors) |
| **Categories** | `http://localhost:5173/admin/categories` | Manage genres with assigned poster count and safe deletion guards |
| **Collections** | `http://localhost:5173/admin/collections` | Manage thematic series and series posters |
| **Settings & Backups**| `http://localhost:5173/admin/settings` | Edit `site.json` metadata, WhatsApp number, and restore snapshots |
| **Artwork Preview** | `http://localhost:5173/admin/preview/:slug` | Preview any poster (including drafts) with an admin banner |

---

## 🛠️ Architecture & Features

### 1. Separation of Concerns
- **Public Showcase**: Warm ivory (`#FAF8F5`), editorial typography (`Cormorant Garamond`), generous whitespace, lifestyle mockups, framing selector, and zero cart/checkout friction.
- **Admin Console**: Professional, clean SaaS aesthetic (`#F4F6F8`, slate typography, crisp tables, restrained accents). Public visitors never see CMS controls or draft items.

### 2. Local-Only Express Backend (`127.0.0.1:5001`)
- Bound strictly to `127.0.0.1` (never exposed publicly).
- Performs **atomic file writes** (`.tmp-` file swap) to prevent corruption.
- Automatically saves a **snapshot backup** in `backups/` before any write operation.
- Validates IDs, URL slugs, and pricing constraints (prevents sale price > regular price).
- Handles local multipart image uploads to `public/images/posters/` via Multer.
- Cleans up unused local images when a poster is deleted.
- Enforces category deletion safety: prevents deleting a category if posters are assigned to it.

### 3. Dynamic Public Reactivity with Bundled Fallback
- The public showcase and admin share a React Context (`CatalogContext`).
- On page load, the frontend fetches fresh data from `/api/*`. If the backend is ever stopped, the app seamlessly falls back to bundled JSON files (`products.json`, `categories.json`, `collections.json`, `site.json`).
- Changes made in the Admin Dashboard reflect immediately in the public showcase without restarting the dev server or rebuilding.

### 4. Promotional Discounts & Sale Pricing
- Posters support optional promotional discounts (`type: "percentage"` or `type: "fixed"`).
- Automatically calculates sale prices, savings amount, and percentage off.
- The public cards and detail page display elegant discount badges, strike-through regular prices, and calculate exact savings in prefilled WhatsApp messages.

### 5. Production Build Separation
- **`npm run build`**: Standard build with the Admin Dashboard code-split into its own lazy chunk (`AdminApp-*.js`).
- **`npm run build:public`**: Production build where the admin route, admin dashboard code, and backend services are **100% eliminated** via compiler dead-code elimination (`VITE_ENABLE_ADMIN=false`). Verified: no admin chunks exist in the public output!

---

## 📁 Key File Structure

```text
├── backups/                     # Automatic and manual JSON catalogue snapshot backups
├── public/
│   └── images/posters/          # Uploaded local poster images (managed by Multer)
├── server/
│   └── index.js                 # Local Express backend (127.0.0.1:5001)
├── src/
│   ├── components/
│   │   ├── admin/               # Admin layout, sidebar, topbar, and upload fields
│   │   ├── common/              # PosterCard, SearchModal, Breadcrumbs, FloatingWhatsApp
│   │   ├── home/                # Hero, BestsellerSection, CuratedGrid, BrandStory
│   │   └── layout/              # AnnouncementBar, Navbar, Footer
│   ├── config/
│   │   └── site.ts              # Global site configuration interface
│   ├── context/
│   │   └── CatalogContext.tsx   # Reactive state provider connecting API & fallback JSON
│   ├── data/
│   │   ├── products.json        # 26 pristine poster catalog records
│   │   ├── categories.json      # 10 curated categories
│   │   ├── collections.json     # 6 thematic series collections
│   │   └── site.json            # Editable website settings (WhatsApp, brand, etc.)
│   ├── pages/
│   │   ├── admin/               # AdminDashboard, PostersList, Form, Drafts, Settings, etc.
│   │   ├── HomePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── CollectionPage.tsx
│   │   ├── PosterDetailPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   ├── services/
│   │   └── api.ts               # Frontend API client with CRUD, uploads, and backups
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── utils/
│   │   └── whatsapp.ts          # wa.me link builders with discounts and live settings
│   ├── App.tsx                  # Main router with public layout and lazy-loaded AdminApp
│   └── main.tsx
├── package.json
└── vite.config.ts               # Vite proxy rules & mode-dependent admin exclusion
```

---

## 🔒 Safety & Deployment Notice
- **Local Testing Only**: This application is currently configured for local testing on your computer.
- **GitHub Publishing is Disabled**: Do not push or deploy until you have completed your local testing and verification.
- **Restoring Catalogue**: If you ever want to revert your catalogue data to a previous state, navigate to `http://localhost:5173/admin/settings` and click **Restore** next to any snapshot in the backups list.
