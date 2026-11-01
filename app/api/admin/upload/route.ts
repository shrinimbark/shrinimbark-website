import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { saveRepoFile } from '@/lib/github-content';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const form = await request.formData(); const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'फ़ाइल चुनें।' }, { status: 400 });
  if (file.size === 0) return NextResponse.json({ error: 'चुनी गई फ़ाइल खाली है। कृपया मूल चित्र फिर से चुनें।' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'अधिकतम 8 MB की फ़ाइल अपलोड करें।' }, { status: 400 });
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowed = ['jpg','jpeg','png','webp','pdf']; if (!allowed.includes(ext)) return NextResponse.json({ error: 'केवल JPG, PNG, WEBP और PDF फ़ाइलें स्वीकार हैं।' }, { status: 400 });
  const safe = `${Date.now()}-${file.name.normalize('NFKD').replace(/[^a-zA-Z0-9.-]/g, '-').slice(-70)}`;
  const path = `public/uploads/${safe}`;
  try { const bytes = Buffer.from(await file.arrayBuffer()); if (bytes.length !== file.size) throw new Error('चित्र पूरा प्राप्त नहीं हुआ। कृपया पुनः अपलोड करें।'); await saveRepoFile(path, bytes.toString('base64'), `Upload media: ${safe}`, true); return NextResponse.json({ ok: true, url: `/uploads/${safe}` }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'अपलोड असफल रहा।' }, { status: 500 }); }
}
