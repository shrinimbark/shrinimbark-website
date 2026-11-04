import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OWNER = process.env.GITHUB_OWNER || 'shrinimbark';
const REPO = process.env.GITHUB_REPO || 'shrinimbark-website';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}$/.test(filename) || filename.includes('..')) {
    return NextResponse.json({ error: 'अमान्य चित्र-पथ।' }, { status: 400 });
  }
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/public/uploads/${encodeURIComponent(filename)}`;
  try {
    const upstream = await fetch(url, { cache: 'no-store' });
    if (!upstream.ok) return NextResponse.json({ error: upstream.status === 404 ? 'चित्र उपलब्ध नहीं है।' : 'चित्र प्राप्त नहीं हो सका।' }, { status: upstream.status === 404 ? 404 : 502 });
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(contentType)) return NextResponse.json({ error: 'यह मान्य चित्र फ़ाइल नहीं है।' }, { status: 415 });
    return new Response(upstream.body, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return NextResponse.json({ error: 'चित्र सर्वर से प्राप्त नहीं हो सका।' }, { status: 502 });
  }
}
