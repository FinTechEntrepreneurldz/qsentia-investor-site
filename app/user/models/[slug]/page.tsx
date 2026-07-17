import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageChrome";
import { UserWorkspace } from "@/components/user/UserWorkspace";
import { currentInvestor } from "@/app/user/userPageData";
import { getInvestorHolding } from "@/lib/investorPortfolio";

export const dynamic = "force-dynamic";

type ModelPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const holding = getInvestorHolding(slug);

  return {
    title: holding ? `${holding.model.name} | QSentia` : "Model Investment | QSentia",
    description: "Review model-level investment performance and benchmark comparison.",
  };
}

export default async function UserModelPage({ params }: ModelPageProps) {
  const [{ slug }, user] = await Promise.all([params, currentInvestor()]);

  if (!user) {
    redirect(`/signin?next=/user/models/${slug}`);
  }

  return (
    <PageShell active="/user">
      <UserWorkspace user={user} view="model" modelSlug={slug} />
    </PageShell>
  );
}
