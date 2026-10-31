import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { saveRepoFile, readRepoFile } from '@/lib/github-content';
const langs = ['hi','sa','en'];
const slugOk = /^[a-z0-9-]{2,80}$/;
export async function GET(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const { searchParams } = new URL(request.url); const lang = searchParams.get('lang') || 'hi'; const slug = searchParams.get('slug') || '';
  if (!langs.includes(lang) || !slugOk.test(slug)) return NextResponse.json({ error: 'अमान्य विषय।' }, { status: 400 });
  try { const content = await readRepoFile(`content/articles/${lang}/${slug}.json`); return NextResponse.json({ content: content ? JSON.parse(content) : null }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'सामग्री नहीं पढ़ी जा सकी।' }, { status: 500 }); }
}
export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!data || !langs.includes(data.lang) || !slugOk.test(data.slug || '') || typeof data.title !== 'string' || !data.title.trim() || typeof data.body !== 'string') return NextResponse.json({ error: 'शीर्षक, भाषा, विषय-स्लग और लेख आवश्यक हैं।' }, { status: 400 });
  const record = { lang: data.lang, slug: data.slug, title: data.title.trim(), summary: String(data.summary || '').slice(0, 1000), body: data.body, status: data.status === 'published' ? 'published' : 'draft', source: String(data.source || '').slice(0, 3000), author: String(data.author || '').slice(0, 200), updatedAt: new Date().toISOString(), image: String(data.image || '').slice(0, 500), pdf: String(data.pdf || '').slice(0, 500) };
  try { await saveRepoFile(`content/articles/${record.lang}/${record.slug}.json`, JSON.stringify(record, null, 2), `${record.status === 'published' ? 'Publish' : 'Save draft'}: ${record.title}`); return NextResponse.json({ ok: true, message: 'सामग्री सुरक्षित कर दी गई है। वेबसाइट कुछ क्षण में अपडेट होगी।' }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'सामग्री सुरक्षित नहीं हो सकी।' }, { status: 500 }); }
}
