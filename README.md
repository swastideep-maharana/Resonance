# Resonance

Resonance is an AI-powered text-to-speech (TTS) and voice cloning platform built with Next.js 16, tRPC, Prisma, Clerk, Cloudflare R2, Polar, and Chatterbox TTS on Hugging Face ZeroGPU.

## Features

- **Text-to-Speech Generation**: High-fidelity speech generation with configurable sampling parameters (`temperature`, `topP`, `topK`, `repetitionPenalty`).
- **Instant Voice Cloning**: Upload or record an audio sample (minimum 10 seconds) to create custom organization voices.
- **Voice Library**: Browse, search, preview, and manage built-in system voices and custom team voices.
- **Waveform Audio Playback**: Interactive waveform visualization powered by `wavesurfer.js`.
- **Multi-Tenant Organizations**: Workspace isolation, permissions, and organization switching via Clerk.
- **Daily Free Quota & Metered Billing**: Built-in daily free tier (5 generations and 1 custom voice per day) with live progress tracking and Polar pay-as-you-go checkout.
- **Error Monitoring**: Real-time error tracking with Sentry.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons
- **Authentication**: Clerk (`@clerk/nextjs`) with Organizations
- **API & Data Fetching**: tRPC v11, TanStack Query v5, SuperJSON, Zod
- **Database**: PostgreSQL (Neon Serverless Postgres) with Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- **Object Storage**: Cloudflare R2 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **TTS Backend**: Chatterbox Turbo TTS on Hugging Face Space (ZeroGPU / Nvidia A100)
- **Billing**: Polar SDK (`@polar-sh/sdk`)
- **Forms & URL State**: TanStack Form, `nuqs`
- **Monitoring**: Sentry (`@sentry/nextjs`, `@sentry/node`)

## Project Structure

```text
.
├── prisma/                    # Prisma schema, migrations, and seed scripts
├── public/                    # Static assets (custom icons, SVGs)
├── scripts/                   # Utility and database seeding scripts
│   ├── seed-system-voices.ts  # Seeds 20 built-in system voices
│   └── sync-api.ts            # Syncs OpenAPI types for Chatterbox
└── src/
    ├── app/                   # Next.js App Router pages and API routes
    ├── components/            # Shared UI components
    ├── features/              # Feature modules (billing, dashboard, text-to-speech, voices)
    ├── hooks/                 # Shared React hooks
    ├── lib/                   # Database (Neon), R2, Polar, env, and Chatterbox clients
    ├── trpc/                  # tRPC router, procedures, context, and query client
    └── proxy.ts               # Clerk authentication and org-selection middleware
```

## Getting Started

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database
- Clerk application with Organizations enabled
- Cloudflare R2 bucket
- Polar account for billing
- Hugging Face Space running Chatterbox TTS backend

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Neon Postgres)
DATABASE_URL="postgresql://neondb_owner:...@ep-...-pooler...neon.tech/neondb?sslmode=require"

# Application
APP_URL=http://localhost:3000

# Chatterbox TTS Backend (Hugging Face ZeroGPU)
CHATTERBOX_API_URL=https://<your-username>-resonance-tts.hf.space
CHATTERBOX_API_KEY=super-secret-key-voice

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

# Optional local test override (set to false to enforce daily free tier and billing)
DISABLE_BILLING_CHECK=false
```

### 3. Database Migration and Seeding

Run Prisma migrations and seed the 20 built-in system voices:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run sync-api` - Regenerate OpenAPI TypeScript types for Chatterbox
