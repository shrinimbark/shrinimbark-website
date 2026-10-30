import type { MetadataRoute } from 'next';
import {departments,languages} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap {
 const base='https://shrinimbark.org';
 const fixed=['about','contact','departments','library','parampara','editorial-policy','contribute'];
 return [
  ...languages.map(lang=>({url:`${base}/${lang}`,lastModified:new Date(),changeFrequency:'weekly' as const,priority:1})),
  ...languages.flatMap(lang=>departments.map(d=>({url:`${base}/${lang}/${d.slug}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:0.7}))),
  ...languages.flatMap(lang=>fixed.map(path=>({url:`${base}/${lang}/${path}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:0.5}))),
  {url:`${base}/privacy`,lastModified:new Date(),changeFrequency:'yearly',priority:0.2}
 ];
}
