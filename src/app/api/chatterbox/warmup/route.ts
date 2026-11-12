import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ping the Modal ASGI app to trigger @modal.enter() model loading while the user types
    await fetch(`${env.CHATTERBOX_API_URL}/openapi.json`, {
      method: "GET",
      headers: {
        "x-api-key": env.CHATTERBOX_API_KEY,
      },
      signal: AbortSignal.timeout(8000),
    });
    return Response.json({ warm: true });
  } catch {
    // Container is likely still cold-starting in the background
    return Response.json({ warm: false });
  }
}
