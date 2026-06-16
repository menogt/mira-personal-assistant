import { LogOut } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import { getProfile } from "@/features/profiles/queries";
import { SettingsForm } from "@/features/settings/settings-form";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getProfile(user);

  return (
    <>
      <PageHeader title="Settings" description="Manage the small Phase 1 preferences MIRA needs." />
      <div className="space-y-6">
        <SettingsForm profile={profile} />
        <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          </form>
        </section>
      </div>
    </>
  );
}
