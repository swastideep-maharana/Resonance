import { Client } from "@gradio/client";
import { env } from "./env";

interface GenerateSpeechParams {
  prompt: string;
  voiceKey?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  repetitionPenalty?: number;
}

export async function generateSpeech(params: GenerateSpeechParams): Promise<Buffer> {
  const token = (env.HF_ACCESS_TOKEN || process.env.HF_ACCESS_TOKEN || "") as `hf_${string}`;

  const app = await Client.connect("swastideep/resonance-tts", {
    token,
  });

  const result = (await app.predict("/generate", [
    params.prompt,
    params.voiceKey || "",
    params.temperature ?? 0.8,
    params.topP ?? 0.95,
    params.topK ?? 1000,
    params.repetitionPenalty ?? 1.2,
    true, // norm_loudness
  ])) as { data: Array<{ url: string }> };

  const audioUrl = result.data?.[0]?.url;
  if (!audioUrl) {
    throw new Error("No audio returned from speech synthesis");
  }

  const audioRes = await fetch(audioUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!audioRes.ok) {
    throw new Error(`Failed to download audio: ${audioRes.statusText}`);
  }

  const arrayBuffer = await audioRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
