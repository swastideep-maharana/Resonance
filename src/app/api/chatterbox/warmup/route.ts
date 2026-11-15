import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

export const maxDuration = 60;

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = env.HF_ACCESS_TOKEN || process.env.HF_ACCESS_TOKEN || "";
    const res = await fetch("https://huggingface.co/api/spaces/swastideep/resonance-tts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return Response.json({ warm: data.runtime?.stage === "RUNNING", stage: data.runtime?.stage });
  } catch {
    return Response.json({ warm: false });
  }
}
