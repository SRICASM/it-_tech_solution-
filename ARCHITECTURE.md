# Neuralink Infotech — Website Architecture Documentation

**Version:** 1.0
**Date:** February 18, 2026
**Domain:** nuralinkinfotech.com
**Repository:** github.com/SRICASM/it-_tech_solution-

---

## 1. Executive Summary

Neuralink Infotech is a single-page application (SPA) built as a high-performance marketing and lead-generation website for a UAE-based IT consulting and trading technology company. The site features a WebGL-powered 3D neural network background, glassmorphic UI design, scroll-driven animations, interactive modals, and a serverless consultation form that delivers leads via email.

**Live Domain:** nuralinkinfotech.com
**Hosting:** Vercel (auto-deploys from main branch)
**DNS:** GoDaddy -> Vercel (A record + CNAME)

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | React | 19.2.3 | UI component framework |
| Language | TypeScript | 5.8.2 | Type-safe JavaScript |
| Bundler | Vite | 6.2.0 | Dev server and production builds |
| 3D Engine | Three.js | 0.182.0 | WebGL 3D rendering |
| 3D Bindings | @react-three/fiber | 9.5.0 | React reconciler for Three.js |
| 3D Helpers | @react-three/drei | 10.7.7 | Utility components (Float, MeshDistortMaterial) |
| Animation | Framer Motion | 12.29.0 | Scroll animations, page transitions, modals |
| Animation | GSAP | 3.12.5 | Easing functions (used in DataRibbon) |
| Icons | Lucide React | 0.562.0 | SVG icon library |
| CSS | Tailwind CSS (CDN) | Latest | Utility-first styling via runtime CDN |
| Fonts | Google Fonts | -- | Inter (sans) + JetBrains Mono (mono) |
| Form Backend | Web3Forms | -- | Serverless form-to-email service |
| Hosting | Vercel | -- | Static site hosting with edge CDN |
| DNS | GoDaddy | -- | Domain registrar |

---

## 3. Project Structure

```
neural---enterprise-tech-architecture/
|
|-- index.html              # Entry HTML - Tailwind CDN, fonts, theme config, importmap
|-- index.tsx               # React entry point - createRoot, StrictMode
|-- App.tsx                 # Root component - renders Home
|-- types.ts                # Shared TypeScript interfaces
|-- constants.ts            # All static content data (services, case studies, insights)
|-- vite.config.ts          # Vite configuration - port, plugins, aliases
|-- tsconfig.json           # TypeScript configuration
|-- metadata.json           # Project metadata (unused in runtime)
|-- package.json            # Dependencies and scripts
|-- .env.local              # Environment variable: VITE_WEB3FORMS_KEY (gitignored)
|-- .gitignore              # Ignores node_modules, dist, .env, *.local
|
|-- pages/
|   |-- Home.tsx            # Main page - all sections, scroll logic, modal state
|
|-- components/
|   |-- Navigation.tsx      # Fixed navbar with scroll-reactive styling
|   |-- ThreeScene.tsx      # Full-screen 3D neural network background
|   |-- CaseStudyScene.tsx  # CSS-based visual cards for case studies
|   |-- DataRibbon.tsx      # 3D helical ribbon (currently unused in Home.tsx)
|   |-- ConsultationForm.tsx# Lead capture form with ref-based inputs
|   |-- DetailModal.tsx     # Popup modal for case studies and insights
|
|-- services/
    |-- submission.ts       # Web3Forms API integration for form submissions
```

---

## 4. Architecture Overview

### 4.1 Application Flow

```
index.html
  |-- Loads Tailwind CDN, Google Fonts, configures theme colors
  |-- Defines importmap for ESM module resolution
  |-- Mounts <div id="root">

index.tsx
  |-- ReactDOM.createRoot(#root)
  |-- Renders <App /> inside React.StrictMode

App.tsx
  |-- Renders <Home /> inside <main> wrapper

Home.tsx (Single Page - All Sections)
  |-- <ThreeScene />         - Fixed 3D background (z-0)
  |-- <Navigation />         - Fixed navbar (z-50)
  |-- Hero Section           - Full-screen hero with CTAs
  |-- Solutions Section      - 4-column service cards (#solutions)
  |-- Capabilities Section   - 4-step process grid (#capabilities)
  |-- Case Studies Section   - Alternating layout with CaseStudyScene (#work)
  |-- Insights Section       - 3-column article cards (#insights)
  |-- Contact Section        - <ConsultationForm /> (#contact)
  |-- Footer                 - Brand, links, copyright
  |-- <DetailModal />        - Overlay modal (z-100)
```

### 4.2 Navigation Model

