
import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useCheckout } from "@/features/billing/hooks/use-checkout";
import { useTRPC } from "@/trpc/client";
import type { DailyFreeUsage } from "@/lib/polar";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const percentage = limit > 0 ? Math.min(100, (used / limit) * 100) : 100;
  const reached = used >= limit;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={
            reached ? "font-medium text-destructive" : "font-medium text-foreground"
          }
        >
          {Math.min(used, limit)} / {limit}
        </span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  );
}

function UpgradeCard({ freeUsage }: { freeUsage?: DailyFreeUsage }) {
  const { checkout, isPending: isCheckoutPending } = useCheckout();
  const limitReached =
    freeUsage !== undefined &&
    (freeUsage.generationsUsed >= freeUsage.generationsLimit ||
      freeUsage.voicesUsed >= freeUsage.voicesLimit);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Free plan
          </p>
          <span className="text-[11px] text-muted-foreground">Daily</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {limitReached
            ? "Daily limit reached. Upgrade for unlimited access."
            : "Upgrade anytime for unlimited pay-as-you-go usage."}
        </p>
      </div>
      {freeUsage && (
        <div className="space-y-2">
          <UsageBar
            label="Generations"
            used={freeUsage.generationsUsed}
            limit={freeUsage.generationsLimit}
          />
          <UsageBar
            label="Voice clones"
            used={freeUsage.voicesUsed}
            limit={freeUsage.voicesLimit}
          />
        </div>
      )}
      <Button
        variant="outline"
        className="w-full text-xs"
        size="sm"
        disabled={isCheckoutPending}
        onClick={checkout}
      >
        {isCheckoutPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting...
          </>
        ) : (
          "Upgrade"
        )}
      </Button>
    </div>
  );
};

function UsageCard({ 
  estimatedCostCents
}: { 
  estimatedCostCents: number
}) {
  const trpc = useTRPC();
  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({}),
  );

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.open(data.portalUrl, "_blank");
      },
    });
  }, [portalMutation]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Current usage
        </p>
        <p className="text-xl font-bold tracking-tight text-foreground mt-1">
          {formatCurrency(estimatedCostCents)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Estimated this period
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full text-xs"
        size="sm"
        disabled={portalMutation.isPending}
        onClick={openPortal}
      >
        {portalMutation.isPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting...
          </>
        ) : (
          "Manage Subscription"
        )}
      </Button>
    </div>
  );
};

export function UsageContainer() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.billing.getStatus.queryOptions());

  return (
    <div className="group-data-[collapsible=icon]:hidden bg-background border border-border rounded-lg p-3">
      {data?.hasActiveSubscription ? (
        <UsageCard estimatedCostCents={data.estimatedCostCents} />
      ) : (
        <UpgradeCard freeUsage={data?.freeUsage} />
      )}
    </div>
  );
};
