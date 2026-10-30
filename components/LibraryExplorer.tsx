'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Filter } from 'lucide-react';
import { libraryItems } from '@/lib/content';

export default function LibraryExplorer({lang}:{lang:string}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('सभी विभाग');
  const categories=['सभी विभाग',...Array.from(new Set(libraryItems.map(x=>x.category)))];
  const results=useMemo(()=>libraryItems.filter(x=>(category==='सभी विभाग'||x.category===category)&&`${x.title} ${x.category} ${x.language} ${x.note}`.toLowerCase().includes(query.toLowerCase())),[query,category]);
  return <div className="library-explorer">
    <div className="library-controls"><label className="library-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="शीर्षक, विषय या भाषा से खोजें…" aria-label="पुस्तकालय खोज"/></label><label className="library-filter"><Filter size={16}/><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="विभाग चुनें">{categories.map(c=><option key={c}>{c}</option>)}</select></label></div>
    <p className="library-count">{results.length} अभिलेख प्रदर्शित · यह प्रारम्भिक सूची है; इसे प्रमाणित डिजिटल ग्रन्थ-संग्रह न समझें।</p>
    <div className="library-list">{results.map(item=><article className="library-item" key={item.id}><div className="library-icon"><BookOpen size={22}/></div><div className="library-item-copy"><span className="library-category">{item.category} · {item.kind}</span><h3>{item.title}</h3><p>{item.note}</p><div className="library-meta"><span>{item.language}</span><span>{item.status}</span></div></div></article>)}{results.length===0&&<div className="empty-state">इस खोज से कोई अभिलेख नहीं मिला। दूसरा शब्द या विभाग चुनें।</div>}</div>
    <div className="library-note"><strong>महत्त्वपूर्ण:</strong> इस संस्करण में डाउनलोड योग्य मूल ग्रन्थ या पाण्डुलिपियाँ अभी अपलोड नहीं की गई हैं। कॉपीराइट, पाठ-शुद्धता और स्रोत-सत्यापन के बाद ही प्रत्येक दस्तावेज़ सार्वजनिक किया जाएगा।</div>
  </div>;
}
