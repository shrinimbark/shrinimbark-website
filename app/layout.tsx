import type { Metadata } from 'next';
import './globals.css';
import './compact-home.css';

const siteTitle = 'श्रीनिम्बार्क सम्प्रदाय | Shri Nimbarka Sampradaya';
const siteDescription = 'निम्बार्क सम्प्रदाय का ज्ञान केन्द्र। द्वैताद्वैत वेदान्त, श्रीराधाकृष्ण युगलोपासना, आचार्य परम्परा, ग्रन्थ, उपासना एवं प्रमाणित इतिहास।';

export const metadata: Metadata = {
  metadataBase: new URL('https://shrinimbark.org'),
  title: { default: siteTitle, template: '%s | श्रीनिम्बार्क सम्प्रदाय' },
  description: siteDescription,
  applicationName: 'Shri Nimbarka Sampradaya',
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: 'https://shrinimbark.org',
    siteName: 'श्रीनिम्बार्क सम्प्रदाय',
    locale: 'hi_IN',
    type: 'website',
    images: [{ url: '/images/royal-homepage-reference.png', width: 1200, height: 630, alt: 'श्रीनिम्बार्क सम्प्रदाय — द्वैताद्वैत वेदान्त की दिव्य परम्परा' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/images/royal-homepage-reference.png'],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="hi"><body>{children}</body></html>;
}
