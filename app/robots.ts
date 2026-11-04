import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/admin', '/api/'] },
    ],
    sitemap: 'https://shrinimbark.org/sitemap.xml',
    host: 'https://shrinimbark.org',
  };
}
