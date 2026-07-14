'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function ContactLeadForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [interest, setInterest] = useState('Institutional access');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          organization,
          interest,
          notes,
          source: 'contact',
        }),
      });

      if (!response.ok) throw new Error('Unable to submit inquiry');

      setName('');
      setEmail('');
      setOrganization('');
      setInterest('Institutional access');
      setNotes('');
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 py-3 font-mono text-xs uppercase tracking-wider text-zinc-950 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-650 transition';

  const labelClass = 'font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-550';

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className={labelClass} htmlFor="leadName">
          Full name
        </label>
        <input
          id="leadName"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
          placeholder="Your full name"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="leadEmail">
            Work email
          </label>
          <input
            id="leadEmail"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="name@institution.com"
          />
        </div>
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="leadOrganization">
            Organization
          </label>
          <input
            id="leadOrganization"
            type="text"
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
            className={inputClass}
            placeholder="Firm or company"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="leadInterest">
          Inquiry type
        </label>
        <select
          id="leadInterest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className={inputClass}
        >
          <option>Institutional access</option>
          <option>Model licensing</option>
          <option>Due diligence</option>
          <option>Partnership</option>
          <option>Support</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="leadNotes">
          Context
        </label>
        <textarea
          id="leadNotes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Models, timeline, or access needs"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'saving'}
        className="inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none disabled:opacity-60 disabled:cursor-not-allowed w-full"
      >
        {status === 'saving' ? 'Submitting...' : 'Submit inquiry'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </button>

      {status === 'saved' && (
        <div className="flex items-center gap-2 rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 font-mono text-xs text-zinc-950 dark:text-white">
          <CheckCircle2 className="h-4 w-4 text-[#0F8F5A] dark:text-[#12B76A] shrink-0" />
          Inquiry captured for QSentia follow-up.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-[8px] border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-600 dark:text-rose-400">
          The inquiry could not be submitted. Please use the email channel.
        </div>
      )}
    </form>
  );
}
