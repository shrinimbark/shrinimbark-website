import SiteHeader from '@/components/SiteHeader'; import SiteFooter from '@/components/SiteFooter'; import { languages, type Lang } from '@/lib/site'; import { notFound } from 'next/navigation';
export function generateStaticParams(){return languages.map(lang=>({lang}));}
export default async function LanguageLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(!languages.includes(lang as Lang))notFound();return <><SiteHeader lang={lang as Lang}/>{children}<SiteFooter lang={lang as Lang}/></>}
