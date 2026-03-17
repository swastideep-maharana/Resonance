import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuickAction } from "@/features/dashboard/data/quick-actions";
import { cn } from "@/lib/utils";

type QuickActionCardProps = QuickAction;

export function QuickActionCard({
  title,
  description,
  gradient,
  href,
}: QuickActionCardProps) {
  return (
    <div className="flex gap-5 rounded-2xl bg-white p-4 ring-outline shadow-smooth transition-all duration-500 hover:shadow-smooth-hover group relative overflow-hidden">
      {/* Visual placeholder with gradient */}
      <div
        className={cn(
          "relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-linear-to-br transition-all duration-500",
          gradient,
        )}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-14 rounded-full bg-white/40 blur-xl transition-all duration-500 group-hover:bg-white/50" />
          <div className="size-8 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between py-1 flex-1">
        <div className="space-y-1.5">
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          <p className="text-[13px] text-muted-foreground/80 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-end mt-2">
          <Button 
            variant="ghost" 
            size="xs" 
            className="w-fit text-primary hover:bg-primary/5 rounded-full px-3" 
            asChild
          >
            <Link href={href}>
              <span className="text-[12px] font-medium">Try now</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
};