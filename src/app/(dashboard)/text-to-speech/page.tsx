
import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Text to Speech",
    description: "Text to Speech",
};

export default function TextToSpeechPage(){
    prefetch(trpc.voices.getAll.queryOptions());

    return(
        <HydrateClient>
            <TextToSpeechView />
        </HydrateClient>
    )
}