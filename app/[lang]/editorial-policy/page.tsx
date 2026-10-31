import Link from 'next/link';
import { notFound } from 'next/navigation';
import { languages, type Lang } from '@/lib/site';

export function generateStaticParams(){ return languages.map(lang => ({lang})); }

export default async function EditorialPolicyPage({params}:{params:Promise<{lang:Lang}>}) {
  const {lang}=await params; if(!languages.includes(lang)) notFound();
  const en=lang==='en'; const sa=lang==='sa';
  const title=en?'Editorial and Source Policy':sa?'सम्पादनस्रोतनीतिः':'सम्पादकीय एवं स्रोत-प्रामाणिकता नीति';
  const intro=en?'The platform is an independent public knowledge and heritage initiative. Its purpose is to preserve and present material responsibly, with clear distinctions between documented evidence, traditional accounts and material still under review.':sa?'अयं मञ्चः स्वतन्त्रः सार्वजनिकः ज्ञान-धरोहर-उपक्रमः अस्ति। प्रमाणितसाक्ष्यं, परम्परागतवृत्तान्तं, समीक्षाधीनं च साहित्यं पृथक् दर्शयित्वा सामग्रीरक्षणं प्रस्तुतीकरणं च अस्य उद्देशः।':'यह मंच एक स्वतंत्र सार्वजनिक ज्ञान एवं विरासत परियोजना है। इसका उद्देश्य सामग्री का जिम्मेदारी से संरक्षण और प्रस्तुतीकरण करना है। प्रमाणित ऐतिहासिक साक्ष्य, परम्परागत मान्यताएँ और अभी समीक्षा में चल रही सामग्री—इनके बीच स्पष्ट अन्तर रखा जाएगा।';
  const points=en?[
    ['Identifiable sources','Published claims should carry the available author, title, edition, publisher, page, folio, inscription number or verse reference.'],
    ['No invented completion','Illegible, damaged or missing manuscript text will be marked as unclear or missing. It will not be completed by assumption.'],
    ['Tradition and history','A traditional account will be identified as a traditional account. It will not automatically be presented as independently established historical fact.'],
    ['Ritual accuracy','Mantra, nyasa, yantra and worship procedures will be transcribed with care. Unverified readings and variant practices will be identified, not silently harmonised.'],
    ['Corrections and review','Corrections may be submitted with supporting references. Reviewed material may be updated with a revision date and editorial note.'],
    ['Free public access','The platform is intended to make its published educational and heritage material publicly accessible without a paywall.']
  ]:sa?[
    ['स्रोतपरिचयः','प्रकाशितकथनेषु यथालभ्यं लेखकः, ग्रन्थनाम, संस्करणम्, प्रकाशकः, पृष्ठम्, पत्रम्, अभिलेखसङ्ख्या वा श्लोकसन्दर्भः दातव्यः।'],
    ['अनुमानेन पाठपूरणं न','अस्पष्टः, भग्नः, लुप्तः वा पाण्डुलिपिपाठः तथैव चिह्नितः भविष्यति। अनुमानतः न पूर्यते।'],
    ['परम्परा इतिहासश्च','परम्परागतवृत्तान्तः परम्परागतवृत्तान्तत्वेनैव निर्देक्ष्यते; स्वतन्त्रेण सिद्धः इतिहासः इति न स्वतः प्रतिपाद्यते।'],
    ['कर्मकाण्डशुद्धिः','मन्त्रः, न्यासः, यन्त्रम्, पूजाविधानं च सावधानतया लिख्यते। अप्रमाणितः पाठभेदः स्पष्टतया सूच्यते।'],
    ['संशोधनं समीक्षा च','प्रमाणसहिताः संशोधनसूचनाः स्वीक्रियन्ते। समीक्षितसामग्री संशोधनतिथ्या सम्पादकीयटिप्पण्या च अद्यतनं कर्तुं शक्यते।'],
    ['निःशुल्कोपलब्धिः','प्रकाशितं शैक्षिकं सांस्कृतिकं च साहित्यं शुल्करहितं सार्वजनिकोपलब्धं कर्तुम् अयं मञ्चः प्रवर्तते।']
  ]:[
    ['पहचाने जा सकने वाले स्रोत','प्रकाशित दावों के साथ उपलब्ध लेखक, ग्रन्थ-नाम, संस्करण, प्रकाशक, पृष्ठ, पाण्डुलिपि-पत्र, अभिलेख संख्या अथवा श्लोक-सन्दर्भ दिया जाएगा।'],
    ['अनुमान से पाठ पूरा नहीं होगा','अस्पष्ट, खण्डित अथवा लुप्त पाण्डुलिपि-पाठ को स्पष्ट रूप से चिह्नित किया जाएगा। उसे अनुमान से पूरा नहीं किया जाएगा।'],
    ['परम्परा और इतिहास में अन्तर','परम्परागत वृत्तान्त को परम्परागत वृत्तान्त के रूप में ही पहचाना जाएगा। उसे स्वतः स्वतंत्र रूप से प्रमाणित ऐतिहासिक तथ्य नहीं कहा जाएगा।'],
    ['कर्मकाण्डीय शुद्धता','मन्त्र, न्यास, यन्त्र और पूजन-विधान सावधानी से उतारे जाएँगे। अप्रमाणित पाठ अथवा विभिन्न परम्परागत पाठों को छिपाकर एकरूप नहीं किया जाएगा।'],
    ['समीक्षा एवं संशोधन','सन्दर्भ सहित सुधार-सुझाव स्वीकार किए जाएँगे। समीक्षा के बाद सामग्री में संशोधन-तिथि और सम्पादकीय टिप्पणी जोड़ी जा सकेगी।'],
    ['निःशुल्क सार्वजनिक सामग्री','मंच की प्रकाशित शैक्षिक एवं सांस्कृतिक सामग्री सार्वजनिक रूप से बिना शुल्क उपलब्ध कराने का उद्देश्य है।']
  ];
  return <main className="inner-page"><div className="inner-hero"><div className="eyebrow">SHRI NIMBARKA SAMPRADAYA · EDITORIAL CHARTER</div><h1>{title}</h1><p>{intro}</p><div className="breadcrumb"><Link href={`/${lang}`}>{en?'Home':sa?'मुखपृष्ठम्':'मुखपृष्ठ'}</Link><span>/</span>{title}</div></div><div className="policy-list">{points.map(([heading,body],i)=><section className="policy-item" key={heading}><span>{String(i+1).padStart(2,'0')}</span><div><h2>{heading}</h2><p>{body}</p></div></section>)}</div><div className="back-home"><Link href={`/${lang}`}>{en?'Return to home':sa?'मुखपृष्ठं प्रति':'मुखपृष्ठ पर लौटें'}</Link></div></main>;
}
