import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readRepoFile, saveRepoFile } from '@/lib/github-content';

const SETTINGS_PATH = 'content/settings/homepage.json';
const DEFAULT_IMAGE = '/images/radha-krishna-hero.jpg';

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  try {
    const raw = await readRepoFile(SETTINGS_PATH);
    const settings = raw ? JSON.parse(raw) : {};
    return NextResponse.json({ image: typeof settings.image === 'string' ? settings.image : DEFAULT_IMAGE });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'मुखपृष्ठ चित्र नहीं पढ़ा जा सका।' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const data = await request.json().catch(() => null);
  const image = typeof data?.image === 'string' ? data.image : '';
  if (!image || !/^\\/uploads\\/[a-zA-Z0-9._-]+$/.test(image) && !/^\\/images\\/[a-zA-Z0-9._-]+$/.test(image)) {
    return NextResponse.json({ error: 'मान्य वेबसाइट चित्र चुनें।' }, { status: 400 });
  }
  try {
    await saveRepoFile(SETTINGS_PATH, JSON.stringify({ image, updatedAt: new Date().toISOString() }, null, 2), 'Update homepage hero image');
    return NextResponse.json({ ok: true, message: 'मुखपृष्ठ का चित्र सुरक्षित हो गया है। वेबसाइट कुछ क्षण में अपडेट होगी।' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'चित्र सुरक्षित नहीं हो सका।' }, { status: 500 });
  }
}
