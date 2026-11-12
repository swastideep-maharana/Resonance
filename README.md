# Resonance

Resonance is an AI-powered text-to-speech (TTS) and voice cloning platform built with Next.js, tRPC, Prisma, Clerk, Cloudflare R2, Polar, and Chatterbox TTS.

## Features

- **Text-to-Speech Generation**: Generate speech from text with configurable sampling parameters (`temperature`, `topP`, `topK`, `repetitionPenalty`).
- **Voice Cloning**: Upload or record an audio sample to create custom organization voices.
- **Voice Library**: Browse, search, preview, and manage built-in system voices and custom team voices.
- **Audio Playback & Waveforms**: Interactive waveform playback powered by `wavesurfer.js`.
- **Multi-Tenant Organizations**: Workspace isolation and organization switching via Clerk.
- **Usage-Based Billing**: Subscription checks and metered usage tracking via Polar.
- **Error Monitoring**: Client and server error tracking with Sentry.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons
- **Authentication**: Clerk (`@clerk/nextjs`) with Organizations
- **API & Data Fetching**: tRPC v11, TanStack Query v5, SuperJSON, Zod
- **Database**: PostgreSQL with Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- **Object Storage**: Cloudflare R2 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **TTS Inference**: Chatterbox TTS (`chatterbox_tts.py`, typed via `openapi-fetch` + `openapi-typescript`)
- **Billing**: Polar SDK (`@polar-sh/sdk`)
- **Forms & URL State**: TanStack Form, `nuqs`
- **Monitoring**: Sentry (`@sentry/nextjs`, `@sentry/node`)

## Project Structure

```text
.
├── chatterbox_tts.py          # Chatterbox TTS service (Modal)
├── prisma/                    # Prisma schema and migrations
├── public/                    # Static assets
├── scripts/                   # Utility and seeding scripts
│   ├── seed-system-voices.ts  # Seeds built-in system voices
│   └── sync-api.ts            # Syncs OpenAPI types for Chatterbox
└── src/
    ├── app/                   # Next.js App Router pages and API routes
    ├── components/            # Shared UI components
    ├── features/              # Feature modules (billing, dashboard, text-to-speech, voices)
    ├── hooks/                 # Shared React hooks
    ├── lib/                   # Database, R2, Polar, env, and Chatterbox clients
    ├── trpc/                  # tRPC router, context, and query client setup
    └── proxy.ts               # Clerk authentication and org-selection middleware
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Clerk application (with Organizations enabled)
- Cloudflare R2 bucket
- Polar account and meters configured
- Chatterbox TTS endpoint (`CHATTERBOX_API_URL` and `CHATTERBOX_API_KEY`)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# Application
APP_URL=http://localhost:3000

# Chatterbox TTS
CHATTERBOX_API_URL=
CHATTERBOX_API_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_TOKEN=

# Polar
POLAR_ACCESS_TOKEN=
POLAR_SERVER=sandbox
POLAR_PRODUCT_ID=
POLAR_METER_VOICE_CREATION=
POLAR_METER_TTS_GENERATION=
POLAR_METER_TTS_PROPERTY=
```

### 3. Database Setup

Run Prisma migrations and seed the built-in system voices:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start the Next.js development server
- `npm run build` — Build the application for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint
- `npm run sync-api` — Regenerate OpenAPI TypeScript types via `scripts/sync-api.ts`

## Deployment Notes

- Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`pk_live_...`) and `CLERK_SECRET_KEY` (`sk_live_...`) to your Clerk production keys when deploying to production.
- Ensure `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` are used instead of the deprecated `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` variables.
- Ensure `APP_URL` matches your deployed origin (for example, `https://your-domain.vercel.app`).
