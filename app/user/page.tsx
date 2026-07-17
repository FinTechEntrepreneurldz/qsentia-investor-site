import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageChrome";
import { UserWorkspace } from "@/components/user/UserWorkspace";
import { currentInvestor } from "@/app/user/userPageData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Investor Workspace | QSentia",
  description: "Track wallet balance, allocations, and ML model performance.",
};

export default async function UserPage() {
  const user = await currentInvestor();

  if (!user) {
    redirect("/signin?next=/user");
  }

  return (
    <PageShell active="/user">
      <UserWorkspace user={user} view="holdings" />
    </PageShell>
  );
}
