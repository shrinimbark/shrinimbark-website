'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUp,Eye,EyeOff,ExternalLink,Image as ImageIcon,MousePointer2,RefreshCw,Save} from 'lucide-react';
import SiteDesignEditor from '@/components/SiteDesignEditor';
import HomePageEditor from '@/components/HomePageEditor';
import FeatureCardsEditor from '@/components/FeatureCardsEditor';
import DepartmentVisualEditor from '@/components/DepartmentVisualEditor';
import RecordManager from '@/components/RecordManager';

type Pick={label:string;selector:string;kind:'design'|'home'|'cards'|'departments'|'records';tag:string;href?:string};
const classify=(raw:Element):Pick=>{
 const el=raw.tagName==='IMG'&&raw.parentElement?raw.parentElement:raw;
 const link=raw.closest('a') as HTMLAnchorElement|null;
 const href=link?.getAttribute('href')||undefined;
 const card=el.closest('.department-card,.feature-card');
 const section=el.closest('.department-section,.acharya-band,.feature-section,.home-news-strip,.home-calendar-grid,.home-social-strip,.lower-panels,.closing-quote,footer,.masthead,article')||el;
 const c=String((section as HTMLElement).className||'');
 if(card?.classList.contains('department-card')||c.includes('department-section'))return {label:card?'विभाग कार्ड':'मुख्य विभाग',selector:card?'.department-card':'.department-section',kind:'departments',tag:'विभाग',href};
 if(c.includes('acharya-band'))return {label:'आचार्य परिचय',selector:'.acharya-band',kind:'home',tag:'आचार्य खण्ड',href};
 if(card?.classList.contains('feature-card')||c.includes('feature-section'))return {label:card?'विशेष संग्रह कार्ड':'विशेष संग्रह',selector:card?'.feature-card':'.feature-section',kind:'cards',tag:'विशेष संग्रह',href};
 if(c.includes('home-news-strip'))return {label:'समाचार सूचना पट्टी',selector:'.home-news-strip',kind:'design',tag:'समाचार',href};
 if(c.includes('home-calendar-grid'))return {label:'पञ्चाङ्ग खण्ड',selector:'.home-calendar-grid',kind:'design',tag:'पञ्चाङ्ग',href};
 if(c.includes('home-social-strip'))return {label:'सामाजिक माध्यम',selector:'.home-social-strip',kind:'design',tag:'सामाजिक माध्यम',href};
 if(c.includes('lower-panels'))return {label:'निचले सूचना खण्ड',selector:'.lower-panels',kind:'design',tag:'निचले खण्ड',href};
 if(c.includes('closing-quote'))return {label:'समापन मंगल-वाक्य',selector:'.closing-quote',kind:'home',tag:'समापन',href};
 if(c.includes('masthead')||c.includes('topbar')||c.includes('mainnav'))return {label:'शीर्ष भाग / मुख्य परिचय',selector:'.masthead',kind:'design',tag:'शीर्ष भाग',href};
 if(c.includes('footer')||el.tagName==='FOOTER')return {label:'पादलेख',selector:'footer',kind:'design',tag:'पादलेख',href};
 if(el.closest('article')||el.closest('.article-body'))return {label:'लेख / विषय सामग्री',selector:'article',kind:'records',tag:'लेख',href};
 return {label:'चयनित वेबसाइट तत्व',selector:el.tagName.toLowerCase(),kind:'home',tag:el.tagName.toLowerCase(),href};
};
export default function VisualSiteEditor(){
 const frame=useRef<HTMLIFrameElement>(null);
 const [selected,setSelected]=useState<Pick|null>(null),[hidden,setHidden]=useState(false),[notice,setNotice]=useState('वेबसाइट के वास्तविक दृश्य में किसी खण्ड या सामग्री पर क्लिक करें।'),[lang,setLang]=useState('hi');
 const attach=useCallback(()=>{
  const doc=frame.current?.contentDocument;if(!doc)return;
  doc.querySelectorAll('[data-admin-picked]').forEach(e=>{e.removeAttribute('data-admin-picked');(e as HTMLElement).style.outline='';});
  const style=doc.getElementById('visual-admin-style')||doc.createElement('style');style.id='visual-admin-style';style.textContent='[data-admin-hover="1"]{outline:2px dashed #c49a52!important;outline-offset:2px;cursor:crosshair!important}[data-admin-picked="1"]{outline:3px solid #a46b22!important;outline-offset:3px;position:relative;z-index:9999}';doc.head.appendChild(style);
  const over=(e:Event)=>{const t=e.target as Element|null;const el=t?.closest('section,header,footer,nav,article,.department-card,.feature-card,.lower-panel,.home-calendar-card,h1,h2,h3,p,img,a');if(el&&el!==doc.body)el.setAttribute('data-admin-hover','1');};
  const out=(e:Event)=>{const t=e.target as Element|null;t?.closest('[data-admin-hover="1"]')?.removeAttribute('data-admin-hover');};
  const click=(e:Event)=>{const t=e.target as Element|null;const el=t?.closest('section,header,footer,nav,article,.department-card,.feature-card,.lower-panel,.home-calendar-card,h1,h2,h3,p,img,a');if(!el||el===doc.body)return;e.preventDefault();e.stopPropagation();doc.querySelectorAll('[data-admin-picked="1"]').forEach(x=>x.removeAttribute('data-admin-picked'));el.setAttribute('data-admin-picked','1');const p=classify(el);setSelected(p);setHidden(getComputedStyle(el).display==='none');setNotice('चयनित स्थान: '+p.label);};
  doc.addEventListener('mouseover',over,true);doc.addEventListener('mouseout',out,true);doc.addEventListener('click',click,true);
  return()=>{doc.removeEventListener('mouseover',over,true);doc.removeEventListener('mouseout',out,true);doc.removeEventListener('click',click,true);};
 },[]);
 useEffect(()=>{let clean:(()=>void)|undefined;const t=setTimeout(()=>{clean=attach();},500);return()=>{clearTimeout(t);clean?.();};},[attach,lang]);
 const refresh=()=>{if(frame.current)frame.current.src='/'+lang+'?visualEditor='+Date.now();setSelected(null);setNotice('वेबसाइट का नवीनतम दृश्य लोड किया जा रहा है…');};
 const goToLink=()=>{if(!selected?.href||!frame.current)return;const path=selected.href.startsWith('http')?selected.href:'/'+lang+(selected.href.startsWith('/')?selected.href:'/'+selected.href);frame.current.src=path;setSelected(null);setNotice('चयनित लिंक का पृष्ठ खोला जा रहा है।');};
 const move=(direction:-1|1)=>{
  const doc=frame.current?.contentDocument;if(!doc||!selected)return;
  const el=doc.querySelector('[data-admin-picked="1"]') as HTMLElement|null;if(!el)return;
  const parent=el.parentElement;if(!parent)return;
  const siblings=Array.from(parent.children).filter(x=>x!==el&&getComputedStyle(x).display!=='none');
  const index=siblings.indexOf(direction<0?el.previousElementSibling as Element:el.nextElementSibling as Element);
  if(direction<0&&el.previousElementSibling)parent.insertBefore(el,el.previousElementSibling);
  if(direction>0&&el.nextElementSibling)parent.insertBefore(el.nextElementSibling,el);
  setNotice('पूर्वावलोकन में क्रम बदला गया है। स्थायी क्रम सुरक्षित करने के लिए सज्जा एवं विन्यास में खण्ड-क्रम भी सुरक्षित करें।');
 };
 const togglePreview=()=>{const doc=frame.current?.contentDocument;const el=doc?.querySelector('[data-admin-picked="1"]') as HTMLElement|null;if(!el)return;el.style.display=hidden?'':'none';setHidden(!hidden);setNotice('यह दृश्य परिवर्तन अभी केवल पूर्वावलोकन में है।');};
 return <section className="visual-admin">
  <div className="visual-admin-head"><div><strong>दृश्य वेबसाइट सम्पादक</strong><p>वेबसाइट को उसी रूप में देखें और जिस स्थान को बदलना हो, उसी पर क्लिक करें।</p></div><div className="visual-admin-tools"><select value={lang} onChange={e=>{setLang(e.target.value);setSelected(null);}} aria-label="भाषा"><option value="hi">हिन्दी</option><option value="sa">संस्कृत</option><option value="en">English</option></select><button type="button" onClick={refresh}><RefreshCw size={15}/> पुनः लोड</button><a href={'/'+lang} target="_blank" rel="noreferrer"><ExternalLink size={15}/> अलग खोलें</a></div></div>
  <div className="visual-admin-grid">
   <div className="visual-admin-screen"><div className="visual-admin-screenbar"><span><i/> वास्तविक वेबसाइट दृश्य · {lang.toUpperCase()}</span><small>किसी भी खण्ड, चित्र या पाठ पर क्लिक करें</small></div><iframe ref={frame} key={lang} src={'/'+lang+'?visualEditor=1'} title="वास्तविक वेबसाइट पूर्वावलोकन" onLoad={()=>{setTimeout(attach,250);}} /></div>
   <aside className="visual-admin-side"><div className="visual-admin-sidehead"><MousePointer2 size={17}/><strong>चयनित स्थान का संपादन</strong></div>
    {!selected?<div className="visual-admin-empty"><MousePointer2 size={30}/><strong>पहले वेबसाइट में कोई स्थान चुनें</strong><p>बाईं ओर वेबसाइट के किसी खण्ड, कार्ड, चित्र या शीर्षक पर क्लिक करें। उसी के अनुसार संपादन के विकल्प यहाँ खुलेंगे।</p></div>:<>
     <div className="visual-admin-selection"><small>आपने यह चुना है</small><strong>{selected.label}</strong><span>{selected.tag}</span></div>
     <div className="visual-admin-actions">{selected.href&&<button type="button" onClick={goToLink}><ExternalLink size={15}/> इस लिंक पर जाएँ</button>}<button type="button" onClick={()=>move(-1)}><ArrowUp size={15}/> ऊपर</button><button type="button" onClick={()=>move(1)}><ArrowDown size={15}/> नीचे</button><button type="button" onClick={togglePreview}>{hidden?<Eye size={15}/>:<EyeOff size={15}/>} {hidden?'दिखाएँ':'छिपाएँ'}</button></div>
     <div className="visual-admin-note">{notice}</div>
     <div className="visual-admin-editor">
      {selected.kind==='design'&&<SiteDesignEditor/>}
      {selected.kind==='home'&&<HomePageEditor/>}
      {selected.kind==='cards'&&<FeatureCardsEditor/>}
      {selected.kind==='departments'&&<DepartmentVisualEditor/>}
      {selected.kind==='records'&&<RecordManager/>}
     </div>
    </>}
   </aside>
  </div>
  <div className="visual-admin-foot"><ImageIcon size={15}/><span>नोट: वेबसाइट का दृश्य वास्तविक पृष्ठ से आता है। ऊपर/नीचे और छिपाएँ/दिखाएँ अभी तत्काल दृश्य पूर्वावलोकन पर लागू होते हैं; स्थायी रूप से सुरक्षित करने का नियंत्रण संबंधित संपादन में उपलब्ध होगा।</span></div>
 </section>;
}
