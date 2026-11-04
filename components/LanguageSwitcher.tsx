'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {type Lang,langLabel} from '@/lib/site';

export default function LanguageSwitcher({lang}:{lang:Lang}){
 const pathname=usePathname()||`/${lang}`;
 const segments=pathname.split('/').filter(Boolean);
 const current=segments[0];
 const suffix=['hi','sa','en'].includes(current)?segments.slice(1):[];
 return <span className="lang-switch" aria-label="भाषा चुनें">{(['hi','sa','en'] as Lang[]).map(target=>{
  const href=`/${target}${suffix.length?`/${suffix.join('/')}`:''}`;
  return <Link key={target} href={href} hrefLang={target} lang={target} aria-current={target===lang?'page':undefined} className={target===lang?'active':''}>{langLabel[target]}</Link>;
 })}</span>;
}
