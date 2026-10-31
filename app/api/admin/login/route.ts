import { NextResponse } from 'next/server';
import { createSession, adminCookieName } from '@/lib/admin-auth';
import { timingSafeEqual } from 'node:crypto';
export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected || typeof password !== 'string') return NextResponse.json({ error: 'प्रशासन लॉगिन अभी कॉन्फ़िगर नहीं है।' }, { status: 503 });
  const a = Buffer.from(password); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'पासवर्ड सही नहीं है।' }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 12 });
  return response;
}
