export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import Link from 'next/link';
import {notFound} from 'next/navigation';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import type {Lang} from '@/lib/site';
const labels:Record<string,string>={acharya:'आचार्य',saint:'सन्त',devotee:'भक्त',scholar:'विद्वान',place:'तीर्थ एवं स्थान',ashram:'आश्रम एवं पीठ',temple:'मन्दिर',text:'ग्रन्थ',commentary:'भाष्य एवं टीका',practice:'उपासना पद्धति',event:'समाचार एवं उत्सव',media:'मीडिया'};
const pick=(v:any,l:Lang)=>v?.[l]||v?.hi||v?.en||'';
export default async function RecordDetail({params}:{params:Promise<{lang:Lang;type:string;slug:string}>}){
 const {lang,type,slug}=await params;if(!labels[type]||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))notFound();
 let r:any=null;try{r=JSON.parse(await readFile(path.join(process.cwd(),'content','records',type,slug+'.json'),'utf8'))}catch{notFound()}
 if(r.status!=='published')notFound();
 return <main className="inner-page"><header className="inner-hero"><div className="eyebrow">{labels[type]}</div><h1>{pick(r.title,lang)}</h1><p>{pick(r.summary,lang)}</p><div className="breadcrumb"><Link href={`/${lang}/directory/${type}`}>{labels[type]}</Link></div></header><article className="article-prose inner-content">{r.image&&<img className="topic-article-image" src={r.image} alt={pick(r.title,lang)}/ >}{pick(r.body,lang).split(/\n\s*\n/).filter(Boolean).map((p:string,i:number)=><p key={i}>{p}</p>)}{r.related?.length>0&&r.relatedType&&<section style={{marginTop:28,padding:18,border:'1px solid #d7c59f',background:'#fffaf0'}}><h2 style={{fontSize:20,color:'#4b1728'}}>सम्बद्ध सामग्री</h2>{r.related.map((relatedSlug:string)=><p key={relatedSlug}><Link href={`/${lang}/directory/${r.relatedType}/${relatedSlug}`}>{lang==='en'?'Open related record':lang==='sa'?'सम्बद्धलेखं पश्यतु':'सम्बद्ध प्रविष्टि देखें'} ↗</Link></p>)}</section>}{r.location&&<p><strong>स्थान:</strong> {r.location}</p>}{r.source&&<p><strong>स्रोत:</strong> {r.source}</p>}</article></main>;
}
