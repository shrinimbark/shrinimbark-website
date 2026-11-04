export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, FileText, ShieldCheck } from 'lucide-react';
import { departments, languages, type Lang, departmentTitle } from '@/lib/site';

export function generateStaticParams() {
  return languages.flatMap(lang => departments.flatMap(section =>
    section.items.map((_, index) => ({ lang, section: section.slug, topic: `topic-${String(index + 1).padStart(2, '0')}` }))
  ));
}

function renderInline(text: string) {
  const tokenPattern = /(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g;
  return text.split(tokenPattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      if (/^(https?:\/\/|mailto:)/i.test(href)) return <a key={index} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{label}</a>;
      if (href.startsWith('/') && !href.startsWith('//')) return <Link key={index} href={href}>{label}</Link>;
    }
    return <span key={index}>{part}</span>;
  });
}

function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\r?\n\s*\r?\n/).map(block => block.trim()).filter(Boolean);
  return <div className="article-prose">{blocks.map((block, index) => {
    const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const first = lines[0] || '';
    if (first.startsWith('### ')) return <h3 key={index}>{renderInline(first.slice(4))}</h3>;
    if (first.startsWith('## ')) return <h2 key={index}>{renderInline(first.slice(3))}</h2>;
    if (first.startsWith('# ')) return <h2 className="article-heading" key={index}>{renderInline(first.slice(2))}</h2>;
    if (first.startsWith('- ')) return <p className="article-list-item" key={index}>• {renderInline(first.slice(2))}</p>;
    const isVerse = lines.some(line => /[॥।]$/.test(line)) && lines.length > 1;
    return <p className={isVerse ? "article-verse" : undefined} key={index}>{lines.map((line, lineIndex) => <span key={lineIndex}>{renderInline(line)}{lineIndex < lines.length - 1 && (isVerse ? <br/> : ' ')}</span>)}</p>;
  })}</div>;
}

