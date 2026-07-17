"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SessionPayload = {
  authenticated: boolean;
  user: null | {
    name?: string | null;
    email?: string | null;
  };
};

type MarketplaceAllocationCtaProps = {
  modelSlug: string;
  className: string;
  signedInLabel?: string;
  signedOutLabel?: string;
};

export function MarketplaceAllocationCta({
  modelSlug,
  className,
  signedInLabel = "Allocate from wallet",
  signedOutLabel = "Sign in to allocate",
}: MarketplaceAllocationCtaProps) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const modelHref = `/user/models/${modelSlug}`;
  const authenticated = Boolean(session?.authenticated && session.user);
  const sessionLoaded = session !== null;
  const href = authenticated || !sessionLoaded ? modelHref : `/signin?next=${encodeURIComponent(modelHref)}`;
  const label = !sessionLoaded ? "Checking access" : authenticated ? signedInLabel : signedOutLabel;

  useEffect(() => {
    let active = true;

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: SessionPayload) => {
        if (active) setSession(payload);
      })
      .catch(() => {
        if (active) setSession({ authenticated: false, user: null });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Link href={href} className={className} aria-busy={!sessionLoaded}>
      {label}
    </Link>
  );
}
