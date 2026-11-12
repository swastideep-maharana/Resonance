import { Polar } from "@polar-sh/sdk";
import { prisma } from "./db";
import { env } from "./env";

export const FREE_DAILY_GENERATION_LIMIT = 5;
export const FREE_DAILY_VOICE_LIMIT = 1;

export const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER,
});

function isPolarNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { statusCode?: number; status?: number; name?: string };
  return e.statusCode === 404 || e.status === 404 || e.name === "ResourceNotFound";
}

function getStartOfUtcDay(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export interface DailyFreeUsage {
  generationsUsed: number;
  generationsLimit: number;
  voicesUsed: number;
  voicesLimit: number;
}

export async function getDailyFreeUsage(orgId: string): Promise<DailyFreeUsage> {
  const startOfDay = getStartOfUtcDay();

  const [generationsUsed, voicesUsed] = await Promise.all([
    prisma.generation.count({
      where: {
        orgId,
        createdAt: { gte: startOfDay },
      },
    }),
    prisma.voice.count({
      where: {
        orgId,
        variant: "CUSTOM",
        createdAt: { gte: startOfDay },
      },
    }),
  ]);

  return {
    generationsUsed,
    generationsLimit: FREE_DAILY_GENERATION_LIMIT,
    voicesUsed,
    voicesLimit: FREE_DAILY_VOICE_LIMIT,
  };
}

export async function hasActivePolarSubscription(orgId: string): Promise<boolean> {
  if (env.DISABLE_BILLING_CHECK) {
    return true;
  }

  try {
    const customerState = await polar.customers.getStateExternal({
      externalId: orgId,
    });
    return (customerState.activeSubscriptions ?? []).length > 0;
  } catch (err) {
    if (isPolarNotFoundError(err)) {
      return false;
    }
    console.error("Polar subscription check failed:", err);
    throw err;
  }
}