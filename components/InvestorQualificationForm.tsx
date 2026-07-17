'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

const initial = {
  name: '',
  email: '',
  organization: '',
  investorType: '',
  useCase: '',
  assetClasses: '',
  modelCategories: '',
  accountType: '',
  desiredBroker: '',
  apiRequirements: '',
  userCount: '',
  subscriptionLevel: '',
  timeline: '',
};

const field =
  'w-full rounded-md border border-[#cfd7eb] bg-white px-3 py-2.5 text-sm text-[#09090b] outline-none transition focus:border-[#18181b] focus:ring-2 focus:ring-[#18181b]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white';

export default function InvestorQualificationForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    const response = await fetch('/api/investor-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const body = await response.json();
    if (!response.ok) {
      setStatus('error');
      setMessage(body.error || 'Unable to submit request');
      return;
    }
    setStatus('sent');
    setMessage(`Request ${body.requestId} is pending review.`);
    setForm(initial);
  }

  if (status === 'sent') {
    return (
      <div className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] p-6">
        <CheckCircle2 className="h-6 w-6 text-[#047857]" />
        <h3 className="mt-4 text-lg font-semibold text-[#09090b]">Request received</h3>
        <p className="mt-2 text-sm text-[#52525b]">
          {message} QSentia will review the requested model-access scope before enabling materials or platform access.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name">
        <input required maxLength={160} className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Work email">
        <input required type="email" maxLength={160} className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label="Organization">
        <input required maxLength={160} className={field} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
      </Field>
      <Select label="Investor or organization type" value={form.investorType} onChange={(value) => setForm({ ...form, investorType: value })} options={['Individual', 'Advisor', 'Family office', 'Institutional team', 'Model creator']} />
      <Select label="Intended use case" value={form.useCase} onChange={(value) => setForm({ ...form, useCase: value })} options={['Model discovery', 'Research diligence', 'Signal subscription', 'Portfolio monitoring', 'API integration']} />
      <Select label="Account type" value={form.accountType} onChange={(value) => setForm({ ...form, accountType: value })} options={['Individual', 'Advisor', 'Family office', 'Institutional', 'Internal research']} />
      <Field label="Asset classes of interest">
        <input required maxLength={200} className={field} value={form.assetClasses} onChange={(e) => setForm({ ...form, assetClasses: e.target.value })} placeholder="Equities, crypto, ETFs, futures..." />
      </Field>
      <Field label="Model categories of interest">
        <input required maxLength={200} className={field} value={form.modelCategories} onChange={(e) => setForm({ ...form, modelCategories: e.target.value })} placeholder="Sentiment, macro, ETF, RL..." />
      </Field>
      <Select label="Desired broker" value={form.desiredBroker} onChange={(value) => setForm({ ...form, desiredBroker: value })} options={['Alpaca', 'IBKR', 'Schwab', 'Other', 'Not sure yet']} />
      <Select label="API requirements" value={form.apiRequirements} onChange={(value) => setForm({ ...form, apiRequirements: value })} options={['Dashboard only', 'Exports', 'Read API', 'Webhooks', 'Custom integration']} />
      <Select label="Number of users" value={form.userCount} onChange={(value) => setForm({ ...form, userCount: value })} options={['1', '2-5', '6-20', '20+']} />
      <Select label="Expected subscription level" value={form.subscriptionLevel} onChange={(value) => setForm({ ...form, subscriptionLevel: value })} options={['Explorer', 'Investor', 'Professional', 'Enterprise', 'Not sure yet']} />
      <Select label="Desired pilot timeline" value={form.timeline} onChange={(value) => setForm({ ...form, timeline: value })} options={['Immediate', '1-3 months', '3-6 months', '6+ months']} />
      <div className="sm:col-span-2">
        <p className="mb-4 text-xs leading-5 text-[#71717a]">
          This form requests access to QSentia software, model evidence, and platform materials. It is not a capital allocation form or an offering-document request.
        </p>
        {status === 'error' ? <p className="mb-3 text-sm font-semibold text-[#be123c]">{message}</p> : null}
        <button disabled={status === 'sending'} className="inline-flex items-center gap-2 rounded-md bg-[#18181b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3f3f46] disabled:opacity-60">
          {status === 'sending' ? 'Submitting...' : 'Request model access'}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#27272a] dark:text-zinc-200">{label}{children}</label>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Field label={label}>
      <select required className={field} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </Field>
  );
}
