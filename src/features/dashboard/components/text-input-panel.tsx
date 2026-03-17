"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { 
  COST_PER_UNIT, 
  TEXT_MAX_LENGTH
} from "@/features/text-to-speech/data/constants";

export function TextInputPanel() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    router.push(`/text-to-speech?text=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="relative group">
      <div className="
        relative rounded-[20px] bg-white ring-outline shadow-smooth transition-all duration-500 hover:shadow-smooth-hover
      ">
        <div className="space-y-4 rounded-[18px] bg-white p-6 border border-black/[0.03] shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
          <Textarea
            placeholder="Start typing or paste your text here..."
            className="min-h-40 resize-none border-0 bg-transparent p-0 text-lg! tracking-tight shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={TEXT_MAX_LENGTH}
          />

          <div className="flex items-center justify-between pt-4 border-t border-dashed border-border/50">
            <Badge variant="secondary" className="gap-1.5 bg-secondary/50 hover:bg-secondary/80 transition-colors">
              <Coins className="size-3.5 text-primary/70" />
              <span className="text-[13px] font-medium font-mono tracking-tight">
                {text.length === 0 ? (
                  "0.0000"
                ) : (
                  (text.length * COST_PER_UNIT).toFixed(4)
                )}
                <span className="text-muted-foreground text-xs ml-1">Tokens</span>
              </span>
            </Badge>
            <div className="flex items-center gap-4">
               <span className="text-[12px] font-medium text-muted-foreground/70 font-mono">
                {text.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()}
              </span>
              <Button
                size="sm"
                disabled={!text.trim()}
                onClick={handleGenerate}
                className="rounded-full px-6 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Generate speech
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}