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
 return <main className="inner-page"><header className="inner-hero"><div className="eyebrow">{labels[type]}</div><h1>{pick(r.title,lang)}</h1><p>{pick(r.summary,lang)}</p><div className="breadcrumb"><Link href={`/${lang}/directory/${type}`}>{labels[type]}</Link></div></header><article className="article-prose inner-content">{r.image&&<img className="topic-article-image" src={r.image} alt={pick(r.title,lang)}/ >}{pick(r.body,lang).split(/\n\s*\n/).filter(Boolean).map((p:string,i:number)=><p key={i}>{p}</p>)}{r.location&&<p><strong>स्थान:</strong> {r.location}</p>}{r.source&&<p><strong>स्रोत:</strong> {r.source}</p>}</article></main>;
}
