import Link from 'next/link';
import { type Lang } from '@/lib/site';
import { readRepoFile } from '@/lib/github-content';

const defaults = {
  footerTitle: 'श्रीनिम्बार्क सम्प्रदाय',
  footerEnglish: 'SHRI NIMBARKA SAMPRADAYA',
  footerMantra: '॥ श्रीसर्वेश्वरो जयति ॥',
  footerDescription: 'शास्त्र, आचार्य परम्परा, उपासना एवं ऐतिहासिक धरोहर का प्रामाणिक डिजिटल संरक्षण।',
  footerGroup1: 'सम्प्रदाय', footerGroup2: 'ज्ञान एवं साधना', footerGroup3: 'सहायता एवं सम्पर्क',
  footerLink1: 'परिचय', footerLink2: 'श्रीनिम्बार्काचार्य', footerLink3: 'गुरु-परम्परा', footerLink4: 'दर्शन एवं सिद्धान्त',
  footerLink5: 'ग्रन्थ एवं शास्त्र', footerLink6: 'डिजिटल पुस्तकालय', footerLink7: 'उपासना एवं साधना', footerLink8: 'शोध एवं अभिलेखागार',
  footerLink9: 'पीठ एवं मन्दिर', footerLink10: 'वैश्विक परिवार', footerLink11: 'सहयोग', footerLink12: 'सम्पर्क करें',
  footerPath1:'/sampradaya', footerPath2:'/nimbarkacharya', footerPath3:'/parampara', footerPath4:'/darshan', footerPath5:'/granth', footerPath6:'/library', footerPath7:'/upasana', footerPath8:'/research', footerPath9:'/peeth', footerPath10:'/global', footerPath11:'/support', footerPath12:'/contact', footerPath13:'/admin',
  footerCopyright: 'सार्वजनिक ज्ञान एवं सांस्कृतिक संरक्षण हेतु', footerEditorial: 'सम्पादकीय नीति', footerPrivacy: 'गोपनीयता नीति', footerIntroVisible: true
};
const translations = {
 en: {
  footerTitle:'Shri Nimbarka Sampradaya', footerDescription:'Authentic digital preservation of scriptures, acharya lineage, worship and documented history.',
  footerGroup1:'The Sampradaya',footerGroup2:'Knowledge & Practice',footerGroup3:'Help & Contact',
  footerLink1:'Introduction',footerLink2:'Shri Nimbarkacharya',footerLink3:'Guru Parampara',footerLink4:'Philosophy & Siddhanta',
  footerLink5:'Scriptures & Texts',footerLink6:'Digital Library',footerLink7:'Worship & Sadhana',footerLink8:'Research & Archives',
  footerLink9:'Peethas & Temples',footerLink10:'Global Community',footerLink11:'Support',footerLink12:'Contact Us',
  footerCopyright:'For public knowledge and cultural preservation',footerEditorial:'Editorial Policy',footerPrivacy:'Privacy Policy'
 },
 sa: {
  footerTitle:'श्रीनिम्बार्कसम्प्रदायः',footerDescription:'शास्त्राणाम्, आचार्यपरम्परायाः, उपासनायाः, प्रमाणितेतिहासस्य च प्रामाणिकं अङ्कीयसंरक्षणम्।',
  footerGroup1:'सम्प्रदायः',footerGroup2:'ज्ञानं साधना च',footerGroup3:'सहायता सम्पर्कश्च',
  footerLink1:'परिचयः',footerLink2:'श्रीनिम्बार्काचार्यः',footerLink3:'गुरुपरम्परा',footerLink4:'दर्शनं सिद्धान्ताश्च',
  footerLink5:'ग्रन्थाः शास्त्राणि च',footerLink6:'अङ्कीयपुस्तकालयः',footerLink7:'उपासना साधना च',footerLink8:'अनुसन्धानम् अभिलेखाश्च',
  footerLink9:'पीठानि मन्दिराणि च',footerLink10:'वैश्विकपरिवारः',footerLink11:'सहयोगः',footerLink12:'सम्पर्कः',
  footerCopyright:'सार्वजनिकज्ञानस्य सांस्कृतिकसंरक्षणस्य च कृते',footerEditorial:'सम्पादकीयनीतिः',footerPrivacy:'गोपनीयतानीतिः'
 }
} as const;
const groups = [
  {heading:2,links:[11,12]}
];
type Settings = typeof defaults & Record<string, any>;
export default async function SiteFooter({lang}:{lang:Lang}) {
 let settings: Settings = defaults;
 try { const raw=await readRepoFile('content/settings/site-design.json'); if(raw) settings={...defaults,...JSON.parse(raw)}; } catch {}
 const localized = (key:keyof typeof defaults) => {
  const translated = lang==='hi' ? undefined : (translations[lang] as any)[key];
  const explicit = lang==='en' ? settings[`${key}En`] : lang==='sa' ? settings[`${key}Sa`] : undefined;
  return String(explicit || translated || settings[key] || defaults[key]);
 };
 const path = (key:string,fallback:string) => String(settings[key] || fallback).trim() || fallback;
 const href = (value:string) => value.startsWith('http://') || value.startsWith('https://') ? value : value==='/admin' ? value : `/${lang}${value.startsWith('/')?value:`/${value}`}`;
 const headings=[localized('footerGroup1'),localized('footerGroup2'),localized('footerGroup3')];
 return <footer className="footer">
  {settings.footerIntroVisible!==false&&<div className="footer-top"><div className="footer-emblem">श्री</div><h2>{localized('footerTitle')}</h2><p>{settings.footerEnglish}</p><div className="footer-mantra">{settings.footerMantra}</div><p className="footer-desc">{localized('footerDescription')}</p></div>}
  <div className="footer-columns">{groups.map((group,i)=><div key={i}><h3>{headings[group.heading]}</h3>{group.links.map((n,j)=>{const label=localized((`footerLink${n}`) as keyof typeof defaults);const dest=path(`footerPath${n}`,defaults[(`footerPath${n}`) as keyof typeof defaults] as string);return <Link key={n} href={href(dest)}>{label}</Link>})}</div>)}</div>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} {localized('footerTitle')}</span><span>{localized('footerCopyright')}</span><Link href={`/${lang}/editorial-policy`}>{localized('footerEditorial')}</Link><Link href="/privacy">{localized('footerPrivacy')}</Link></div>
 </footer>;
}
