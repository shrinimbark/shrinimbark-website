import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readRepoFile, saveRepoFile } from '@/lib/github-content';
import { departments } from '@/lib/site';

export const dynamic = 'force-dynamic';
const types = ['acharya','saint','devotee','scholar','place','ashram','temple','text','commentary','practice','event','media'] as const;
const validType = (v:string) => (types as readonly string[]).includes(v);
const validSlug = (v:string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) && v.length <= 80;
const base = (type:string) => `content/records/${type}`;

export async function GET(request:Request) {
  const {searchParams}=new URL(request.url);
  const type=searchParams.get('type')||'';
  const slug=searchParams.get('slug');
  if(!validType(type)) return NextResponse.json({error:'अमान्य अभिलेख प्रकार।'},{status:400});
  if(slug && !validSlug(slug)) return NextResponse.json({error:'अमान्य संकेताक्षर।'},{status:400});
  if(slug) {
    if(!await isAdmin()) return NextResponse.json({error:'लॉगिन आवश्यक है।'},{status:401});
    try { const raw=await readRepoFile(`${base(type)}/${slug}.json`); return NextResponse.json({record:raw?JSON.parse(raw):null}); }
    catch(e){return NextResponse.json({error:e instanceof Error?e.message:'अभिलेख नहीं पढ़ा जा सका।'},{status:500});}
  }
  try {
    const owner=process.env.GITHUB_OWNER||'shrinimbark', repo=process.env.GITHUB_REPO||'shrinimbark-website', branch=process.env.GITHUB_BRANCH||'main', token=process.env.GITHUB_CONTENT_TOKEN;
    if(!token) throw new Error('GITHUB_CONTENT_TOKEN कॉन्फ़िगर नहीं है।');
    const res=await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json'},cache:'no-store'});
    if(!res.ok) throw new Error(`GitHub सूची त्रुटि (${res.status})`);
    const tree=await res.json();
    const paths=(tree.tree||[]).filter((x:{path:string;type:string})=>x.type==='blob'&&x.path.startsWith(base(type)+'/')&&x.path.endsWith('.json')).map((x:{path:string})=>x.path);
    const records=await Promise.all(paths.map(async(path:string)=>{const raw=await readRepoFile(path);if(!raw)return null;try{const r=JSON.parse(raw);return {slug:path.split('/').pop()?.replace(/\.json$/,''),...r};}catch{return null;}}));
    return NextResponse.json({records:records.filter(Boolean)});
  } catch(e){return NextResponse.json({error:e instanceof Error?e.message:'सूची नहीं मिली।'},{status:502});}
}

export async function PUT(request:Request) {
  if(!await isAdmin()) return NextResponse.json({error:'लॉगिन आवश्यक है।'},{status:401});
  const d=await request.json().catch(()=>null);
  if(!d||!validType(d.type)||!validSlug(String(d.slug||''))||!d.title||typeof d.title!=='string') return NextResponse.json({error:'प्रकार, संकेताक्षर और शीर्षक आवश्यक हैं।'},{status:400});
  const translations=(v:unknown)=>{const x=v&&typeof v==='object'?v as Record<string,unknown>:{};return {hi:String(x.hi||''),sa:String(x.sa||''),en:String(x.en||'')};};
  const record={slug:d.slug,type:d.type,status:d.status==='published'?'published':'draft',title:translations(d.title),summary:translations(d.summary),body:translations(d.body),category:String(d.category||''),image:String(d.image||''),location:String(d.location||''),related:Array.isArray(d.related)?d.related.map(String).slice(0,30):[],source:String(d.source||''),updatedAt:new Date().toISOString()};
  try {await saveRepoFile(`${base(d.type)}/${d.slug}.json`,JSON.stringify(record,null,2),`Save ${record.status} record: ${record.title.hi||record.title.en}`);return NextResponse.json({ok:true,message:'अभिलेख सुरक्षित कर दिया गया है।'});}
  catch(e){return NextResponse.json({error:e instanceof Error?e.message:'सुरक्षित नहीं हो सका।'},{status:500});}
}
