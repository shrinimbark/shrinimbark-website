import HomePage from '@/components/HomePage'; import {type Lang} from '@/lib/site';
export default async function Page({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return <HomePage lang={lang}/>}
