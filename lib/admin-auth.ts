import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'sn_admin_session';
const SESSION_SECONDS = 60 * 60 * 24 * 365;
function secret() { const value = process.env.ADMIN_SESSION_SECRET; if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters'); return value; }
function signature(payload: string) { return createHmac('sha256', secret()).update(payload).digest('hex'); }
export function createSession() { const payload = `${Date.now() + SESSION_SECONDS * 1000}`; return `${payload}.${signature(payload)}`; }
export async function isAdmin() {
  try {
    const jar = await cookies(); const value = jar.get(COOKIE)?.value; if (!value) return false;
    const [payload, sig] = value.split('.'); if (!payload || !sig || Number(payload) < Date.now()) return false;
    const expected = signature(payload);
    return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}
export const adminCookieName = COOKIE;
