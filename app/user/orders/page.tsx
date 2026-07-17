import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageChrome";
import { UserWorkspace } from "@/components/user/UserWorkspace";
import { currentInvestor } from "@/app/user/userPageData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders | QSentia",
  description: "Review model allocations, rebalances, and wallet transactions.",
};

export default async function UserOrdersPage() {
  const user = await currentInvestor();

  if (!user) {
    redirect("/signin?next=/user/orders");
  }

  return (
    <PageShell active="/user">
      <UserWorkspace user={user} view="orders" />
    </PageShell>
  );
}
