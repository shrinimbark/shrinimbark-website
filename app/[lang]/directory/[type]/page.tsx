export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { departments, languages, type Lang } from '@/lib/site';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const types:Record<string,{hi:string;en:string;sa:string}>={acharya:{hi:'आचार्य',en:'Acharyas',sa:'आचार्याः'},saint:{hi:'सन्त',en:'Saints',sa:'सन्तः'},devotee:{hi:'भक्त',en:'Devotees',sa:'भक्ताः'},scholar:{hi:'विद्वान',en:'Scholars',sa:'विद्वांसः'},place:{hi:'तीर्थ एवं स्थान',en:'Sacred Places',sa:'तीर्थस्थानानि'},ashram:{hi:'आश्रम एवं पीठ',en:'Ashrams & Peethas',sa:'आश्रमाः पीठाश्च'},temple:{hi:'मन्दिर',en:'Temples',sa:'मन्दिराणि'},text:{hi:'ग्रन्थ',en:'Texts',sa:'ग्रन्थाः'},commentary:{hi:'भाष्य एवं टीका',en:'Commentaries',sa:'भाष्याणि टीकाश्च'},practice:{hi:'उपासना पद्धति',en:'Practices',sa:'उपासनापद्धतयः'},event:{hi:'समाचार एवं उत्सव',en:'News & Events',sa:'समाचाराः उत्सवाश्च'},media:{hi:'मीडिया',en:'Media',sa:'माध्यमानि'}};
const title=(v:any,l:Lang)=>v?.[l]||v?.hi||v?.en||'';
export function generateStaticParams(){return languages.flatMap(lang=>Object.keys(types).map(type=>({lang,type})));}
export default async function RecordDirectory({params}:{params:Promise<{lang:Lang;type:string}>}){
 const {lang,type}=await params;if(!types[type])notFound();
 let records:any[]=[];try{const {readdir,readFile}=await import('node:fs/promises');const dir=path.join(process.cwd(),'content','records',type);for(const file of await readdir(dir)){if(file.endsWith('.json')){try{records.push(JSON.parse(await readFile(path.join(dir,file),'utf8')))}catch{}}}}catch{}
 const label=types[type][lang];
 return <main className="inner-page"><header className="inner-hero"><div className="eyebrow">SHRI NIMBARKA SAMPRADAYA</div><h1>{label}</h1><p>{lang==='en'?'A structured directory of verified records and detailed profiles.':lang==='sa'?'प्रमाणितविवरणानां क्रमबद्धा निर्देशिका।':'विषयवार परिचय, विवरण एवं प्रमाण-आधारित अभिलेख।'}</p><div className="breadcrumb"><Link href={`/${lang}`}>{lang==='en'?'Home':'मुखपृष्ठ'}</Link></div></header><section className="inner-content"><div className="topic-grid">{records.filter(r=>r.status==='published').map(r=><Link className="topic-card" key={r.slug} href={`/${lang}/directory/${type}/${r.slug}`}><div><h3>{title(r.title,lang)}</h3><p>{title(r.summary,lang)}</p><span className="coming-soon">{lang==='en'?'Read more ↗':'विस्तार से पढ़ें ↗'}</span></div></Link>)}</div>{!records.length&&<p>{lang==='en'?'Records will appear here after publication.':'प्रकाशन के बाद प्रविष्टियाँ यहाँ दिखाई देंगी।'}</p>}</section></main>;
}
