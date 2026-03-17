import { WavyBackground } from "@/components/ui/wavy-background";

export function HeroPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      <WavyBackground
        colors={["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"]}
        backgroundFill="hsl(0 0% 100%)"
        blur={2}
        speed="slow"
        waveOpacity={0.05}
        waveWidth={60}
        waveYOffset={250}
        containerClassName="h-full"
        className="hidden"
      />
    </div>
  );
}