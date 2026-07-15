import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ShieldCheck, User } from 'lucide-react';
import { SignInForm } from '@/components/AuthForms';
import { Eyebrow, PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Sign In | QSentia',
  description: 'Secure account sign-in portal for QSentia users.',
};

export default function SignInPage() {
  return (
    <PageShell>
<<<<<<< HEAD
      <section className="border-b border-[#e4e4e7] bg-[#fafafa]">
=======
      <section className="border-b border-[#E5E5E7] bg-[#F5F5F6]">
>>>>>>> origin/main
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div>
            <Eyebrow>Access portal</Eyebrow>
            <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-7xl lg:text-[5.5rem]">
              Sign in to QSentia
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#52525b] md:text-lg">
              Access dashboards, model registry workflows, and telemetry views through a protected account.
            </p>
          </div>

          <SectionCard className="p-6 md:p-8">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4f4f5] text-[#18181b]">
=======
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D1F1E1] text-[#0F8F5A]">
>>>>>>> origin/main
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#71717a]">Secure sign in</div>
                <h2 className="text-xl font-semibold text-[#09090b]">Account credentials</h2>
              </div>
            </div>

            <SignInForm />

            <p className="mt-6 text-sm text-[#52525b]">
              New here?{' '}
<<<<<<< HEAD
              <Link href="/create-account" className="font-semibold text-[#18181b] hover:underline">
=======
              <Link href="/create-account" className="font-semibold text-[#0F8F5A] hover:underline">
>>>>>>> origin/main
                Create your account
              </Link>
            </p>
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
        <SecurityCard icon={<ShieldCheck className="h-5 w-5" />} title="Protected authentication">
          Use your approved account identity only. Avoid sharing credentials across teams.
        </SecurityCard>
        <SecurityCard icon={<User className="h-5 w-5" />} title="Institutional onboarding">
          If your organization needs access setup, start from account creation and route verification details there.
        </SecurityCard>
      </section>
    </PageShell>
  );
}

function SecurityCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <SectionCard className="p-6">
<<<<<<< HEAD
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4f4f5] text-[#18181b]">{icon}</span>
      <h2 className="mt-5 text-xl font-semibold text-[#09090b]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#52525b]">{children}</p>
=======
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D1F1E1] text-[#0F8F5A]">{icon}</span>
      <h2 className="mt-5 text-xl font-semibold text-[#06130c]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#5a685f]">{children}</p>
>>>>>>> origin/main
    </SectionCard>
  );
}
