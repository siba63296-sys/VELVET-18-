# Velvet 18+ AI Content Generation Platform

A modern, responsive, full-stack web application for an age-verified 18+ creative AI generation platform featuring high-fidelity text-to-image synthesis, image-to-image latent conditioning, cinematic motion video, uncensored conversational roleplay, Supabase database & storage, Cashfree payments (INR ₹), and an Admin Control Console.

---

## 🚀 Key Features

### 1. Age Verification Gate (18+ Compliant)
- Mandatory modal barrier on first entry requiring legal declaration under penalty of perjury.
- Strict exit route (`Exit to Google`) for non-verified visitors.
- Consent stored persistently in `localStorage` and client cookies.
- Comprehensive 18 U.S.C. § 2257 Record-Keeping statutory exemption documentation, DMCA notice, and Zero-Tolerance policies.

### 2. High-Resolution Image Studio (Img2Img & Text-to-Image)
- **Reference Image (Optional)**: Drag-and-drop & click-to-upload box located above the Creative Prompt.
- Accepts JPG, PNG, WEBP up to 10MB.
- Interactive thumbnail preview with one-click remove (`X`) button.
- **Reference Strength Slider** (0.0 to 1.0) controlling latent adherence vs. creative freedom.
- Automatic storage into Supabase Storage bucket `user-uploads`.
- Server routes route requests via active provider in `img2img` mode when a reference image is present.
- Aspect ratio selection (1:1, 4:3, 3:4, 16:9, 9:16), negative prompt filter, seed control, CFG scale, and steps.

### 3. Cinematic Motion Video Studio
- Image-to-Video and Text-to-Video synthesis.
- Custom keyframe upload box with direct Supabase Storage `user-uploads` integration.
- Duration controls (3s, 5s, 10s), motion intensity slider (1–10), and camera trajectories (Orbit 360, Dolly Crane, Pan, Zoom).
- Interactive video playback scrubber and preview canvas.

### 4. Uncensored Conversational Roleplay
- Multi-persona chat system (`Elena - Noir Confidante`, `Aria - Cyberpunk Muse`, `Julian - Gothic Poet`).
- Real-time token streaming simulation with credit deduction (0.1 credit/turn) and full transcript history.

### 5. Credits System & Cashfree Payment Gateway (India - INR ₹)
- New users receive **10 Free Welcome Credits** on Supabase registration.
- **Credit deduction rules**: Image (1 credit), Video (5 credits), Chat (0.1 credit).
- Automatic credit refund on prompt rejection or failed generation.
- **Cashfree PG Integration**:
  - Client loads Cashfree JS SDK v3 (`https://sdk.cashfree.com/js/v3/cashfree.js`).
  - Server endpoint `/api/payment/create-order` creates Cashfree orders using the official `cashfree-pg` package.
  - Supports UPI (Google Pay, PhonePe, Paytm, BHIM), Cards (RuPay, Visa, Mastercard), and NetBanking.
  - Server webhook `/api/payment/webhook` verifies cryptographic HMAC-SHA256 signature and credits the user's Supabase balance.
- Credit packs: ₹99 (50 cr), ₹399 (250 cr), ₹999 (750 cr).
- Subscriptions: Basic ₹199/mo, Pro ₹599/mo, Unlimited ₹1,999/mo.

### 6. Admin Panel (Protected Route: `/admin`)
- Accessible only to accounts with `role='admin'` in the Supabase `profiles` table. Standard users receive a 403 Forbidden screen with a demo toggle for simulation.
- **A) Overview**: Total users, total generations, total Cashfree revenue (₹), active subscriptions, 30-day generation volume chart, and revenue trends.
- **B) Users Management**: Complete table with email, role, credits, subscription tier, join date, status. Actions include adding/deducting credits, banning/unbanning users, toggling roles, viewing user history, and deleting accounts.
- **C) API Providers Management**: CRUD management for multiple AI backends (Spicy AI, RunPod, custom endpoints). Fields include name, encrypted/masked API key, base URL, model name, inference type, active toggle, credits cost, and live connection test button. Keys are kept server-side only.
- **D) Models Management**: Configure user-facing AI models shown in Image Studio and Video Studio (display name, description, provider mapping, credits cost, 18+ flag, active state).
- **E) Generations Vault**: Complete platform generation logs with preview lightbox, manual refund action, and content flag resolution.
- **F) Cashfree Orders Ledger**: Comprehensive record of payment sessions, order IDs, payment status (`PAID`, `ACTIVE`, `REFUNDED`).
- **G) Platform Settings**: Maintenance mode toggle, signup bonus credits, global rate limits, brand accent color.

### 7. Safety, Compliance & Rate Limiting
- Strict automated content moderation blocking minors, CSAM, non-consensual depictions, violence, and unauthorized celebrity deepfakes.
- Server-side rate limiting (10 requests/minute per client).
- GDPR-compliant account deletion and complete JSON vault data export.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + Lucide Icons + Motion
- **Backend / API**: Express 4 + TypeScript (`tsx server.ts`) with Vite middlewares mounted in dev
- **Database & Auth**: Supabase (PostgreSQL with RLS + Supabase Auth + Supabase Storage `user-uploads`)
- **Payments**: Cashfree Payment Gateway (`cashfree-pg`, UPI, Cards, NetBanking)
- **AI Engine**: Server-side provider dispatch with API key encapsulation

---

## 📦 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

CASHFREE_APP_ID="your-cashfree-app-id"
CASHFREE_SECRET_KEY="your-cashfree-secret-key"
CASHFREE_ENV="SANDBOX"
CASHFREE_WEBHOOK_SECRET="your-webhook-secret"

APP_URL="http://localhost:3000"
```

### 3. Apply Supabase Database Schema & Storage
1. Open your project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase_schema.sql` and click **Run**.
4. This creates:
   - `profiles` table (with `role` and `credits`)
   - `api_providers` table (for AI provider management)
   - `ai_models` table (for dynamic studio models)
   - `generations` table (with `reference_image_url`, `is_img2img`, `reference_strength`)
   - `credit_transactions` and `cashfree_orders` tables
   - Supabase Storage bucket `user-uploads` with public read and authenticated insert policies
   - Auto-provisioning signup trigger awarding 10 free credits to new users.

### 4. Run the Dev Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## ⚖️ Legal & Compliance Notice

- **18 U.S.C. § 2257**: All visual depictions generated on this platform are synthetic, computer-generated visual simulations produced by mathematical diffusion models. No living performers were utilized or recorded.
- **Zero-Tolerance Policy**: Depictions of minors, non-consensual imagery, extreme violence, and non-consensual real-person likenesses are strictly forbidden and blocked server-side.
