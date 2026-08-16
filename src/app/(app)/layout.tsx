import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@/features/profiles/queries";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfile(user);

  return <AppShell profile={profile}>{children}</AppShell>;
}
