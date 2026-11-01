export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
import HomePage from '@/components/HomePage'; import {type Lang} from '@/lib/site';
export default async function Page({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return <HomePage lang={lang}/>}