export default async function TopicPage({ params }: { params: Promise<{ lang: Lang; section: string; topic: string }> }) {
  const { lang, section, topic } = await params;
  const department = departments.find(item => item.slug === section);
  const match = /^topic-(\d{2})$/.exec(topic);
  const index = match ? Number(match[1]) - 1 : -1;
  if (!department || index < 0 || index >= department.items.length) notFound();
  const defaultTitle = department.items[index];
  let article: { title?: string; summary?: string; body?: string; status?: string; source?: string; author?: string; image?: string; pdf?: string } | null = null;
  try { article = JSON.parse(await readFile(path.join(process.cwd(), 'content', 'articles', lang, section, `${topic}.json`), 'utf8')); } catch { article = null; }
  const published = article?.status === 'published';
  const title = published && article?.title ? article.title : defaultTitle;
  const departmentName = departmentTitle(department, lang);
  const isEnglish = lang === 'en';
  const isSanskrit = lang === 'sa';
  const labels = isEnglish ? {
    home: 'Home', department: 'Department', intro: 'Topic record', status: 'Publication status', pending: 'Preparation in progress',
    source: 'Source and citation record', sourceText: 'Original text, author, edition, publisher, page or verse reference will be recorded here when the source has been examined.',
    accuracy: 'Editorial standard', accuracyText: 'No historical, doctrinal or ritual statement will be published without an identifiable source. Unclear or damaged passages will be marked as such rather than reconstructed by guesswork.',
    metadata: 'Bibliographic details', fields: ['Author / compiler', 'Original work / source', 'Edition / publisher', 'Page / verse / folio', 'Language', 'Review status'],
    back: 'Back to department', note: 'This page is a structured topic record. Its subject-matter article has not yet been published.'
  } : isSanskrit ? {
    home: 'मुखपृष्ठम्', department: 'विभागः', intro: 'विषय-अभिलेखः', status: 'प्रकाशनस्थितिः', pending: 'सज्जीकरणं प्रचलति',
    source: 'मूलस्रोतः सन्दर्भश्च', sourceText: 'मूलग्रन्थः, रचयिता, संस्करणम्, प्रकाशकः, पृष्ठम् अथवा श्लोकसन्दर्भः स्रोतपरीक्षणानन्तरम् अत्र लेखिष्यते।',
    accuracy: 'सम्पादकीयमानदण्डः', accuracyText: 'प्रमाणरहितं ऐतिहासिकं, दार्शनिकं वा कर्मकाण्डसम्बद्धं कथनं न प्रकाशयिष्यते। अस्पष्टः खण्डितः वा पाठः अनुमानतः न पूर्यते, अपि तु तथैव चिह्नितः भविष्यति।',
    metadata: 'ग्रन्थविवरणम्', fields: ['रचयिता / सङ्कलकः', 'मूलग्रन्थः / स्रोतः', 'संस्करणम् / प्रकाशकः', 'पृष्ठम् / श्लोकः / पत्रम्', 'भाषा', 'समीक्षास्थितिः'],
    back: 'विभागं प्रति निवर्तताम्', note: 'अयं विषयस्य संरचितः अभिलेखः। अस्य विषयस्य विस्तृतः लेखः अद्यापि न प्रकाशितः।'
  } : {
    home: 'मुखपृष्ठ', department: 'विभाग', intro: 'विषय अभिलेख', status: 'प्रकाशन स्थिति', pending: 'सामग्री तैयारी में',
    source: 'मूल स्रोत एवं सन्दर्भ', sourceText: 'मूल ग्रन्थ, लेखक, संस्करण, प्रकाशक, पृष्ठ अथवा श्लोक-सन्दर्भ का विवरण स्रोत की जाँच के बाद यहाँ दर्ज किया जाएगा।',
    accuracy: 'सम्पादकीय मानक', accuracyText: 'बिना पहचाने जा सकने वाले स्रोत के ऐतिहासिक, दार्शनिक अथवा कर्मकाण्ड सम्बन्धी दावे प्रकाशित नहीं किए जाएँगे। अस्पष्ट या खण्डित पाठ को अनुमान से पूरा करने के बजाय वैसा ही चिह्नित किया जाएगा।',
    metadata: 'ग्रन्थ-सन्दर्भ विवरण', fields: ['लेखक / संकलक', 'मूल ग्रन्थ / स्रोत', 'संस्करण / प्रकाशक', 'पृष्ठ / श्लोक / पत्र', 'भाषा', 'समीक्षा स्थिति'],
    back: 'विभाग में लौटें', note: 'यह पृष्ठ विषय का व्यवस्थित अभिलेख है। इस विषय पर विस्तृत लेख अभी प्रकाशित नहीं हुआ है।'
  };
  return <main className="inner-page">
    <div className="inner-hero"><div className="eyebrow">SHRI NIMBARKA SAMPRADAYA · {department.no} · {String(index + 1).padStart(2, '0')}</div><h1>{title}</h1><p>{department.desc}</p><div className="breadcrumb"><Link href={`/${lang}`}>{labels.home}</Link><span>/</span><Link href={`/${lang}/${section}`}>{departmentName}</Link><span>/</span>{labels.intro}</div></div>
    <div className="topic-detail-wrap"><article className="topic-detail-main"><div className="topic-status"><span className="status-dot"/><div><small>{labels.status}</small><strong>{published ? (isEnglish ? 'Published' : isSanskrit ? 'प्रकाशितम्' : 'प्रकाशित') : labels.pending}</strong></div></div>{published ? <><p className="topic-note">{article?.summary}</p>{article?.image && <img className="topic-article-image" src={article.image} alt={title}/>}<ArticleBody body={article?.body || ""}/>{article?.pdf && <p><a className="text-link" href={article.pdf} target="_blank" rel="noreferrer">PDF / ग्रन्थ खोलें <FileText size={15}/></a></p>}{(article?.author || article?.source) && <section className="detail-panel"><h2>ग्रन्थ-सन्दर्भ एवं लेखक</h2><p>{article?.author}</p><p>{article?.source}</p></section>}</> : <p className="topic-note">{labels.note}</p>}<section className="detail-panel"><div className="detail-panel-heading"><BookOpen/><h2>{labels.source}</h2></div><p>{labels.sourceText}</p><div className="bibliography-grid">{labels.fields.map(field => <div className="bibliography-field" key={field}><span>{field}</span><strong>—</strong></div>)}</div></section><section className="detail-panel"><div className="detail-panel-heading"><ShieldCheck/><h2>{labels.accuracy}</h2></div><p>{labels.accuracyText}</p><Link className="text-link" href={`/${lang}/editorial-policy`}>{isEnglish ? 'Read the editorial policy' : isSanskrit ? 'सम्पादननीतिं पठतु' : 'सम्पादकीय नीति पढ़ें'} <FileText size={15}/></Link></section><Link className="back-topic" href={`/${lang}/${section}`}><ArrowLeft size={16}/>{labels.back}</Link></article><aside className="topic-detail-aside"><div className="aside-box"><span className="eyebrow">DEPARTMENT</span><h3>{departmentName}</h3><p>{department.desc}</p></div><div className="aside-box"><h3>{isEnglish ? 'Public access' : isSanskrit ? 'सार्वजनिकोपलब्धिः' : 'सार्वजनिक उपलब्धता'}</h3><p>{isEnglish ? 'All published material on this platform is intended to remain freely accessible.' : isSanskrit ? 'अस्मिन् मञ्चे प्रकाशितं सर्वं साहित्यं निःशुल्कं सार्वजनिकोपलब्धं भविष्यति।' : 'इस मंच पर प्रकाशित सामग्री सार्वजनिक एवं निःशुल्क उपलब्ध कराने का उद्देश्य है।'}</p></div></aside></div>
  </main>;
}
