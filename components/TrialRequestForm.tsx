'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

type TrialRequestFormProps = {
  modelId: string;
  modelName: string;
};

type TrialResponse = {
  ok?: boolean;
  error?: string;
  offer?: {
    code: string;
    title: string;
    trialDays: number;
    discountType: string;
    discountValue: number;
    expiresAt: string | null;
  } | null;
};

export default function TrialRequestForm({ modelId, modelName }: TrialRequestFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submitTrialRequest() {
    if (!name.trim() || !email.trim()) {
      setStatus('error');
      setMessage('Name and email are required.');
      return;
    }

    setStatus('saving');
    setMessage('');

    try {
      const response = await fetch('/api/trials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          organization,
          discountCode,
          modelId,
          modelName,
        }),
      });
      const payload = (await response.json()) as TrialResponse;

      if (!response.ok) throw new Error(payload.error || 'Trial request failed');

      setStatus('saved');
      setMessage(
        payload.offer
          ? `Trial request captured with ${payload.offer.code}.`
          : 'Trial request captured for QSentia follow-up.'
      );
      setName('');
      setEmail('');
      setOrganization('');
      setDiscountCode('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit trial request.');
    }
  }

  return (
    <div className="mt-5 rounded-[10px] border border-[#e4e4e7] bg-[#fafafa] p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#18181b]">
        <KeyRound className="h-4 w-4" />
        Trial access
      </div>
      <div className="mt-4 grid gap-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          className="rounded-md border border-[#d4d4d8] bg-white px-3 py-2.5 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Work email"
          className="rounded-md border border-[#d4d4d8] bg-white px-3 py-2.5 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
        />
        <input
          type="text"
          value={organization}
          onChange={(event) => setOrganization(event.target.value)}
          placeholder="Organization"
          className="rounded-md border border-[#d4d4d8] bg-white px-3 py-2.5 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
        />
        <input
          type="text"
          value={discountCode}
          onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
          placeholder="Discount code, if provided"
          className="rounded-md border border-[#d4d4d8] bg-white px-3 py-2.5 text-sm uppercase text-[#09090b] outline-none focus:border-[#18181b]"
        />
        <button
          type="button"
          onClick={submitTrialRequest}
          disabled={status === 'saving'}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#18181b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#3f3f46] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'saving' ? 'Submitting' : 'Request trial'}
          <ArrowRight className="h-4 w-4" />
        </button>
        {message && (
          <div
            className={`flex items-start gap-2 rounded-md border p-3 text-sm font-semibold ${
              status === 'saved'
                ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#047857]'
                : 'border-[#fecdd3] bg-[#fff1f2] text-[#be123c]'
            }`}
          >
            {status === 'saved' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
