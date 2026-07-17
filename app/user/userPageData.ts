import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { InvestorUser } from "@/components/user/UserWorkspace";

const localPreviewHosts = new Set(["localhost", "127.0.0.1", "::1"]);

async function isLocalPreviewHost() {
  const headerStore = await headers();
  const host = headerStore.get("host")?.split(":")[0] ?? "";
  return localPreviewHosts.has(host);
}

export async function currentInvestor(): Promise<InvestorUser | null> {
  const cookieStore = await cookies();

  if ((await isLocalPreviewHost()) && cookieStore.get("qsentia_local_preview")?.value === "1") {
    return {
      name: "QSentia Preview",
      email: "preview@qsentia.local",
      organization: "Investor workspace",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        return;
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return {
    name: user.user_metadata?.full_name ?? user.email.split("@")[0] ?? "Investor",
    email: user.email,
    organization: user.user_metadata?.company ?? null,
  };
}
