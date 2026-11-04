import type { MetadataRoute } from 'next';
import { departments, languages } from '@/lib/site';

const base = 'https://shrinimbark.org';
const languageAlternates = Object.fromEntries(languages.map(lang => [lang, `${base}/${lang}`]));

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of languages) {
    entries.push({
      url: `${base}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: lang === 'hi' ? 1 : 0.9,
      alternates: { languages: languageAlternates },
    });
    for (const department of departments) {
      const departmentUrl = `${base}/${lang}/${department.slug}`;
      entries.push({
        url: departmentUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(languages.map(other => [other, `${base}/${other}/${department.slug}`])),
        },
      });
      department.items.forEach((_, index) => {
        const topic = `topic-${String(index + 1).padStart(2, '0')}`;
        entries.push({
          url: `${departmentUrl}/${topic}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
          alternates: {
            languages: Object.fromEntries(languages.map(other => [other, `${base}/${other}/${department.slug}/${topic}`])),
          },
        });
      });
    }
    entries.push({
      url: `${base}/${lang}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    });
  }
  return entries;
}
