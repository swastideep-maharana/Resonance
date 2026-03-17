import { PageHeader } from "@/components/page-header";
import { HeroPattern } from "@/features/dashboard/components/hero-pattern";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";

export function DashboardView() {
  return (
    <div className="relative">
      <PageHeader title="Dashboard" className="lg:hidden" />
      <HeroPattern />
      <div className="relative space-y-10 p-4 lg:p-10 max-w-7xl mx-auto w-full">
        <DashboardHeader />
        <TextInputPanel />
        <QuickActionsPanel />
      </div>
    </div>
  );
};