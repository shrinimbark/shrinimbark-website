'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Menu, X, Search, Languages, ArrowUpRight } from 'lucide-react';
import { departments, type Lang, langLabel } from '@/lib/site';
export default function SiteHeader({lang}:{lang:Lang}) {
 const [open,setOpen]=useState(false); const [menu,setMenu]=useState(false); const [search,setSearch]=useState(''); const pathname=usePathname();
 const languagePath=(target:Lang)=>pathname.replace(/^\/(hi|sa|en)(?=\/|$)/,`/${target}`);
 const filtered=useMemo(()=>departments.filter(d=>`${d.hi} ${d.en} ${d.sa} ${d.items.join(' ')}`.toLowerCase().includes(search.toLowerCase())),[search]);
 const label=(d:typeof departments[number])=>lang==='en'?d.en:lang==='sa'?d.sa:d.hi;
 return <>
  <div className="topbar"><span>॥ श्रीराधाकृष्णाभ्यां नमः ॥</span><div className="toplinks"><Link href={`/${lang}/about`}>{lang==='en'?'About':lang==='sa'?'परिचयः':'परिचय'}</Link><Link href={`/${lang}/contact`}>{lang==='en'?'Contact':'सम्पर्क'}</Link><span className="lang-switch"><Languages size={13}/>{(['hi','sa','en'] as Lang[]).map(l=><Link key={l} href={languagePath(l)} className={l===lang?'active':''}>{langLabel[l]}</Link>)}</span></div></div>
  <header className="masthead"><div className="mast-ornament">✥　❧　✥</div><div className="seal">श्री</div><p className="invocation">॥ श्रीराधाकृष्णाभ्यां नमः ॥</p><Link className="brand-hi" href={`/${lang}`}>श्रीनिम्बार्क सम्प्रदाय</Link><div className="brand-en">SHRI NIMBARKA SAMPRADAYA</div><div className="brand-tag">द्वैताद्वैत वेदान्त की दिव्य परम्परा</div><div className="mast-rule"><span>❖</span></div></header>
  <nav className="mainnav"><div className="nav-inner"><Link href={`/${lang}`} className="nav-home">{lang==='en'?'Home':'मुखपृष्ठ'}</Link><div className="nav-links">{departments.slice(0,6).map(d=><Link key={d.slug} href={`/${lang}/${d.slug}`}>{label(d)}</Link>)}<Link href={`/${lang}/departments`}>{lang==='en'?'All departments':'सभी विभाग'}</Link></div><button className="nav-search" aria-label="खोजें" onClick={()=>setOpen(!open)}><Search size={17}/></button><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label="मेनू">{menu?<X/>:<Menu/>}</button></div>{menu&&<div className="mobile-links">{departments.map(d=><Link key={d.slug} href={`/${lang}/${d.slug}`} onClick={()=>setMenu(false)}>{label(d)}</Link>)}<Link href={`/${lang}/library`} onClick={()=>setMenu(false)}>डिजिटल पुस्तकालय</Link><Link href={`/${lang}/editorial-policy`} onClick={()=>setMenu(false)}>सम्पादकीय नीति</Link></div>}</nav>
  {open&&<div className="search-panel"><div className="search-inner"><Search size={18}/><input autoFocus placeholder={lang==='en'?'Search texts, acharyas, philosophy or topics…':'ग्रन्थ, आचार्य, दर्शन अथवा विषय खोजें…'} value={search} onChange={e=>setSearch(e.target.value)}/><button aria-label="बन्द करें" onClick={()=>{setOpen(false);setSearch('')}}><X size={18}/></button></div>{search&&<div className="search-results">{filtered.map(d=><Link key={d.slug} href={`/${lang}/${d.slug}`} onClick={()=>setOpen(false)}>{label(d)}<span><ArrowUpRight size={13}/></span></Link>)}{filtered.length===0&&<p>कोई विभाग नहीं मिला।</p>}</div>}</div>}
 </>;
}
