"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useAppForm } from "@/hooks/use-app-form";
import { useCheckout } from "@/features/billing/hooks/use-checkout";

const ttsFormSchema = z.object({
  text: z.string().min(1, "Please enter some text"),
  voiceId: z.string().min(1, "Please select a voice"),
  temperature: z.number(),
  topP: z.number(),
  topK: z.number(),
  repetitionPenalty: z.number(),
});

export type TTSFormValues = z.infer<typeof ttsFormSchema>;

export const defaultTTSValues: TTSFormValues = {
  text: "",
  voiceId: "",
  temperature: 0.8,
  topP: 0.95,
  topK: 1000,
  repetitionPenalty: 1.2,
};

export const ttsFormOptions = formOptions({
  defaultValues: defaultTTSValues,
});

export function TextToSpeechForm({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: TTSFormValues;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useMutation(
    trpc.generations.create.mutationOptions({}),
  );

  const { checkout } = useCheckout();

  const form = useAppForm({
    ...ttsFormOptions,
    defaultValues: defaultValues ?? defaultTTSValues,
    validators: {
      onSubmit: ttsFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        text: value.text.trim(),
        voiceId: value.voiceId,
        temperature: value.temperature,
        topP: value.topP,
        topK: value.topK,
        repetitionPenalty: value.repetitionPenalty,
      };

      const isTimeout = (err: unknown) => {
        if (!err || typeof err !== "object") return false;
        const e = err as {
          message?: string;
          data?: { httpStatus?: number };
          meta?: { response?: { status?: number } };
        };
        const msg = e.message ?? "";
        return (
          e.meta?.response?.status === 504 ||
          e.data?.httpStatus === 504 ||
          msg.includes("504") ||
          msg.includes("FUNCTION_INVOCATION_TIMEOUT") ||
          msg.includes("Unexpected token") ||
          msg.includes("Unable to transform response") ||
          msg.toLowerCase().includes("timeout")
        );
      };

      try {
        let data;
        const maxAttempts = 4;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            data = await createMutation.mutateAsync(payload);
            break;
          } catch (attemptError) {
            if (!isTimeout(attemptError) || attempt === maxAttempts) {
              throw attemptError;
            }
            // Modal cold-start can exceed Vercel's 60s limit; retry while it warms up
            toast.loading(
              `Voice server is warming up (attempt ${attempt}/${maxAttempts - 1}), retrying...`,
              { id: "tts-warmup-retry" },
            );
            await new Promise((resolve) => setTimeout(resolve, 4000));
          }
        }

        if (!data) {
          throw new Error("Failed to generate audio");
        }

        toast.dismiss("tts-warmup-retry");
        toast.success("Audio generated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.billing.getStatus.queryKey(),
        });
        router.push(`/text-to-speech/${data.id}`);
      } catch (error) {
        toast.dismiss("tts-warmup-retry");
        const message =
          error instanceof Error ? error.message : "Failed to generate audio";

        if (message === "SUBSCRIPTION_REQUIRED") {
          toast.error("Daily free limit reached. Upgrade to continue.", {
            action: {
              label: "Upgrade",
              onClick: () => checkout(),
            },
          });
        } else if (isTimeout(error)) {
          toast.error("Voice server is still warming up. Please click Generate speech again.");
        } else {
          toast.error(message);
        }
      }
    },
  });

  return <form.AppForm>{children}</form.AppForm>;
};