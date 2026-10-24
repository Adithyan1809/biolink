# ⚡ Adithyan's Full-Stack Biolink & Portfolio Platform

A production-grade, high-performance Full-Stack portfolio platform and Gen-Z bento hub built for **Adithyan** (`@Adithyan1809`). Powered by a high-efficiency **Node.js & Express** backend with live API proxies, secret management, persistent guestbook data store, real-time analytics, and containerized deployment configs.

---

## ✨ Full-Stack Architecture & Features

### 🖥️ Production Backend (Node.js & Express)
* 🛡️ **Secret-Safe Proxy Endpoints**:
  * `GET /api/spotify/profile` & `GET /api/spotify/recent` & `GET /api/spotify/top`: Authenticates with Spotify (`spak_...`) behind server environment variables, preventing client key leakage and caching responses to eliminate rate limits.
  * `GET /api/github/stats`: Live GitHub API proxy fetching public repos, followers, and profile metrics for `@Adithyan1809`.
* 💬 **Persistent Interactive Guestbook**:
  * `POST /api/messages`: Allows visitors to leave persistent notes with sanitization (XSS defense), validation, and IP hashing.
  * `GET /api/messages`: Serves the latest visitor messages stored in [`data/messages.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/data/messages.json).
* 📊 **Real-Time Visitor Analytics**:
  * `POST /api/views` & `GET /api/views`: Tracks page visits and daily counters stored in [`data/analytics.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/data/analytics.json).
* 🩺 **Cloud Health Check**:
  * `GET /api/health`: Provides uptime, system status, and environment telemetry for cloud load balancers.
* 🔒 **Hardened Security Headers**:
  * Configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, and CORS.

### 🎨 Frontend & Design System
* 🏎️ **Red Bull Racing F1 Video Engine**: 1080p Full HD video background in standard H.264 (`avc1`) with faststart `moov` header and ambient/cinematic focus modes.
* 💨 **Smoky Silk Tendril Ribbon Trail**: 26-strand harmonic spring physics cursor engine with silky smoke trails.
* 🎵 **Drift Phonk & Spotify Engine**: Seamless integration between vinyl player, phonk audio, and live Spotify activity via Lanyard API.
* 🍱 **Gen-Z Bento Grid Layout**:
  * Analog + Digital live clock set to Bengaluru, India (`UTC+5:30`).
  * Live GitHub contribution heatmap visualizer (53-week interactive matrix).
  * Interactive flip Polaroid photo gallery.
  * Life & Taste Matrix ("Currently In My Life").
* 💌 **Glassmorphic Floating Guestbook Modal**:
  * Triggered via a sleek floating "Drop a Note" button.
  * Real-time character counter (max 500 characters).
  * Instant toast alerts and live note appending.