The app uses anchor-based navigation (no router). Each section has an id attribute (#solutions, #capabilities, #work, #insights, #contact). Navigation clicks trigger scrollIntoView({ behavior: 'smooth' }) with an 80px offset for the fixed header.

---

## 5. Component Deep Dive

### 5.1 ThreeScene.tsx - 3D Neural Network Background

**File:** components/ThreeScene.tsx
**Render layer:** Fixed position, z-index: 0, pointer-events: none

This is the most technically complex component. It renders a full-screen WebGL canvas that stays fixed behind all content.

**Sub-components:**

| Component | Purpose |
|-----------|---------|
| CameraController | Responds to scroll and viewport size. Implements a "dead zone" (10% viewport) where camera is locked, then smoothly zooms out over 1 viewport height. Adjusts FOV for mobile responsiveness. |
| AtmosphericBackground | A large plane with a custom fragment shader creating a subtle radial gradient with film grain noise. |
| NeuralNetwork | The main visual - 1200 particles arranged in 6 clusters (cardinal directions) with spatial-rejection anti-clumping. Connected by line segments where distance < 2.0 units. |

**Performance optimizations:**

- Pre-allocated THREE.Vector3 and THREE.Color objects to avoid GC pressure
- Spatial hash grid for O(1) collision detection during particle generation
- Particle pulsing moved to GPU shader (no CPU attribute updates per frame)
- DPR capped at 1.5 (dpr={[1, 1.5]})
- Passive scroll event listeners
- React.memo() wrapping
- Additive blending for glow effects without extra render passes

**Scroll-driven behavior:**

- Camera zooms from z=12 (hero close-up) to z=20 (overview) as user scrolls
- Particle colors transition from cyan to violet based on scroll position (smoothstep mapped between 25%-75% scroll)
- Line opacity increases slightly as color shifts to violet

**Custom shaders:**

- Vertex shader: Scales particles by distance and life attribute
- Fragment shader: Renders circular particles with glow, scroll-based color mixing, and time-based pulsing

### 5.2 Navigation.tsx

**File:** components/Navigation.tsx
**Render layer:** Fixed position, z-index: 50

A scroll-reactive navigation bar using Framer Motion's useTransform:

| Property | At scroll=0 | At scroll=50px |
|----------|-------------|----------------|
| Background | Transparent | rgba(10,10,11,0.9) |
| Backdrop blur | None | 12px |
| Border | Invisible | white/10 |
| Padding | 24px | 16px |
| Box shadow | None | 0 8px 32px rgba(0,0,0,0.5) |

**Features:**

- Desktop: Horizontal nav links with gradient underline animation on hover
- Mobile: Hamburger menu with slideDown animation
- "GET CONSULTATION" CTA button with gradient fill reveal and shine effect
- Brand logo with hover rotation (180deg) and gradient text transition

### 5.3 ConsultationForm.tsx

**File:** components/ConsultationForm.tsx

**Architecture pattern:** Uses useRef instead of useState for input values - zero re-renders during typing. Only re-renders on submit state changes.

**Fields:**

| Field | Required | Ref | Label |
|-------|----------|-----|-------|
| Name | Yes | nameRef | Name |
| Email | Yes | emailRef | Work Email |
| Company | No | companyRef | Company |
| Service | No | roleRef | Service Required |

**States:**

1. Default - Form with terminal-style header, "Online" status indicator
2. Submitting - Button shows spinner, disabled state
3. Success - Shows reference ID, checkmark icon, auto-resets after 5 seconds

**CSS containment:** Uses contain: 'content' and willChange: 'transform' for rendering isolation.

### 5.4 CaseStudyScene.tsx

**File:** components/CaseStudyScene.tsx

A CSS-based visual component (replaced the original 3D WebGL version for performance). Renders differently based on caseStudy.id:

| Feature | Trading (trading-product) | Enterprise (enterprise-it) |
|---------|---------------------------|------------------------------|
| Accent color | Cyan | Violet |
| Center icon | BarChart3 | Server |
| Status label | PRODUCT | CLIENT PROJECT |
| Gradient | from-cyan/10 | from-violet/10 |

Features concentric rings, grid pattern overlay, corner accents, and metrics that slide up on hover.

### 5.5 DetailModal.tsx

**File:** components/DetailModal.tsx

A frosted-glass popup modal using Framer Motion's AnimatePresence for enter/exit transitions.

**Supports two content types:**

**CaseStudyModal:**

- Hero image (Unsplash, desaturated)
- Client badge (PRODUCT vs CLIENT PROJECT)
- Description in glass panel
- Multi-paragraph detail text
- Tech stack tags (color-coded by type)
- Metrics grid (2-column)

**InsightModal:**

- Hero image
- Category badge + date + read time
- Excerpt in italic glass panel
- Multi-paragraph body text

**UX features:**

- Escape key closes modal
- Click-outside-to-close (backdrop click)
- Body scroll locked when open (overflow: hidden)
- Spring animation: scale 0.95 to 1, y 40px to 0

### 5.6 DataRibbon.tsx (Unused)

**File:** components/DataRibbon.tsx

A 3D helical tube that scrolls with the page, changing color from obsidian to cyan to violet. Uses MeshDistortMaterial for organic distortion. Currently not imported or rendered in Home.tsx - it exists as an optional decorative element.

---

## 6. Data Architecture

### 6.1 Type System (types.ts)

```
NavItem        { label, href }
Service        { id, title, description, icon, tags[] }
CaseStudy      { id, client, title, description, detail, techStack[], metrics[], image }
ProcessStep    { id, title, description, icon }
Insight        { id, title, category, date, readTime, excerpt, body, image }
```

### 6.2 Content Store (constants.ts)

All content is statically defined - no CMS, no API calls, no database. This makes the site fully static and CDN-cacheable.

| Constant | Count | Description |
|----------|-------|-------------|
| NAV_ITEMS | 4 | Navigation links |
| SERVICES | 4 | IT Consulting, Custom Software, Cybersecurity, Managed IT |
| PROCESS_STEPS | 4 | Analyze, Architect, Build, Optimize |
| CASE_STUDIES | 2 | Algorithmic Trading Platform, Cloud Infrastructure Migration |
| INSIGHTS | 3 | Cloud Migration, Trading Platform Deep-Dive, Zero-Trust Security |

Images are sourced from Unsplash with sat=-100 for desaturated/B&W aesthetic.

---

## 7. Services and External Integrations

### 7.1 Form Submission (services/submission.ts)

**Service:** Web3Forms (https://web3forms.com)
**Endpoint:** https://api.web3forms.com/submit
**Authentication:** Access key stored in VITE_WEB3FORMS_KEY environment variable

**Flow:**

```
User fills form
  -> ConsultationForm.handleSubmit()
    -> submitConsultation(data)
      -> Generates reference ID: {COMPANY_PREFIX}_{TIMESTAMP_SUFFIX}
      -> POST to Web3Forms API with JSON payload
      -> Web3Forms sends formatted email to admin
      -> Returns { success: boolean, ref: string }
    -> Form shows success state with reference ID
    -> Auto-resets after 5 seconds
```

**Payload structure:**

```json
{
  "access_key": "env-variable",
  "subject": "New Consultation Request - REF_123456",
  "from_name": "Neuralink Infotech Website",
  "name": "...",
  "email": "...",
  "company": "...",
  "service_required": "...",
  "reference_id": "COM_123456"
}
```

**Fallback mode:** When VITE_WEB3FORMS_KEY is empty, the service simulates submission with a 1500ms delay and logs the payload to console. This enables offline development.

---

## 8. Styling Architecture

### 8.1 Tailwind CSS (CDN Runtime)

Tailwind is loaded via CDN (cdn.tailwindcss.com) with inline theme configuration in index.html. This means:

- No build-time CSS purging - all utility classes available
- Configuration is in a script block within index.html
- Custom colors, fonts, keyframes, and animations defined inline

### 8.2 Design System

**Color Palette:**

| Token | Hex | Usage |
|-------|-----|-------|
| obsidian | #0A0A0B | Primary background |
| cyan | #00F0FF | Primary accent, CTAs, active states |
| violet | #7000FF | Secondary accent, insights, footer |
| silver | #E4E4E7 | Body text |
| cyan-glow | #00F0FF80 | Glow effects (50% opacity) |
| violet-glow | #7000FF80 | Glow effects (50% opacity) |

**Typography:**

| Font | Family | Usage |
|------|--------|-------|
| Inter | Sans-serif | Headings, body text |
| JetBrains Mono | Monospace | Labels, technical text, badges |

**Glassmorphism Pattern:**

```css
.glass-panel {
  background: rgba(10, 10, 11, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

Also used inline as: bg-white/5 backdrop-blur-md

**Custom CSS (in index.html):**

- Custom scrollbar (obsidian track, cyan hover thumb)
- .text-glow class for cyan text shadow
- .glass-panel utility class
- overflow-x: hidden on body

### 8.3 Animation System

| Library | Usage |
|---------|-------|
| Framer Motion | Scroll-driven transforms (useScroll, useTransform), page load animations (initial/animate), spring interactions (whileHover, whileTap), modal transitions (AnimatePresence) |
| Tailwind | Hover state transitions (transition-all duration-300), CSS keyframe animations (animate-shine, animate-slideDown, animate-pulse) |
| Three.js | 60fps render loop for 3D scene, lerp/smoothstep damping for camera and colors |

---

## 9. Build and Deployment Pipeline

### 9.1 Build Configuration (vite.config.ts)

```typescript
{
  server: { port: 3000, host: '0.0.0.0' },
  plugins: [react()],
  resolve: { alias: { '@': '.' } }
}
```

**Scripts:**

| Command | Action |
|---------|--------|
| npm run dev | Start Vite dev server (port 3000) |
| npm run build | Production build to dist/ |
| npm run preview | Preview production build locally |

**Build output:** ~1.27 MB JS bundle (358 KB gzipped). Single-chunk output due to no code splitting.

### 9.2 Deployment Architecture

```
Developer pushes to GitHub (main branch)
  -> Vercel detects push via GitHub integration
  -> Vercel runs: npm install -> npm run build
  -> Vercel deploys dist/ to edge CDN
  -> SSL certificate auto-issued by Vercel
  -> Site live at nuralinkinfotech.com
```

**DNS Configuration (GoDaddy):**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**Environment Variables (Vercel Dashboard):**

| Key | Description |
|-----|-------------|
| VITE_WEB3FORMS_KEY | Web3Forms access key for form submissions |

---

## 10. Performance Considerations

### Current Optimizations

1. **3D Scene:** DPR capped at 1.5, particle count reduced to 1200, spatial hash for O(1) lookups, GPU-side animation via shaders, pre-allocated vectors
2. **React:** React.memo() on ThreeScene and ConsultationForm, useCallback for event handlers, useRef for form inputs (zero re-render on typing)
3. **CSS:** contain: content on form, will-change: transform hints, passive scroll listeners
4. **Images:** Unsplash CDN with w=800 sizing, loading="lazy" on modal images

### Known Trade-offs

1. **Tailwind CDN:** Runtime evaluation of all utility classes. In production, a build-time Tailwind setup with purging would reduce CSS payload significantly.
2. **Single JS chunk:** 1.27 MB bundle (358 KB gzipped). Could benefit from code splitting - lazy-loading Three.js and the modal component would reduce initial load.
3. **Import map in HTML:** Legacy from a StackBlitz origin. Vite handles module resolution at build time, so the importmap is redundant in production builds.
4. **No SSR/SSG:** Fully client-rendered SPA. Search engines may not index dynamic content effectively (though Vercel supports SSR with Next.js if needed in future).

---

## 11. Security

| Area | Implementation |
|------|---------------|
| Secrets | VITE_WEB3FORMS_KEY stored in .env.local (gitignored via *.local pattern) and Vercel environment variables |
| Form validation | Client-side HTML5 validation (required, type="email"). No server-side validation (Web3Forms handles sanitization) |
| CORS | Web3Forms API handles CORS headers. The fetch uses standard cors mode |
| XSS | React's JSX auto-escapes all rendered content. No dangerouslySetInnerHTML usage |
| Dependencies | No known vulnerabilities in current dependency versions |

---

## 12. File-by-File Reference

| File | Lines | Purpose |
|------|-------|---------|
| index.html | 104 | HTML shell, Tailwind CDN + config, fonts, importmap, custom CSS |
| index.tsx | 15 | React 19 createRoot entry point |
| App.tsx | 16 | Root component wrapper |
| types.ts | 43 | All TypeScript interfaces |
| constants.ts | 130 | Static content data |
| vite.config.ts | 24 | Vite build configuration |
| tsconfig.json | 29 | TypeScript compiler options |
| pages/Home.tsx | 396 | Main page with all 6 sections + footer |
| components/Navigation.tsx | 148 | Scroll-reactive navbar |
| components/ThreeScene.tsx | 491 | 3D neural network (WebGL) |
| components/CaseStudyScene.tsx | 68 | CSS visual cards for case studies |
| components/ConsultationForm.tsx | 194 | Lead capture form |
| components/DetailModal.tsx | 218 | Popup modal (case studies + insights) |
| components/DataRibbon.tsx | 115 | 3D ribbon (unused) |
| services/submission.ts | 56 | Web3Forms API integration |

---

## 13. Future Recommendations

1. **Code Splitting:** Lazy-load Three.js and DetailModal to reduce initial bundle from 1.27 MB
2. **Tailwind Build:** Switch from CDN to build-time Tailwind with PostCSS purging for smaller CSS
3. **SEO:** Consider migrating to Next.js for server-side rendering and better search engine indexing
4. **Analytics:** Add Google Analytics or Vercel Analytics to track visitor behavior
5. **CMS Integration:** For frequently updated content (insights/blog), consider a headless CMS like Sanity or Contentful
6. **Image Optimization:** Self-host images with next/image or Vercel Image Optimization instead of Unsplash CDN
7. **Accessibility:** Add ARIA labels, keyboard navigation for all interactive elements, and screen reader support
8. **Testing:** Add unit tests (Vitest) and E2E tests (Playwright) for form submission and navigation

---

*Document generated on February 18, 2026*
*Prepared for Neuralink Infotech internal reference*
