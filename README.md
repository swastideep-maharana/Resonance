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


