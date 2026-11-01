import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'लॉगिन आवश्यक है।' }, { status: 401 });
  const owner = process.env.GITHUB_OWNER || 'shrinimbark';
  const repo = process.env.GITHUB_REPO || 'shrinimbark-website';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) return NextResponse.json({ error: 'GITHUB_CONTENT_TOKEN कॉन्फ़िगर नहीं है।' }, { status: 500 });
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error(`GitHub सूची प्राप्त नहीं हुई (${response.status})`);
    const data = await response.json();
    const candidates = (data.tree || []).filter((item: { path?: string; type?: string }) =>
      item.type === 'blob' && /^content\/articles\/(hi|sa|en)\/([a-z0-9-]+)\/(topic-[a-z0-9-]+)\.json$/.test(item.path || '')
    );
    const files = await Promise.all(candidates.map(async (item: { path: string; url: string }) => {
      const match = /^content\/articles\/(hi|sa|en)\/([a-z0-9-]+)\/(topic-[a-z0-9-]+)\.json$/.exec(item.path);
      if (!match) return null;
      try {
        const blobResponse = await fetch(item.url, {
          headers: { Authorization: \`Bearer \${token}\`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
          cache: 'no-store'
        });
        if (!blobResponse.ok) return { lang: match[1], section: match[2], slug: match[3], path: item.path, title: match[3], status: 'draft' };
        const blob = await blobResponse.json();
        const content = JSON.parse(Buffer.from(blob.content || '', 'base64').toString('utf8'));
        return { lang: match[1], section: match[2], slug: match[3], path: item.path, title: String(content.title || match[3]), status: content.status === 'published' ? 'published' : 'draft' };
      } catch {
        return { lang: match[1], section: match[2], slug: match[3], path: item.path, title: match[3], status: 'draft' };
      }
    }));
    return NextResponse.json({ files, truncated: Boolean(data.truncated) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'सूची प्राप्त नहीं हो सकी।' }, { status: 502 });
  }
}
