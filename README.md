# LUMINA & ARCHIVE — Premium Wall Poster & Art Print Showcase

A visually stunning, editorial-grade wall poster showcase website inspired by boutique contemporary art galleries, minimal editorial magazines, and architectural design studios (such as Postman Posters).

Designed specifically for **poster discovery and direct WhatsApp customer enquiries** without shopping cart or checkout friction. 100% free static deployment compatible with **GitHub Pages**.

---

## 🎨 Visual Identity & Design Principles

- **Warm Editorial Palette**: Off-white & warm ivory (`#FAF8F5`, `#F5F2EB`) with deep charcoal typography (`#171717`), warm stone accents (`#8C7D70`), and museum gold highlights (`#C5A880`).
- **Museum Typography**: Serif headlines (`Cormorant Garamond`) paired with modern clean sans-serif (`Plus Jakarta Sans`).
- **Interactive Perspectives**: Isolated print preview, living room, bedroom, and creative studio wall mockups.
- **Framing Simulator**: Interactive preview between *Unframed Fine Art Print*, *Matte Black Solid Wood*, *Natural Oak*, and *White Gallery Frame*.
- **Zero Checkout Friction**: Direct WhatsApp inquiry generation prefilled with poster name, product ID, selected size, framing preference, and current price.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **npm** (v10+)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally in Development
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified production build in the `dist/` directory.

---

## ⚙️ Configuration Guide

### 1. Change Brand Name & Business WhatsApp Number
All core brand settings are centralized in a single configuration file:
👉 `src/config/site.ts`

```typescript
export const siteConfig = {
  brandName: "LUMINA & ARCHIVE", // Replace with your brand name
  tagline: "Fine Art Prints & Archival Poster Gallery",
  whatsappNumber: "919876543210", // REPLACE WITH YOUR BUSINESS NUMBER (Country code + phone, no '+', spaces, or hyphens)
  currency: "INR",
  currencySymbol: "₹",
  announcement: "Art for your walls. Inspiration for your everyday. Free framing on orders over ₹1,999.",
  defaultEnquiryMessage: "Hi! I'd like to know more about your poster collection.",
  contactEmail: "concierge@lumina-archive.art",
  studioLocation: "Indiranagar, Bengaluru, India",
  // ...
};
```

### 2. WhatsApp Enquiry Format
When visitors click **Enquire on WhatsApp** from a poster card or detail page, a URL is dynamically generated:
`https://wa.me/{whatsappNumber}?text={encoded_message}`

Example generated message:
```text
Hi LUMINA & ARCHIVE! I'm interested in this poster:

🖼️ Poster: Neo Tokyo: Cyberpunk Horizon
🏷️ Product ID: POSTER-001
📁 Category: Anime & Manga
📐 Size: A3 (11.7 × 16.5 in)
🖼️ Finish / Frame: Matte Black Solid Wood Frame
💳 Listed Price: ₹799

Could you please share details on availability, framing options, and estimated delivery?
```

---

## 🖼️ Poster Catalogue Management

The entire product catalogue is decoupled and stored in:
👉 `src/data/products.json`

### Poster Record Schema:
```json
{
  "id": "POSTER-001",
  "slug": "neo-tokyo-cyberpunk-horizon",
  "name": "Neo Tokyo: Cyberpunk Horizon",
  "tagline": "Neon-soaked verticality and rain-slicked asphalt.",
  "description": "A breathtaking artistic homage to cyberpunk anime aesthetics...",
  "category": "Anime & Manga",
  "categorySlug": "anime-manga",
  "collection": "The Anime Edit",
  "collectionSlug": "the-anime-edit",
  "price": {
    "A4": 499,
    "A3": 799,
    "A2": 1299,
    "A1": 1999
  },
  "sizes": ["A4", "A3", "A2", "A1"],
  "image": "https://images.unsplash.com/...",
  "secondaryImage": "https://images.unsplash.com/...",
  "mockupImages": {
    "livingRoom": "https://images.unsplash.com/...",
    "bedroom": "https://images.unsplash.com/...",
    "studio": "https://images.unsplash.com/..."
  },
  "galleryImages": ["https://..."],
  "featured": true,
  "isNew": false,
  "isBestseller": true,
  "orientation": "portrait",
  "tags": ["cyberpunk", "anime", "neon", "tokyo"],
  "available": true,
  "materials": "300 GSM Archival Cotton Rag, 12-colour Giclée pigment print",
  "finish": "Velvety ultra-matte finish with anti-reflective coating",
  "artistNote": "Inspired by the visual poetry of late 80s hand-drawn animation backgrounds."
}
```

### Adding a New Poster:
1. Open `src/data/products.json`.
2. Add a new JSON object with a unique `id` (e.g. `POSTER-027`) and `slug`.
3. Provide your high-resolution artwork URL and lifestyle mockup URL (or store image files in `public/posters/` and reference them as `/posters/my-art.jpg`).
4. Save the file. The website immediately displays the new poster across the homepage, catalogue, and category views!

---

## 🌐 Free GitHub Pages Deployment

The application is pre-configured for automated GitHub Pages continuous deployment.

### Step 1: Create a GitHub Repository
```bash
git init
git add .
git commit -m "feat: initial commit for premium poster showcase website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. Go to your GitHub repository in your browser.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.

### Step 3: Automatic Build & Deployment
- The included workflow file `.github/workflows/deploy.yml` automatically triggers on every push to `main`.
- It builds the application and deploys it to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.
- `vite.config.ts` has `base: './'`, ensuring all assets resolve correctly regardless of subfolder path.
- `HashRouter` is used to guarantee that direct links and page refreshes work seamlessly on GitHub Pages without 404 routing errors.

---

## 🏗️ Future Admin & Publishing Architecture

The catalogue is designed with a pure decoupled data model so that an administrative publishing workflow can be integrated in the future without refactoring presentation components.

### Architectural Constraints:
- **GitHub Pages is a static host**: It does not execute Node.js, Python, or database code on the server.
- **Client-Side Security Rule**: A frontend React application must **never** store a GitHub Personal Access Token (PAT), as any user could extract the token from browser memory or network requests and gain write access to the repository.

### Recommended Future Architecture:
```
+-------------------------------------------------------------+
|                     Admin Dashboard                         |
|   (Protected by authentication, e.g. NextAuth / Supabase)  |
+------------------------------+------------------------------+
                               |
                               v (Authenticated API request)
+-------------------------------------------------------------+
|              Lightweight Serverless Backend                 |
|        (Cloudflare Worker, Vercel Function, or Express)     |
|         Holds GitHub App Private Key / Encrypted PAT        |
+------------------------------+------------------------------+
                               |
                               v (GitHub Octokit API: repos.createOrUpdateFileContents)
+-------------------------------------------------------------+
|                     GitHub Repository                       |
|         Commits updated src/data/products.json to main      |
+------------------------------+------------------------------+
                               |
                               v (Triggers .github/workflows/deploy.yml)
+-------------------------------------------------------------+
|                   GitHub Actions & Pages                    |
|             Automated rebuild & deploy in 60s               |
+-------------------------------------------------------------+
```

1. **Phase 1 (Current)**: Manual catalogue editing via `src/data/products.json`.
2. **Phase 2 (Future Admin)**: An administrative web interface authenticated via OAuth that allows non-technical team members to add posters, adjust prices, and toggle bestsellers. Changes are committed directly to the GitHub repository via secure server-side API, triggering automated site deployment.

---

## 📄 License & Attribution

Designed as an original, bespoke digital art print catalogue. All photography curated from the Unsplash open photography license for demonstrative and non-commercial presentation.
