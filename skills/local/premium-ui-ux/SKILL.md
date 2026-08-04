---
name: premium-ui-ux
description: >-
  Advanced UI/UX architectural intelligence for premium web applications, SaaS admin dashboards, 
  and cross-border e-commerce. Cures "AI-slop" by enforcing design engineer best practices (Vercel/Linear style), 
  data-dense charting UX, and cultural design nuances (USA/EU Minimalism vs Asia Maximalism).
---

# premium-ui-ux: Global Design Intelligence & Dashboard Architecture

This skill is the ultimate UX/UI authority. It activates when designing state-of-the-art web apps, SaaS dashboards, or global cross-border e-commerce platforms. It forces the AI to act as a Staff-Level Design Engineer.

---

## 1. THE "ANTI-AI" AESTHETIC (Premium Foundation)
AI models default to visual cliches. **Ban these completely unless explicitly requested:**
- 🚫 **The "AI Purple" Glow:** Banned. No `bg-purple-500/20` blobs behind centered hero text.
- 🚫 **Flat Glassmorphism:** Banned. True glassmorphism requires a 1px solid inner border (`ring-1 ring-white/10`) and a subtle inner top highlight.
- 🚫 **Centered Everything:** Banned. Break out of symmetry. Use asymmetric layouts, bento boxes, or split screens.
- 🚫 **Generic Em-Dashes (—):** Banned in UI copy. Use colons, bullet points, or layout hierarchy instead.

---

## 2. SAAS & ADMIN DASHBOARD UX (Vercel / Linear / Tremor Philosophy)
Dashboards are briefings, not data dumps. Apply Shneiderman’s mantra: *"Overview first, zoom and filter, then details-on-demand."*

### A. Information Architecture & Layout
- **Clarity Over Density:** A user must understand the "what" in under 5 seconds.
- **One Question Per Card:** Each KPI/Chart card should answer *exactly one* business question. 
- **Navigation:**
  - Desktop: Full Sidebar or Top Header.
  - Tablet: Collapsed Icon Rail.
  - Mobile: Sheet/Drawer (Hamburger menu).
- **Empty States are Onboarding:** A blank dashboard is a failure. Empty states must have an illustration, an explanation, and a primary CTA to create data.

### B. Charting & Data Visualization
- **Color as Meaning, Not Decoration:** The UI shell should be grayscale/monochrome (like Vercel Geist or Linear). Reserve vibrant colors *only* for status (Green=Success, Red=Error/Churn) and chart data points.
- **Chart Selection (Strict Rules):**
  - *Time trend:* Line Chart or Bar Chart.
  - *Part-of-whole:* Stacked Bar. (Pie/Donut charts are strictly limited to max 4 slices, otherwise use bars).
  - *KPI Cards:* Value (largest) + Delta vs previous period + Trend direction (arrow).
- **Honest Analytics:** Bar charts **must** start at zero. Delta colors must reflect the *desired* direction (e.g., latency going up is Red, not Green).
- **Tables on Mobile:** 
  - Few columns: Horizontal scroll with a pinned first column.
  - Transactional: Card/stack transform (rows turn into cards).

---

## 3. CROSS-BORDER & GLOBAL MARKET CONTEXT
You must adjust the UI/UX density and interaction patterns based on the target market. Do not use a universal template.

### A. Western Markets (USA, EU, UK, Australia)
- **Design Philosophy:** Minimalism, generous white space, and "cognitive ease".
- **Interaction:** High autonomy. Users expect linear, streamlined, and uninterrupted paths (e.g., one-click checkout, guest checkout).
- **Visuals:** Clean, single-purpose interfaces. High trust in institutions means fewer visual "proofs" are needed upfront.
- **Privacy:** Extremely strict (GDPR compliance, cookie banners are mandatory design elements).

### B. Asian Markets (Indonesia, China, Japan, SE Asia)
- **Design Philosophy:** Maximalism and High Information Density. A "busy" interface is often perceived as trustworthy, efficient, and offering value.
- **Interaction (The Super App Model):** Users are accustomed to multi-functional interfaces (like WeChat or Gojek). They prefer having all options, promos, and categories available on the main screen without deep navigation.
- **Trust Signals (Crucial):** Higher uncertainty avoidance requires massive social proof. Dashboards and e-commerce must prominently feature live sales counters, community ratings, chat-with-seller buttons, and trust badges.
- **Collectivism vs Individualism:** Integrate social features, group-buying indicators, and community reviews heavily into the layout.

---

## 4. TYPOGRAPHY, COLOR, AND MOTION
- **Fluid Typography:** Use CSS `clamp()` for responsive font sizes (e.g., `text-[clamp(2rem,4vw,3.5rem)]`).
- **Font Pairing:** Use a geometric sans (*Space Grotesk, Plus Jakarta Sans*) for display/headings with tight tracking (`tracking-tight`). Use a highly legible sans (*Inter, DM Sans*) for body text with relaxed leading (`leading-relaxed`).
- **Color Systems (HSL/OKLCH):** Always define colors in HSL/OKLCH for programmatic theming.
  - *Dark Mode:* Off-black `oklch(0.15 0 0)` or deep slate.
  - *Light Mode:* Off-white or pearl `oklch(0.98 0 0)`.
- **Micro-Interactions (The "Feel"):**
  - **Press States:** Buttons must mimic physical presses (`active:scale-[0.97]`).
  - **Entrance Stagger:** Never load a page abruptly. Use staggered spring animations (e.g., headline fades in and slides up, followed by subtext, then CTA).
  - **Focus Rings:** Accessible and intentional `focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2`.
