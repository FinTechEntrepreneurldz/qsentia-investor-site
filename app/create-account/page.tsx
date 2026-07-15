import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, FileCheck2, ShieldCheck } from 'lucide-react';
import { CreateAccountForm } from '@/components/AuthForms';
import { Eyebrow, PageShell, SectionCard } from '@/components/PageChrome';

export const metadata: Metadata = {
  title: 'Create Account | QSentia',
  description: 'Create a QSentia account for platform access and institutional onboarding.',
};

const onboardingSteps = [
  'Submit your professional identity and organization details.',
  'Provide intended use case and platform area of interest.',
  'Complete verification and receive access confirmation.',
];

export default function CreateAccountPage() {
  return (
    <PageShell>
<<<<<<< HEAD
      <section className="border-b border-[#e4e4e7] bg-[#fafafa]">
=======
      <section className="border-b border-[#E5E5E7] bg-[#F5F5F6]">
>>>>>>> origin/main
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div>
            <Eyebrow>New account request</Eyebrow>
            <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[0.98] tracking-normal text-zinc-950 dark:text-white md:text-7xl lg:text-[5.5rem]">
              Create your QSentia account
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#52525b] md:text-lg">
              Register for platform access, live dashboards, and model workflows with professional onboarding context.
            </p>
          </div>

          <SectionCard className="p-6 md:p-8">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4f4f5] text-[#18181b]">
=======
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D1F1E1] text-[#0F8F5A]">
>>>>>>> origin/main
                <FileCheck2 className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#71717a]">Account details</div>
                <h2 className="text-xl font-semibold text-[#09090b]">Professional profile</h2>
              </div>
            </div>

            <CreateAccountForm />

            <p className="mt-6 text-sm text-[#52525b]">
              Already registered?{' '}
<<<<<<< HEAD
              <Link href="/signin" className="font-semibold text-[#18181b] hover:underline">
=======
              <Link href="/signin" className="font-semibold text-[#0F8F5A] hover:underline">
>>>>>>> origin/main
                Sign in here
              </Link>
            </p>
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
        {onboardingSteps.map((step, index) => (
          <SectionCard key={step} className="p-6">
<<<<<<< HEAD
            <div className="text-xs font-bold uppercase tracking-wide text-[#18181b]">Step {index + 1}</div>
            <p className="mt-4 text-sm leading-6 text-[#27272a]">{step}</p>
=======
            <div className="text-xs font-bold uppercase tracking-wide text-[#0F8F5A]">Step {index + 1}</div>
            <p className="mt-4 text-sm leading-6 text-[#26352c]">{step}</p>
>>>>>>> origin/main
          </SectionCard>
        ))}
      </section>

<<<<<<< HEAD
      <section className="border-y border-[#e4e4e7] bg-[#fafafa]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
          <SectionCard className="p-6">
            <ShieldCheck className="h-5 w-5 text-[#18181b]" />
            <h2 className="mt-4 text-xl font-semibold text-[#09090b]">Security policy</h2>
            <p className="mt-3 text-sm leading-6 text-[#52525b]">
=======
      <section className="border-y border-[#E5E5E7] bg-[#F5F5F6]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
          <SectionCard className="p-6">
            <ShieldCheck className="h-5 w-5 text-[#0F8F5A]" />
            <h2 className="mt-4 text-xl font-semibold text-[#06130c]">Security policy</h2>
            <p className="mt-3 text-sm leading-6 text-[#5a685f]">
>>>>>>> origin/main
              Never send passwords, API keys, broker credentials, or private tokens through unsecured channels.
            </p>
          </SectionCard>
          <SectionCard className="p-6">
<<<<<<< HEAD
            <Building2 className="h-5 w-5 text-[#18181b]" />
            <h2 className="mt-4 text-xl font-semibold text-[#09090b]">Institutional context</h2>
            <p className="mt-3 text-sm leading-6 text-[#52525b]">
=======
            <Building2 className="h-5 w-5 text-[#0F8F5A]" />
            <h2 className="mt-4 text-xl font-semibold text-[#06130c]">Institutional context</h2>
            <p className="mt-3 text-sm leading-6 text-[#5a685f]">
>>>>>>> origin/main
              Include your organization profile and scope of interest for faster routing and setup.
            </p>
          </SectionCard>
        </div>
      </section>
    </PageShell>
  );
}
