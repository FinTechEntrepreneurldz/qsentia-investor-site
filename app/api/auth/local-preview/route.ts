import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'qsentia_local_preview';

function isLocalRequest(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = forwardedHost || request.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export async function POST(request: NextRequest) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ error: 'Local preview login is only available on localhost.' }, { status: 403 });
  }

  const response = NextResponse.json(
    {
      ok: true,
      user: {
        name: 'QSentia Preview',
        email: 'preview@qsentia.local',
        provider: 'preview',
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );

  response.cookies.set(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 6,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  });
  return response;
}
