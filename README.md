# Trigger Point Pro

Real-time trigger point mapping for massage therapists, bodyworkers, and acupuncturists.

A therapist creates a session and shares a link/QR code with the client. The client (lying face-down on the table) taps on a body diagram on their phone to mark pain/tension points. The therapist sees markers appear in real-time on their screen. The client can also signal pressure adjustments.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — Auth, Postgres, Realtime
- **Mobile-first** responsive design, dark theme, PWA

## Features

- Therapist signup/login (Supabase email + password auth)
- Session management with shareable links and QR codes
- Interactive SVG body map (front + back views, male + female toggle)
- Multi-point pain marker placement with intensity levels (mild/moderate/severe)
- Pressure feedback buttons (More / Less / Good / Stop)
- Real-time sync via Supabase Realtime (markers + pressure signals)
- Session history with saved trigger point maps
- Dark theme (#0a0a0a background, #00F0FF neon accent)
- PWA — installable with manifest and service worker

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd trigger-point-pro-v2
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings > API** and copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Realtime

In your Supabase dashboard:
1. Go to **Database > Replication**
2. Enable realtime for tables: `markers`, `pressure_signals`, `sessions`

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage Flow

1. **Therapist** signs up / logs in at `/signup` or `/login`
2. **Therapist** creates a new session from the dashboard
3. **Therapist** shares the client link (QR code or URL) with the client
4. **Client** opens the link on their phone — no login required
5. **Client** taps on the body map to place pain markers, selects intensity
6. **Client** uses pressure feedback buttons during the session
7. **Therapist** sees all markers and signals appear in real-time
8. **Therapist** ends the session when done — it's saved to history

## Project Structure

```
src/
  app/
    page.tsx              — Landing page
    layout.tsx            — Root layout (dark theme, PWA)
    login/page.tsx        — Therapist login
    signup/page.tsx       — Therapist signup
    dashboard/page.tsx    — Session management dashboard
    session/[id]/page.tsx — Therapist real-time session view
    client/[id]/page.tsx  — Client body map + pressure buttons
  components/
    BodyMap.tsx           — SVG body diagram with markers
    IntensityPicker.tsx   — Pain intensity selector
    PressureFeedback.tsx  — Pressure signal buttons
    SessionCard.tsx       — Session list card
    Header.tsx            — App header with nav
    ServiceWorkerRegistrar.tsx — PWA service worker setup
  lib/
    supabase.ts           — Supabase client instance
    utils.ts              — Helper functions
  types/
    index.ts              — TypeScript types and constants
public/
    manifest.json         — PWA manifest
    sw.js                 — Service worker
supabase/
    schema.sql            — Database schema (run in Supabase SQL Editor)
```

## PWA Icons

Generate placeholder icons:

```bash
node scripts/generate-icons.js
```

For production, replace with properly sized PNG icons (192x192 and 512x512).

## Deploy

The easiest way to deploy is on [Vercel](https://vercel.com). Set the environment variables in your Vercel project settings and deploy.
