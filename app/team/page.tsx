import type { Metadata } from "next";
import { PageIntro } from "@/components/InstitutionalShell";
import { PageShell } from "@/components/PageChrome";
import TeamDirectory from "@/components/TeamDirectory";

export const metadata: Metadata = {
  title: "Team | QSentia",
  description:
    "The QSentia team building systematic investment management, quantitative research workflows, investor telemetry, and API infrastructure.",
};

export default function TeamPage() {
  return (
    <PageShell active="/team">
      <PageIntro
        eyebrow="Team"
        title="Meet the QSentia team"
        body="Meet the people building QSentia's investment-management program, quantitative research workflows, investor telemetry, customer dashboards, and API infrastructure for systematic investment operations."
      />
      <TeamDirectory />
    </PageShell>
  );
}
