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

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadName">
          Full name
        </label>
        <input
          id="leadName"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
          placeholder="Your full name"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadEmail">
            Work email
          </label>
          <input
            id="leadEmail"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
            placeholder="name@institution.com"
          />
        </div>
        <div className="grid gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadOrganization">
            Organization
          </label>
          <input
            id="leadOrganization"
            type="text"
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
            className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
            placeholder="Firm or company"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadInterest">
          Inquiry type
        </label>
        <select
          id="leadInterest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
        >
          <option>Institutional access</option>
          <option>Model licensing</option>
          <option>Due diligence</option>
          <option>Partnership</option>
          <option>Support</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadNotes">
          Context
        </label>
        <textarea
          id="leadNotes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          className="resize-none rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
          placeholder="Models, timeline, or access needs"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'saving'}
        className="inline-flex items-center justify-center gap-2 rounded-none bg-zinc-950 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {status === 'saving' ? 'Submitting' : 'Submit inquiry'}
        <ArrowRight className="h-4 w-4" />
      </button>

      {status === 'saved' && (
        <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Inquiry captured for QSentia follow-up.
        </div>
      )}
      {status === 'error' && (
        <div className="border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-semibold text-rose-700 dark:text-rose-400">
          The inquiry could not be submitted. Please use the email channel.
        </div>
      )}
    </form>
  );
}
