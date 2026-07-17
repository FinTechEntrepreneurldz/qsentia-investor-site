import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { configuredAdminEmails, resolveAdminRole, roleFromUserMetadata } from '@/lib/adminAccess';

const PREVIEW_COOKIE = 'qsentia_local_preview';

function isLocalRequest(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = forwardedHost || request.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

function previewUser(): User {
  return {
    id: 'local-preview-user',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'preview@qsentia.local',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'preview' },
    user_metadata: {
      full_name: 'QSentia Preview',
      organization: 'Local preview',
      admin_role: 'super_admin',
    },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  } as User;
}

export function isAdminUser(user: User | null | undefined) {
  if (!user) return false;
  const email = user.email?.toLowerCase() || '';
  return Boolean(roleFromUserMetadata(user)) || configuredAdminEmails().has(email);
}

export function adminRoleLabel(user: User | null | undefined) {
  if (!user) return null;
  const role = roleFromUserMetadata(user);
  if (role) return role;
  return configuredAdminEmails().has(user.email?.toLowerCase() || '') ? 'super_admin' : null;
}

export async function getRequestUser(request: NextRequest) {
  if (isLocalRequest(request) && request.cookies.get(PREVIEW_COOKIE)?.value === '1') {
    return previewUser();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function unauthorizedAdminResponse(request: NextRequest) {
  const user = await getRequestUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!(await resolveAdminRole(user))) {
    return NextResponse.json(
      { error: 'Admin role required' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return null;
}
