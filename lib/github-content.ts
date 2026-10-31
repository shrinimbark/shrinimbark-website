const owner = process.env.GITHUB_OWNER || 'shrinimbark';
const repo = process.env.GITHUB_REPO || 'shrinimbark-website';
const branch = process.env.GITHUB_BRANCH || 'main';
function headers() {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) throw new Error('GITHUB_CONTENT_TOKEN is not configured in Vercel');
  return { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
}
export async function saveRepoFile(path: string, content: string, message: string, alreadyBase64 = false) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const current = await fetch(`${url}?ref=${branch}`, { headers: headers(), cache: 'no-store' });
  let sha: string | undefined;
  if (current.ok) sha = (await current.json()).sha;
  else if (current.status !== 404) throw new Error(`GitHub read failed (${current.status})`);
  const response = await fetch(url, { method: 'PUT', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ message, content: alreadyBase64 ? content : Buffer.from(content).toString('base64'), branch, ...(sha ? { sha } : {}) }) });
  if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.message || `GitHub save failed (${response.status})`); }
  return response.json();
}
export async function readRepoFile(path: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, { headers: headers(), cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`);
  const data = await response.json(); return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
}
