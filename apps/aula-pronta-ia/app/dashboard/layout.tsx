import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import OnboardingOverlay from "@/components/onboarding/OnboardingOverlay";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let onboardingCompleto = true;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completo")
      .eq("id", user.id)
      .single();
    onboardingCompleto = data?.onboarding_completo ?? false;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 px-4 pt-4 pb-28 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
      {!onboardingCompleto && <OnboardingOverlay />}
    </div>
  );
}
