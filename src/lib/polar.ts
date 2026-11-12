import { Polar } from "@polar-sh/sdk";
import { env } from "./env";

export const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER,
});

function isPolarNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { statusCode?: number; status?: number; name?: string };
  return e.statusCode === 404 || e.status === 404 || e.name === "ResourceNotFound";
}

export async function hasActivePolarSubscription(orgId: string): Promise<boolean> {
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