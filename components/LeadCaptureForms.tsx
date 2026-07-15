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
<<<<<<< HEAD
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadName">
=======
        <label className={labelClass} htmlFor="leadName">
>>>>>>> origin/main
          Full name
        </label>
        <input
          id="leadName"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
<<<<<<< HEAD
          className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
=======
          className={inputClass}
>>>>>>> origin/main
          placeholder="Your full name"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
<<<<<<< HEAD
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadEmail">
=======
          <label className={labelClass} htmlFor="leadEmail">
>>>>>>> origin/main
            Work email
          </label>
          <input
            id="leadEmail"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
<<<<<<< HEAD
            className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
=======
            className={inputClass}
>>>>>>> origin/main
            placeholder="name@institution.com"
          />
        </div>
        <div className="grid gap-2">
<<<<<<< HEAD
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadOrganization">
=======
          <label className={labelClass} htmlFor="leadOrganization">
>>>>>>> origin/main
            Organization
          </label>
          <input
            id="leadOrganization"
            type="text"
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
<<<<<<< HEAD
            className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
=======
            className={inputClass}
>>>>>>> origin/main
            placeholder="Firm or company"
          />
        </div>
      </div>

      <div className="grid gap-2">
<<<<<<< HEAD
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadInterest">
=======
        <label className={labelClass} htmlFor="leadInterest">
>>>>>>> origin/main
          Inquiry type
        </label>
        <select
          id="leadInterest"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
<<<<<<< HEAD
          className="rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
=======
          className={inputClass}
>>>>>>> origin/main
        >
          <option>Institutional access</option>
          <option>Model licensing</option>
          <option>Due diligence</option>
          <option>Partnership</option>
          <option>Support</option>
        </select>
      </div>

      <div className="grid gap-2">
<<<<<<< HEAD
        <label className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="leadNotes">
=======
        <label className={labelClass} htmlFor="leadNotes">
>>>>>>> origin/main
          Context
        </label>
        <textarea
          id="leadNotes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
<<<<<<< HEAD
          className="resize-none rounded-none border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white"
=======
          className={`${inputClass} resize-none`}
>>>>>>> origin/main
          placeholder="Models, timeline, or access needs"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'saving'}
<<<<<<< HEAD
        className="inline-flex items-center justify-center gap-2 rounded-none bg-zinc-950 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
=======
        className="inline-flex h-11 items-center justify-center bg-zinc-950 text-white dark:bg-[#eeeeee] dark:text-black px-7 font-mono text-[11px] font-bold tracking-[0.18em] uppercase transition hover:bg-zinc-800 dark:hover:bg-white rounded-none disabled:opacity-60 disabled:cursor-not-allowed w-full"
>>>>>>> origin/main
      >
        {status === 'saving' ? 'Submitting...' : 'Submit inquiry'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </button>

      {status === 'saved' && (
<<<<<<< HEAD
        <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
=======
        <div className="flex items-center gap-2 rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 font-mono text-xs text-zinc-950 dark:text-white">
          <CheckCircle2 className="h-4 w-4 text-[#0F8F5A] dark:text-[#12B76A] shrink-0" />
>>>>>>> origin/main
          Inquiry captured for QSentia follow-up.
        </div>
      )}
      {status === 'error' && (
<<<<<<< HEAD
        <div className="border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-semibold text-rose-700 dark:text-rose-400">
=======
        <div className="rounded-[8px] border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-600 dark:text-rose-400">
>>>>>>> origin/main
          The inquiry could not be submitted. Please use the email channel.
        </div>
      )}
    </form>
  );
}
