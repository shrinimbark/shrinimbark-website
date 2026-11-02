'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Landmark,BookOpen,Users,LibraryBig,Flower2,ScrollText,Globe2,ChevronDown,ChevronUp,Scroll,MapPin,Music,CalendarDays,Heart,Building2,BookMarked,Church,Sparkles} from 'lucide-react';
import type {Lang} from '@/lib/site';
const icons=[Landmark,BookOpen,Users,LibraryBig,Flower2,Landmark,ScrollText,Globe2];
const iconMap:Record<string,any>={Landmark,BookOpen,Users,LibraryBig,Flower2,ScrollText,Globe2,Scroll,MapPin,Music,CalendarDays,Heart,Building2,BookMarked,Church,Sparkles};
const descriptions:Record<string,{en:string;sa:string}>={
 sampradaya:{en:'The nature, history, lineage and distinctive features of the Nimbarka Sampradaya.',sa:'निम्बार्कसम्प्रदायस्य स्वरूपम्, इतिहासः, परम्परा, वैशिष्ट्यानि च।'},
 nimbarkacharya:{en:'The life, philosophy, teachings and lineage of Jagadguru Shri Nimbarkacharya.',sa:'जगद्गुरोः श्रीनिम्बार्काचार्यस्य जीवनम्, दर्शनम्, उपदेशाः, परम्परा च।'},
 parampara:{en:'A documented account of acharya–disciple lineages flowing from the Sanakadi tradition.',sa:'सनकादिपरम्परया प्रवहन्तीनाम् आचार्यशिष्यसम्बन्धानां प्रामाणिकं सङ्कलनम्।'},
 darshan:{en:'A study of Dvaitadvaita Vedanta, the three realities, devotion and the supreme goal of life.',sa:'द्वैताद्वैतवेदान्तस्य, तत्त्वत्रयस्य, भक्तेः, परमपुरुषार्थस्य च अध्ययनम्।'},
 granth:{en:'Foundational acharya works, commentaries, sub-commentaries, hymns and ritual manuals.',sa:'मूलाचार्यग्रन्थाः, भाष्याणि, टीकाः, स्तोत्राणि, पद्धतिग्रन्थाश्च।'},
 acharya:{en:'Biographical accounts of the Sampradaya’s acharyas, saints, scholars and commentators.',sa:'सम्प्रदायस्य आचार्याणां, सन्तानां, विदुषां, टीकाकाराणां च जीवनचरितसङ्ग्रहः।'},
 upasana:{en:'Worship of Purushottama Vasudeva Shri Krishna with Shri Rukmini, Shri Satyabhama and Shri Radhika; devotion and spiritual practice.',sa:'श्रीरुक्मिण्या, श्रीसत्यभामया, श्रीराधिकया च सहितस्य पुरुषोत्तमवासुदेवश्रीकृष्णस्य उपासना, भक्तिः साधना च।'},
 nityakarma:{en:'Vedic and Vaishnava Sandhya, ritual placements, daily worship and forms of divine service.',sa:'वैदिकी वैष्णवी च सन्ध्या, न्यासाः, नित्यपूजा, भगवत्सेवाविधानानि च।'},
 peeth:{en:'A directory of Peethas, monasteries, ashrams and temples associated with the Nimbarka tradition.',sa:'निम्बार्कपरम्परासम्बद्धानां पीठानां, मठानाम्, आश्रमाणां, मन्दिराणां च निर्देशिका।'},
 tirth:{en:'An account of Braj, sacred pilgrimage places and sites associated with acharyas and their spiritual practice.',sa:'ब्रजमण्डलस्य, पवित्रतीर्थानाम्, आचार्यसाधनास्थलानां च परिचयः।'},
 library:{en:'A collection of Sanskrit, Hindi and English works, manuscripts and audio resources.',sa:'संस्कृतहिन्द्यङ्ग्लभाषाग्रन्थानां, पाण्डुलिपीनाम्, श्रव्यसामग्रीणां च सङ्ग्रहः।'},
 research:{en:'Inscriptions, copper-plate records, historical documents and scholarly publications.',sa:'शिलालेखाः, ताम्रपत्राणि, ऐतिहासिकदस्तावेजाः, शोधप्रकाशनानि च।'},
 events:{en:'Acharya anniversaries, annual festivals, religious assemblies and publication news.',sa:'आचार्यजयन्त्यः, वार्षिकोत्सवाः, धर्मसभाः, प्रकाशनसमाचाराश्च।'},
 media:{en:'Lectures, devotional songs, Sanskrit recitations, picture galleries and documentaries.',sa:'प्रवचनानि, भजनानि, संस्कृतपाठाः, चित्रदीर्घाः, वृत्तचित्राणि च।'},
 global:{en:'A network of centres, scholars, researchers and volunteers in India and abroad.',sa:'भारते विदेशेषु च स्थितानां केन्द्राणाम्, विदुषाम्, शोधकर्तॄणां, स्वयंसेवकानां च जालम्।'},
 support:{en:'Book publication, translation, manuscript preservation and research support.',sa:'ग्रन्थप्रकाशनम्, अनुवादः, पाण्डुलिपिसंरक्षणम्, शोधसहयोगश्च।'}
};
export default function DepartmentExplorer({departments,lang}:{departments:any[];lang:Lang}){
 const [all,setAll]=useState(false); const [visuals,setVisuals]=useState<Record<string,{mode:string;icon:string;image:string}>>({});
 useEffect(()=>{fetch('/api/admin/department-visuals',{cache:'no-store'}).then(r=>r.json()).then(d=>setVisuals(d.visuals||{})).catch(()=>{});},[]);
 const shown=all?departments:departments.slice(0,8);
 return <div className="department-explorer"><div className="department-grid">{shown.map((d,i)=>{const cfg=visuals[d.slug];const Icon=iconMap[cfg?.icon]||icons[i%icons.length];const desc=lang==='en'?(descriptions[d.slug]?.en||d.desc):lang==='sa'?(descriptions[d.slug]?.sa||d.desc):d.desc;return <Link className="department-card" href={`/${lang}/${d.slug}`} key={d.slug}><span className="card-number">{d.no}</span>{!cfg||cfg.mode==='none'?null:cfg.mode==='image'&&cfg.image?<img className="department-custom-image" src={cfg.image} alt=""/>:<Icon className="department-icon" strokeWidth={1.35}/>}<h3>{lang==='en'?d.en:lang==='sa'?d.sa:d.hi}</h3><p>{desc}</p><span className="card-arrow"><ArrowUpRight size={16}/></span></Link>})}</div><div className="all-departments"><button type="button" onClick={()=>setAll(!all)}>{all?(lang==='en'?'Show fewer sections':lang==='sa'?'अल्पतरखण्डान् दर्शयतु':'कम विषय दिखाएँ'):(lang==='en'?'Explore all 16 sections':lang==='sa'?'सर्वान् षोडश खण्डान् पश्यतु':'अधिक देखें — सभी 16 खण्ड')} {all?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button></div></div>;
}
