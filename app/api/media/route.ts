import {NextResponse} from 'next/server';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(request:Request){
  const file=new URL(request.url).searchParams.get('file')||'';
  if(!/^[a-zA-Z0-9._-]{1,120}$/.test(file)||file.includes('..'))return new NextResponse('Invalid media name',{status:400});
  const owner=process.env.GITHUB_OWNER||'shrinimbark';
  const repo=process.env.GITHUB_REPO||'shrinimbark-website';
  const branch=process.env.GITHUB_BRANCH||'main';
  const token=process.env.GITHUB_CONTENT_TOKEN;
  if(!token)return new NextResponse('Media storage is not configured',{status:503});
  const url=`https://api.github.com/repos/${owner}/${repo}/contents/public/uploads/${encodeURIComponent(file)}?ref=${encodeURIComponent(branch)}`;
  const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},cache:'no-store'});
  if(!response.ok)return new NextResponse('Media not found',{status:response.status===404?404:502});
  const data=await response.json();
  if(data.type!=='file'||typeof data.content!=='string')return new NextResponse('Invalid media file',{status:404});
  const bytes=Buffer.from(data.content.replace(/\n/g,''),'base64');
  const ext=file.split('.').pop()?.toLowerCase();
  const type=ext==='png'?'image/png':ext==='webp'?'image/webp':ext==='jpg'||ext==='jpeg'?'image/jpeg':ext==='pdf'?'application/pdf':'application/octet-stream';
  return new NextResponse(bytes,{headers:{'Content-Type':type,'Content-Length':String(bytes.length),'Cache-Control':'public, max-age=3600, stale-while-revalidate=86400','X-Content-Type-Options':'nosniff'}});
}
