"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { authConfigMissingMessage, getSupabaseBrowserClient } from "@/lib/supabaseClient";

type OAuthProvider = "google";

function callbackUrl(nextPath: string) {
  const callback = new URL("/auth/callback", window.location.origin);
  callback.searchParams.set("next", nextPath);
  return callback.toString();
}

function nextPathFromLocation() {
  if (typeof window === "undefined") return "/dashboard";
  return new URLSearchParams(window.location.search).get("next") || "/dashboard";
}

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (!code) return;

    const timer = window.setTimeout(() => {
      if (code === "auth_not_configured") setError(authConfigMissingMessage());
      if (code === "oauth_exchange_failed") {
        setError("OAuth sign-in could not be completed. Please try again.");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError(authConfigMissingMessage());
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = nextPathFromLocation();
  }

  async function handleOAuth(provider: OAuthProvider) {
    setProviderLoading(provider);
    setError("");
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError(authConfigMissingMessage());
      setProviderLoading(null);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl(nextPathFromLocation()),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setError(error.message);
      setProviderLoading(null);
    }
  }

  return (
    <div className="mt-6 grid gap-5">
      <div className="grid gap-3">
        <ProviderButton
          provider="google"
          label="Continue with Google"
          loading={providerLoading === "google"}
          disabled={Boolean(providerLoading) || loading}
          onClick={() => handleOAuth("google")}
        />
      </div>

      <div className="flex items-center gap-3">
<<<<<<< HEAD
        <span className="h-px flex-1 bg-[#e4e4e7]" />
        <span className="text-xs font-bold uppercase tracking-wide text-[#71717a]">or use email</span>
        <span className="h-px flex-1 bg-[#e4e4e7]" />
=======
        <span className="h-px flex-1 bg-[#E5E5E7]" />
        <span className="text-xs font-bold uppercase tracking-wide text-[#8a958e]">or use email</span>
        <span className="h-px flex-1 bg-[#E5E5E7]" />
>>>>>>> origin/main
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
      <label
        className="text-xs font-bold uppercase tracking-wide text-[#71717a]"
        htmlFor="email"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        suppressHydrationWarning
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@institution.com"
        required
<<<<<<< HEAD
        className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
=======
        className="rounded-md border border-[#E5E5E7] bg-white px-4 py-3 text-sm text-[#06130c] outline-none focus:border-[#0F8F5A]"
>>>>>>> origin/main
      />
      <label
        className="text-xs font-bold uppercase tracking-wide text-[#71717a]"
        htmlFor="password"
      >
        Password
      </label>
      <input
        id="password"
        type="password"
        suppressHydrationWarning
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
<<<<<<< HEAD
        className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
      />
      <a
        href="/contact"
        className="text-right text-xs font-semibold text-[#18181b] hover:underline"
=======
        className="rounded-md border border-[#E5E5E7] bg-white px-4 py-3 text-sm text-[#06130c] outline-none focus:border-[#0F8F5A]"
      />
      <a
        href="/contact"
        className="text-right text-xs font-semibold text-[#0F8F5A] hover:underline"
>>>>>>> origin/main
      >
        Forgot password?
      </a>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        suppressHydrationWarning
        disabled={loading || Boolean(providerLoading)}
<<<<<<< HEAD
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#18181b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3f3f46] disabled:opacity-60"
=======
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#0F8F5A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#12B76A] disabled:opacity-60"
>>>>>>> origin/main
      >
        {loading ? "Signing in..." : "Continue to dashboard"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>

    </div>
  );
}

export function CreateAccountForm() {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<OAuthProvider | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError(authConfigMissingMessage());
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: workEmail.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          organization: organization.trim(),
        },
        emailRedirectTo: callbackUrl(nextPathFromLocation()),
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // also create lead in database
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName.trim(),
        email: workEmail.trim(),
        organization: organization.trim(),
        source: "signup",
        interest: "Account access request",
      }),
    }).catch(() => null);

    window.location.href = nextPathFromLocation();
  }

  async function handleOAuth(provider: OAuthProvider) {
    setProviderLoading(provider);
    setError("");
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError(authConfigMissingMessage());
      setProviderLoading(null);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl(nextPathFromLocation()),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setError(error.message);
      setProviderLoading(null);
    }
  }

  return (
    <div className="mt-6 grid gap-5">
      <div className="grid gap-3">
        <ProviderButton
          provider="google"
          label="Sign up with Google"
          loading={providerLoading === "google"}
          disabled={Boolean(providerLoading) || loading}
          onClick={() => handleOAuth("google")}
        />
      </div>

      <div className="flex items-center gap-3">
<<<<<<< HEAD
        <span className="h-px flex-1 bg-[#e4e4e7]" />
        <span className="text-xs font-bold uppercase tracking-wide text-[#71717a]">or create with email</span>
        <span className="h-px flex-1 bg-[#e4e4e7]" />
=======
        <span className="h-px flex-1 bg-[#E5E5E7]" />
        <span className="text-xs font-bold uppercase tracking-wide text-[#8a958e]">or create with email</span>
        <span className="h-px flex-1 bg-[#E5E5E7]" />
>>>>>>> origin/main
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label
          className="text-xs font-bold uppercase tracking-wide text-[#71717a]"
          htmlFor="fullName"
        >
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          suppressHydrationWarning
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          required
<<<<<<< HEAD
          className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
=======
          className="rounded-md border border-[#E5E5E7] bg-white px-4 py-3 text-sm text-[#06130c] outline-none focus:border-[#0F8F5A]"
>>>>>>> origin/main
        />
      </div>
      <div className="grid gap-2">
        <label
          className="text-xs font-bold uppercase tracking-wide text-[#71717a]"
          htmlFor="workEmail"
        >
          Work email
        </label>
        <input
          id="workEmail"
          type="email"
          suppressHydrationWarning
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          placeholder="name@institution.com"
          required
<<<<<<< HEAD
          className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
=======
          className="rounded-md border border-[#E5E5E7] bg-white px-4 py-3 text-sm text-[#06130c] outline-none focus:border-[#0F8F5A]"
>>>>>>> origin/main
        />
      </div>
      <div className="grid gap-2">
        <label
          className="text-xs font-bold uppercase tracking-wide text-[#71717a]"
          htmlFor="organization"
        >
          Organization
        </label>
        <input
          id="organization"
          type="text"
          suppressHydrationWarning
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Firm or company name"
<<<<<<< HEAD
          className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
=======
          className="rounded-md border border-[#E5E5E7] bg-white px-4 py-3 text-sm text-[#06130c] outline-none focus:border-[#0F8F5A]"
>>>>>>> origin/main
        />
      </div>
      <div className="grid gap-2">
        <label
          className="text-xs font-bold uppercase tracking-wide text-[#71717a]"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          suppressHydrationWarning
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create password"
          required
<<<<<<< HEAD
          className="rounded-md border border-[#d4d4d8] bg-white px-4 py-3 text-sm text-[#09090b] outline-none focus:border-[#18181b]"
=======
          className="rounded-md border border-[#E5E5E7] bg-white px-4 py-3 text-sm text-[#06130c] outline-none focus:border-[#0F8F5A]"
>>>>>>> origin/main
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        suppressHydrationWarning
        disabled={loading || Boolean(providerLoading)}
<<<<<<< HEAD
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#18181b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3f3f46] disabled:opacity-60"
=======
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#0F8F5A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#12B76A] disabled:opacity-60"
>>>>>>> origin/main
      >
        {loading ? "Creating account..." : "Create account"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
    </div>
  );
}

function ProviderButton({
  provider,
  label,
  loading,
  disabled,
  onClick,
}: {
  provider: OAuthProvider;
  label: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={onClick}
      disabled={disabled}
<<<<<<< HEAD
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#d4d4d8] bg-white px-4 py-2.5 text-sm font-bold text-[#18181b] transition hover:border-[#18181b] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
=======
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#E5E5E7] bg-white px-4 py-2.5 text-sm font-bold text-[#0F8F5A] transition hover:border-[#0F8F5A] hover:bg-[#F5F5F6] disabled:cursor-not-allowed disabled:opacity-60"
>>>>>>> origin/main
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
<<<<<<< HEAD
        <span className="flex h-4 w-4 items-center justify-center rounded-full text-sm font-black text-[#18181b]">G</span>
=======
        <span className="flex h-4 w-4 items-center justify-center rounded-full text-sm font-black text-[#0F8F5A]">G</span>
>>>>>>> origin/main
      )}
      {label}
    </button>
  );
}
