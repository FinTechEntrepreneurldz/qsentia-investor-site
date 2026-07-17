import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageChrome";
import { UserWorkspace } from "@/components/user/UserWorkspace";
import { currentInvestor } from "@/app/user/userPageData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports | QSentia",
  description: "Download statements, model evidence, and trade reports.",
};

export default async function UserReportsPage() {
  const user = await currentInvestor();

  if (!user) {
    redirect("/signin?next=/user/reports");
  }

  return (
    <PageShell active="/user">
      <UserWorkspace user={user} view="reports" />
    </PageShell>
  );
}
