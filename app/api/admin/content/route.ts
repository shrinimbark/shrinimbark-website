import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { saveRepoFile, readRepoFile } from '@/lib/github-content';
import { departments } from '@/lib/site';

export const dynamic = 'force-dynamic';
const langs = ['hi','sa','en'];
const slugOk = /^topic-[a-z0-9-]{2,80}$/;
const validSection = (value: string) => departments.some(item => item.slug === value);

export async function GET(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'hi';
  const section = searchParams.get('section') || '';
  const slug = searchParams.get('slug') || '';
  if (!langs.includes(lang) || !validSection(section) || !slugOk.test(slug)) return NextResponse.json({ error: 'अमान्य विभाग या विषय।' }, { status: 400 });
  try {
    const content = await readRepoFile(`content/articles/${lang}/${section}/${slug}.json`);
    return NextResponse.json({ content: content ? JSON.parse(content) : null });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'सामग्री नहीं पढ़ी जा सकी।' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!data || !langs.includes(data.lang) || !validSection(data.section || '') || !slugOk.test(data.slug || '') || typeof data.title !== 'string' || !data.title.trim() || typeof data.body !== 'string') {
    return NextResponse.json({ error: 'शीर्षक, भाषा, विभाग, विषय-स्लग और लेख आवश्यक हैं।' }, { status: 400 });
  }
  const record = { lang: data.lang, section: data.section, slug: data.slug, title: data.title.trim(), summary: String(data.summary || '').slice(0, 1000), body: data.body, status: data.status === 'published' ? 'published' : 'draft', source: String(data.source || '').slice(0, 3000), author: String(data.author || '').slice(0, 200), updatedAt: new Date().toISOString(), image: String(data.image || '').slice(0, 500), pdf: String(data.pdf || '').slice(0, 500) };
  try {
    await saveRepoFile(`content/articles/${record.lang}/${record.section}/${record.slug}.json`, JSON.stringify(record, null, 2), `${record.status === 'published' ? 'Publish' : 'Save draft'}: ${record.title}`);
    return NextResponse.json({ ok: true, message: 'सामग्री सुरक्षित कर दी गई है। वेबसाइट कुछ क्षण में अपडेट होगी।' });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'सामग्री सुरक्षित नहीं हो सकी।' }, { status: 500 });
  }
}
