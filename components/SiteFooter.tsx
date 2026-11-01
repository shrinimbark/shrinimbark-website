import Link from 'next/link';
import { type Lang } from '@/lib/site';
import { readRepoFile } from '@/lib/github-content';

const defaults = {
  footerTitle: 'श्रीनिम्बार्क सम्प्रदाय',
  footerEnglish: 'SHRI NIMBARKA SAMPRADAYA',
  footerMantra: '॥ श्रीसर्वेश्वरो जयति ॥',
  footerDescription: 'शास्त्र, आचार्य परम्परा, उपासना एवं ऐतिहासिक धरोहर का प्रामाणिक डिजिटल संरक्षण।',
  footerGroup1: 'सम्प्रदाय', footerGroup2: 'ज्ञान एवं साधना', footerGroup3: 'सम्पर्क',
  footerLink1: 'परिचय', footerLink2: 'श्रीनिम्बार्काचार्य', footerLink3: 'गुरु-परम्परा', footerLink4: 'दर्शन एवं सिद्धान्त',
  footerLink5: 'ग्रन्थ एवं शास्त्र', footerLink6: 'डिजिटल पुस्तकालय', footerLink7: 'उपासना एवं साधना', footerLink8: 'शोध एवं अभिलेखागार',
  footerLink9: 'पीठ एवं मन्दिर', footerLink10: 'वैश्विक परिवार', footerLink11: 'सहयोग', footerLink12: 'सम्पर्क करें', footerLink13: 'प्रशासक लॉगिन',
  footerPath1:'/sampradaya', footerPath2:'/nimbarkacharya', footerPath3:'/parampara', footerPath4:'/darshan', footerPath5:'/granth', footerPath6:'/library', footerPath7:'/upasana', footerPath8:'/research', footerPath9:'/peeth', footerPath10:'/global', footerPath11:'/support', footerPath12:'/contact', footerPath13:'/admin',
  footerCopyright: 'सार्वजनिक ज्ञान एवं सांस्कृतिक संरक्षण हेतु', footerEditorial: 'सम्पादकीय नीति', footerPrivacy: 'गोपनीयता नीति'
};
const destinations = [
  ['/sampradaya','/nimbarkacharya','/parampara','/darshan'],
  ['/granth','/library','/upasana','/research'],
  ['/peeth','/global','/support','/contact','/admin']
];
type FooterSettings = { [K in keyof typeof defaults]: string };
export default async function SiteFooter({lang}:{lang:Lang}) {
  let settings: FooterSettings = defaults;
  try { const raw = await readRepoFile('content/settings/site-design.json'); if (raw) settings = {...defaults, ...JSON.parse(raw)}; } catch {}
  const path = (key: string, fallback: string) => String((settings as any)[key] || fallback).trim() || fallback;
  const href = (value: string) => value.startsWith('http://') || value.startsWith('https://') ? value : value === '/admin' ? value : `/${lang}${value.startsWith('/') ? value : `/${value}`}`;
  const groups = [
    {title:settings.footerGroup1, labels:[settings.footerLink1,settings.footerLink2,settings.footerLink3,settings.footerLink4], paths:[path('footerPath1','/sampradaya'),path('footerPath2','/nimbarkacharya'),path('footerPath3','/parampara'),path('footerPath4','/darshan')]},
    {title:settings.footerGroup2, labels:[settings.footerLink5,settings.footerLink6,settings.footerLink7,settings.footerLink8], paths:[path('footerPath5','/granth'),path('footerPath6','/library'),path('footerPath7','/upasana'),path('footerPath8','/research')]},
    {title:settings.footerGroup3, labels:[settings.footerLink9,settings.footerLink10,settings.footerLink11,settings.footerLink12,settings.footerLink13], paths:[path('footerPath9','/peeth'),path('footerPath10','/global'),path('footerPath11','/support'),path('footerPath12','/contact'),path('footerPath13','/admin')]}
  ];
  return <footer className="footer">
    <div className="footer-top"><div className="footer-emblem">श्री</div><h2>{settings.footerTitle}</h2><p>{settings.footerEnglish}</p><div className="footer-mantra">{settings.footerMantra}</div><p className="footer-desc">{settings.footerDescription}</p></div>
    <div className="footer-columns">{groups.map((group,i)=><div key={i}><h3>{group.title}</h3>{group.labels.map((label,j)=><Link key={j} href={href(group.paths[j])}>{label}</Link>)}</div>)}</div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.footerTitle}</span><span>{settings.footerCopyright}</span><Link href={`/${lang}/editorial-policy`}>{settings.footerEditorial}</Link><Link href="/privacy">{settings.footerPrivacy}</Link></div>
  </footer>;
}