* 📱 **PWA & SEO Optimized**:
  * Complete OpenGraph (`og:image`, `og:title`) and Twitter Cards.
  * Progressive Web App [`manifest.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/manifest.json), [`robots.txt`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/robots.txt), and [`sitemap.xml`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/sitemap.xml).

---

## 🚀 Quickstart & Development

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file based on [`.env.example`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/.env.example):
```env
PORT=3000
NODE_ENV=production
SPOTIFY_API_KEY=spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr
SPOTIFY_USER_ID=31zymccmdqzrzvjkdryasaqmkwlq
GITHUB_USERNAME=Adithyan1809
```

### 3. Launch Local Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```
Visit `http://localhost:3000` in your web browser.

### 4. Run Test Suite
```bash
npm test
```
Runs the automated verification suite validating 10 critical frontend, API, security, and persistence checks.

---

## 🚢 Production Deployment

### Option A: Cloudflare Pages (Recommended - Free Global Edge CDN & Serverless)

This project includes native **Cloudflare Pages Functions** ([`functions/api/`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/functions/api/)), edge security headers ([`_headers`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/_headers)), routing fallbacks ([`_redirects`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/_redirects)), and [`wrangler.toml`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/wrangler.toml).

#### Method 1: Instant CLI Deploy with Wrangler
Run the deployment command:
```bash
npx wrangler pages deploy . --project-name=adithyan-biolink
```
* On your first run, Wrangler will open your browser to log in to your free Cloudflare account.
* Within seconds, your site will be live on a global `*.pages.dev` URL with automatic SSL!

#### Method 2: Automatic Git Integration (Cloudflare Dashboard)
1. Push this repository to your GitHub account.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your repository:
   * **Framework preset**: `None`
   * **Build output directory**: `.` (or root `/`)
   * **Build command**: *(leave blank)*
4. Under **Settings** -> **Environment variables**, set:
   * `SPOTIFY_API_KEY`: `spak_wt6wlVzL9xfo7f9i61SetfXogvUfGMtr`
   * `SPOTIFY_USER_ID`: `31zymccmdqzrzvjkdryasaqmkwlq`
   * `GITHUB_USERNAME`: `Adithyan1809`
5. Click **Save and Deploy**. Cloudflare builds edge functions and serves your site globally.

---

### Option B: Docker Container (Any VPS / Fly.io / AWS ECS / GCP Cloud Run)
```bash
# Build the image
docker build -t adithyan-biolink .

# Run container on port 3000
docker run -d -p 3000:3000 --name biolink --env-file .env adithyan-biolink
```

### Option B: Render.com (1-Click Web Service)
1. Push this repository to GitHub.
2. In Render, select **New Web Service** and link your repo.
3. Render automatically detects [`render.yaml`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/render.yaml):
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`

### Option C: Vercel (Serverless Deployment)
The repository includes [`vercel.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/vercel.json) pre-configured to route API requests to [`server.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/server.js):
```bash
npx vercel --prod
```

### Option D: GitHub Actions CI/CD
Automated workflow in [`.github/workflows/deploy.yml`](file:///C:/Users/HP/.gemini/antigravity/scratch/biolink-page/.github/workflows/deploy.yml) runs tests on every push and pull request to the `main` branch.

---

## 📁 Project Structure

```
├── .github/workflows/
│   └── deploy.yml          # Automated CI/CD test and build workflow
├── assets/
│   ├── f1_racing_1080p.mp4 # Red Bull F1 background video
│   └── audio.mp3           # Phonk background audio
├── data/
│   ├── analytics.json      # Persistent page view counters (Node.js)
│   └── messages.json       # Persistent guestbook messages store (Node.js)
├── functions/api/          # Cloudflare Pages Serverless Edge Functions
│   ├── github/stats.js     # Cloudflare edge proxy for GitHub profile stats
│   ├── spotify/            # Cloudflare edge proxies for Spotify profile/recent/top
│   ├── health.js           # Cloudflare edge health check endpoint
│   ├── messages.js         # Cloudflare edge guestbook endpoint (with KV support)
│   └── views.js            # Cloudflare edge analytics view counter
├── test/
│   ├── api.test.js         # Express API unit tests
│   ├── cloudflare_test.js  # Cloudflare Pages Functions verification suite
│   └── e2e_verify.js       # 10-step full-stack verification suite
├── _headers                # Cloudflare Pages edge security & caching headers
├── _redirects              # Cloudflare Pages SPA rewrite and fallback rules
├── .dockerignore           # Docker ignore patterns
├── .env                    # Production secrets & environment variables
├── .env.example            # Public example environment file
├── config.js               # Central biolink configuration file
├── Dockerfile              # Production Node.js multi-stage container
├── index.html              # Semantic HTML5 markup, PWA & SEO headers
├── manifest.json           # Web app manifest for PWA installability
├── package.json            # Node.js project manifest and scripts
├── render.yaml             # Render infrastructure-as-code blueprint
├── robots.txt              # Search engine crawler policies
├── script.js               # Client interactive controller & API integration
├── server.js               # Production Express API server & static host
├── sitemap.xml             # XML sitemap for SEO indexing
├── start_server.bat        # 1-Click Windows server launch script
├── style.css               # Cyberpunk / F1 responsive design styling
├── vercel.json             # Vercel deployment routing configuration
└── wrangler.toml           # Cloudflare Pages & Workers configuration
```

---

## 📄 License
MIT © Adithyan (`@Adithyan1809`)
