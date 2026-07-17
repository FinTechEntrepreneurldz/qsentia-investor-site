import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageChrome";
import { UserWorkspace } from "@/components/user/UserWorkspace";
import { currentInvestor } from "@/app/user/userPageData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wallet | QSentia",
  description: "Add money, withdraw, and review wallet balance.",
};

export default async function UserWalletPage() {
  const user = await currentInvestor();

  if (!user) {
    redirect("/signin?next=/user/wallet");
  }

  return (
    <PageShell active="/user">
      <UserWorkspace user={user} view="wallet" />
    </PageShell>
  );
}
