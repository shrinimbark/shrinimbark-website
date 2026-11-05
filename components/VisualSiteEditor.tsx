'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Eye,EyeOff,Image as ImageIcon,MousePointer2,RefreshCw,Save,Move,Maximize2} from 'lucide-react';

type Lang='hi'|'sa'|'en';
type Picked={el:HTMLElement;path:string;kind:'text'|'image'|'element';label:string};
const languageNames:Record<Lang,string>={hi:'हिन्दी',sa:'संस्कृत',en:'English'};
function selectorPath(el:Element){
 const parts:string[]=[];let node:Element|null=el;
 while(node&&node.tagName.toLowerCase()!=='html'){
  let part=node.tagName.toLowerCase();
  if(node.id){part+='#'+node.id;parts.unshift(part);break;}
  const classes=Array.from(node.classList).filter(x=>/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(x)).slice(0,2);
  if(classes.length)part+='.'+classes.join('.');
  const parent:HTMLElement|null=node.parentElement;
  if(parent){const peers=Array.from(parent.children).filter(x=>x.tagName===node!.tagName);if(peers.length>1)part+=':nth-of-type('+(peers.indexOf(node)+1)+')';}
  parts.unshift(part);node=parent;
 }
 return parts.join(' > ');
}
function directText(el:HTMLElement){return Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE) as Text|undefined;}
function setDirectText(el:HTMLElement,value:string){
 const node=directText(el);
 if(node)node.nodeValue=value;
 else el.insertBefore(el.ownerDocument.createTextNode(value),el.firstChild);
}
export default function VisualSiteEditor(){
 const frame=useRef<HTMLIFrameElement>(null);
 const selectedRef=useRef<Picked|null>(null);
 const overlayRef=useRef<HTMLDivElement|null>(null);
 const [lang,setLang]=useState<Lang>('hi');
 const [selected,setSelected]=useState<Picked|null>(null);
 const [text,setText]=useState('');
 const [image,setImage]=useState('');
 const [uploadBusy,setUploadBusy]=useState(false);
 const [font,setFont]=useState('inherit');
 const [size,setSize]=useState('18');
 const [color,setColor]=useState('#39252a');
 const [background,setBackground]=useState('transparent');
 const [weight,setWeight]=useState('400');
 const [lineHeight,setLineHeight]=useState('1.6');
 const [align,setAlign]=useState('left');
 const [width,setWidth]=useState('');
 const [height,setHeight]=useState('');
 const [hidden,setHidden]=useState(false);
 const [notice,setNotice]=useState('वेबसाइट में किसी भी पाठ, चित्र या वस्तु को चुनें।');
 const [busy,setBusy]=useState(false);
 const [dirty,setDirty]=useState(false);
 const [reload,setReload]=useState(0);
 const [device,setDevice]=useState<'desktop'|'mobile'>('desktop');

 const updateOverlay=useCallback(()=>{
  const overlay=overlayRef.current,el=selectedRef.current?.el;
  if(!overlay||!el||!el.isConnected)return;
  const r=el.getBoundingClientRect();
  overlay.style.left=Math.max(0,r.left)+'px';overlay.style.top=Math.max(0,r.top)+'px';
  overlay.style.width=Math.max(24,r.width)+'px';overlay.style.height=Math.max(24,r.height)+'px';
 },[]);

 const applyLive=useCallback(()=>{
  const item=selectedRef.current;if(!item)return;
  const el=item.el;
  if(item.kind==='text')setDirectText(el,text);
  if(item.kind==='image'&&image){if(el instanceof HTMLImageElement)el.src=image;else{const img=el.querySelector('img');if(img)img.src=image;}}
  if(size)el.style.setProperty('font-size',size+'px','important');
  if(font!=='inherit')el.style.setProperty('font-family',font,'important');
  if(color)el.style.setProperty('color',color,'important');
  if(background)el.style.setProperty('background-color',background==='transparent'?'transparent':background,'important');
  if(weight)el.style.setProperty('font-weight',weight,'important');
  if(lineHeight)el.style.setProperty('line-height',lineHeight,'important');
  if(align)el.style.setProperty('text-align',align,'important');
  if(width)el.style.setProperty('width',width+'px','important');
  if(height)el.style.setProperty('height',height+'px','important');
  if(item.kind==='image'){el.style.setProperty('object-fit','contain','important');el.style.setProperty('max-width','100%','important');}
  setDirty(true);requestAnimationFrame(updateOverlay);
 },[text,image,size,font,color,background,weight,lineHeight,align,width,height,updateOverlay]);

 const selectElement=useCallback((el:HTMLElement)=>{
  const doc=frame.current?.contentDocument;if(!doc)return;
  doc.querySelectorAll('[data-editor-picked="1"]').forEach(x=>x.removeAttribute('data-editor-picked'));
  el.setAttribute('data-editor-picked','1');
  const kind:Picked['kind']=el instanceof HTMLImageElement?'image':(['H1','H2','H3','H4','P','SPAN','STRONG','EM','SMALL','LABEL','A','BUTTON'].includes(el.tagName)?'text':'element');
  const item={el,path:selectorPath(el),kind,label:el.getAttribute('aria-label')||el.innerText?.trim().slice(0,70)||el.getAttribute('alt')||el.tagName.toLowerCase()};
  selectedRef.current=item;setSelected(item);
  setText(kind==='text'?(directText(el)?.nodeValue||el.innerText||''):'');
  const img=el instanceof HTMLImageElement?el:el.querySelector('img');
  setImage(img?.getAttribute('src')||'');
  const cs=getComputedStyle(el);setSize(String(Math.round(parseFloat(cs.fontSize)||18)));
  setFont(cs.fontFamily||'inherit');setColor(rgbHex(cs.color));setBackground(cs.backgroundColor==='rgba(0, 0, 0, 0)'?'transparent':rgbHex(cs.backgroundColor));
  setWeight(cs.fontWeight||'400');setLineHeight(cs.lineHeight==='normal'?'1.6':cs.lineHeight);setAlign(cs.textAlign||'left');
  setWidth(String(Math.round(el.getBoundingClientRect().width)));setHeight(String(Math.round(el.getBoundingClientRect().height)));
  setHidden(cs.display==='none');setDirty(false);setNotice('चयनित: '+item.label);requestAnimationFrame(updateOverlay);
 },[updateOverlay]);

 function rgbHex(v:string){const m=v.match(/\d+/g);if(!m||m.length<3)return '#39252a';return '#'+m.slice(0,3).map(x=>Number(x).toString(16).padStart(2,'0')).join('');}

 const bindFrame=useCallback(()=>{
  const doc=frame.current?.contentDocument;if(!doc)return;
  const style=doc.createElement('style');style.id='new-visual-editor-style';
  style.textContent='[data-editor-picked="1"]{outline:2px solid #b58b45!important;outline-offset:2px!important;cursor:move!important} body *{cursor:crosshair}';
  doc.getElementById(style.id)?.remove();doc.head.appendChild(style);
  const overlay=doc.createElement('div');overlay.dataset.editorOverlay='1';
  overlay.style.cssText='position:fixed;z-index:2147483647;pointer-events:none;box-sizing:border-box;border:2px solid #bd8c36;display:none;';
  const names=['nw','n','ne','e','se','s','sw','w','move'];
  names.forEach(name=>{
   const h=doc.createElement('button');h.type='button';h.dataset.handle=name;h.setAttribute('aria-label',name);
   const isMove=name==='move';const left=name.includes('w')?'-7px':name.includes('e')?'calc(100% - 5px)':name==='n'||name==='s'?'calc(50% - 5px)':isMove?'calc(50% - 13px)':'calc(50% - 5px)';
   const top=name.includes('n')?'-7px':name.includes('s')?'calc(100% - 5px)':name==='e'||name==='w'?'calc(50% - 5px)':isMove?'calc(50% - 13px)':'calc(50% - 5px)';
   h.style.cssText='position:absolute;left:'+left+';top:'+top+';width:'+(isMove?'26px':'10px')+';height:'+(isMove?'26px':'10px')+';padding:0;border:1px solid white;border-radius:'+(isMove?'50%':'2px')+';background:'+(isMove?'#4b1728':'#bd8c36')+';pointer-events:auto;touch-action:none;cursor:'+(isMove?'move':'nwse-resize')+';';
   overlay.appendChild(h);
  });
  doc.body.appendChild(overlay);overlayRef.current=overlay as unknown as HTMLDivElement;
  const reposition=()=>updateOverlay();
  const click=(ev:MouseEvent)=>{
   const target=ev.target as HTMLElement|null;if(!target||target.closest('[data-editor-overlay]'))return;
   const el=target.closest('img,h1,h2,h3,h4,h5,p,a,button,li,blockquote,figcaption,td,th,label,span,strong,em,small,section,article,header,footer,nav,div') as HTMLElement|null;
   if(!el||el===doc.body||el===doc.documentElement)return;
   ev.preventDefault();ev.stopPropagation();selectElement(el);
  };
  const drag=(ev:PointerEvent)=>{
   const handle=(ev.target as HTMLElement).closest('[data-handle]') as HTMLElement|null;
   const item=selectedRef.current;if(!handle||!item)return;
   ev.preventDefault();ev.stopPropagation();
   const el=item.el,mode=handle.dataset.handle||'move',startX=ev.clientX,startY=ev.clientY,r=el.getBoundingClientRect();
   const startW=r.width,startH=r.height,oldTransform=el.style.transform;
   const move=(e:PointerEvent)=>{
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(mode==='move'){
     el.style.setProperty('transform',(oldTransform&&oldTransform!=='none'?oldTransform+' ':'')+'translate('+dx+'px,'+dy+'px)','important');
    }else{
     let w=startW,h=startH;if(mode.includes('e'))w+=dx;if(mode.includes('w'))w-=dx;if(mode.includes('s'))h+=dy;if(mode.includes('n'))h-=dy;
     el.style.setProperty('width',Math.max(8,w)+'px','important');el.style.setProperty('height',Math.max(8,h)+'px','important');
     el.style.setProperty('max-width','none','important');el.style.setProperty('box-sizing','border-box','important');
    }
    updateOverlay();
   };
   const up=()=>{
    doc.removeEventListener('pointermove',move,true);doc.removeEventListener('pointerup',up,true);
    const rr=el.getBoundingClientRect();setWidth(String(Math.round(rr.width)));setHeight(String(Math.round(rr.height)));
    setDirty(true);setNotice('आकार या स्थान बदल गया है। अब “बदलाव सुरक्षित करें” दबाएँ।');
   };
   doc.addEventListener('pointermove',move,true);doc.addEventListener('pointerup',up,true);
  };
  doc.addEventListener('click',click,true);doc.addEventListener('pointerdown',drag,true);
  doc.addEventListener('scroll',reposition,true);doc.defaultView?.addEventListener('resize',reposition);
  return()=>{doc.removeEventListener('click',click,true);doc.removeEventListener('pointerdown',drag,true);doc.removeEventListener('scroll',reposition,true);doc.defaultView?.removeEventListener('resize',reposition);overlay.remove();};
 },[selectElement,updateOverlay]);

 useEffect(()=>{const f=frame.current;if(!f)return;f.onload=()=>{const cleanup=bindFrame();(f as any).__editorCleanup=cleanup;};return()=>{(f as any).__editorCleanup?.();};},[bindFrame,lang,reload]);

 useEffect(()=>{applyLive();},[applyLive]);

 const save=async()=>{
  const item=selectedRef.current;if(!item)return;setBusy(true);setNotice('बदलाव सुरक्षित हो रहे हैं…');
  try{
   const el=item.el,style:Record<string,string>={};
   const css=['fontSize','fontFamily','color','backgroundColor','fontWeight','lineHeight','textAlign','width','height','transform','boxSizing','maxWidth','objectFit'];
   css.forEach(k=>{const v=(el.style as any)[k];if(v)style[k]=v;});
   const payload:any={path:item.path,lang,style,hidden};
   if(item.kind==='text')payload.text=text;
   if(item.kind==='image'&&image)payload.image=image;
   const r=await fetch('/api/admin/visual-edits',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const d=await r.json();if(!r.ok)throw new Error(d.error||'बदलाव सुरक्षित नहीं हुआ।');
   setDirty(false);setNotice('सफलतापूर्वक सुरक्षित। सार्वजनिक वेबसाइट पर लागू होने में Vercel deployment का समय लग सकता है।');
  }catch(e){setNotice(e instanceof Error?e.message:'बदलाव सुरक्षित नहीं हुआ।');}finally{setBusy(false);}
 };
 const uploadImage=async(file?:File)=>{if(!file)return;setUploadBusy(true);try{const fd=new FormData();fd.append('file',file);const r=await fetch('/api/admin/upload',{method:'POST',body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error||'चित्र अपलोड नहीं हुआ।');setImage(d.url);setNotice('चित्र अपलोड हो गया। पूर्वावलोकन में लागू किया जा रहा है।');}catch(e){setNotice(e instanceof Error?e.message:'चित्र अपलोड नहीं हुआ।');}finally{setUploadBusy(false);}};
 const toggleHidden=()=>{const item=selectedRef.current;if(!item)return;const next=!hidden;setHidden(next);item.el.style.display=next?'none':'';setDirty(true);setNotice(next?'चयनित वस्तु छिपाई गई।':'चयनित वस्तु फिर दिखाई गई।');};
 const refresh=()=>{selectedRef.current=null;setSelected(null);setDirty(false);setReload(x=>x+1);setNotice('वेबसाइट का पूर्वावलोकन फिर से लोड हो रहा है।');};
 return <section className="new-editor">
  <header className="new-editor-head"><div><span>VISUAL WEBSITE EDITOR</span><h2>वेबसाइट को सीधे चुनकर संपादित करें</h2><p>किसी भी पाठ, चित्र या बॉक्स को चुनें। बदलाव तुरन्त पूर्वावलोकन में दिखेंगे।</p></div><div className="new-editor-actions"><select value={lang} onChange={e=>{setLang(e.target.value as Lang);setSelected(null);selectedRef.current=null;}}>{(Object.keys(languageNames) as Lang[]).map(k=><option key={k} value={k}>{languageNames[k]}</option>)}</select><button type="button" onClick={refresh}><RefreshCw size={15}/> पुनः लोड</button></div></header>
  <div className="new-editor-workspace">
   <div className="new-editor-stage"><div className="new-editor-stagebar"><span><span className="new-editor-dot"/> लाइव वेबसाइट पूर्वावलोकन</span><div><button type="button" className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')}>PC</button><button type="button" className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')}>मोबाइल</button></div></div><div className="new-editor-framewrap"><iframe key={lang+'-'+reload} ref={frame} title="लाइव वेबसाइट संपादन पूर्वावलोकन" src={'/'+lang+'?visualEditor=1'} style={{width:device==='mobile'?'390px':'100%',maxWidth:'100%',height:'100%',border:0,background:'#fff'}} onLoad={()=>{}}/></div><div className="new-editor-hint"><MousePointer2 size={14}/> क्लिक करके चुनें · बीच के गोल हैंडल से खिसकाएँ · किनारों से आकार बदलें</div></div>
   <aside className="new-editor-inspector"><div className="new-editor-inspector-title"><strong>चयनित वस्तु</strong><span>{selected?selected.label:'अभी कोई चयन नहीं'}</span></div>
    {!selected?<div className="new-editor-empty"><MousePointer2 size={30}/><p>पूर्वावलोकन में किसी भी वस्तु पर क्लिक करें। उसके संपादन विकल्प यहाँ खुलेंगे।</p></div>:<>
     {selected.kind==='text'&&<label>पाठ<textarea value={text} onChange={e=>setText(e.target.value)} rows={3}/></label>}
     {selected.kind==='image'&&<label>चित्र बदलें<input value={image} onChange={e=>setImage(e.target.value)} placeholder="/uploads/... या चित्र URL"/><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>uploadImage(e.target.files?.[0])} disabled={uploadBusy}/><small>{uploadBusy?'चित्र अपलोड हो रहा है…':'नया चित्र अपलोड करें या उसका पता दें।'}</small></label>}
     <div className="new-editor-grid"><label>फॉन्ट आकार (px)<input type="number" min="1" max="2000" value={size} onChange={e=>setSize(e.target.value)}/></label><label>चौड़ाई (px)<input type="number" min="8" max="3000" value={width} onChange={e=>setWidth(e.target.value)}/></label><label>ऊँचाई (px)<input type="number" min="8" max="3000" value={height} onChange={e=>setHeight(e.target.value)}/></label><label>मोटाई<select value={weight} onChange={e=>setWeight(e.target.value)}><option value="300">हल्की</option><option value="400">सामान्य</option><option value="500">मध्यम</option><option value="600">अर्ध-मोटी</option><option value="700">मोटी</option><option value="800">अधिक मोटी</option></select></label></div>
     <label>फॉन्ट परिवार<select value={font} onChange={e=>setFont(e.target.value)}><option value="inherit">मूल फॉन्ट</option><option value="'Noto Serif Devanagari',serif">Noto Serif Devanagari</option><option value="'Cormorant Garamond',serif">Cormorant Garamond</option><option value="serif">Serif</option><option value="sans-serif">Sans Serif</option><option value="Georgia,serif">Georgia</option></select></label>
     <div className="new-editor-grid"><label>अक्षर रंग<input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label><label>बैकग्राउंड<input type="color" value={background===''||background==='transparent'?'#ffffff':background} onChange={e=>setBackground(e.target.value)}/></label></div>
     <div className="new-editor-grid"><label>पंक्ति ऊँचाई<input value={lineHeight} onChange={e=>setLineHeight(e.target.value)} placeholder="1.6"/></label><label>पाठ संरेखण<select value={align} onChange={e=>setAlign(e.target.value)}><option value="left">बायाँ</option><option value="center">मध्य</option><option value="right">दायाँ</option><option value="justify">दोनों ओर</option></select></label></div>
     <div className="new-editor-buttonrow"><button type="button" onClick={toggleHidden}>{hidden?<Eye size={15}/>:<EyeOff size={15}/>} {hidden?'फिर दिखाएँ':'छिपाएँ'}</button><button type="button" disabled={!dirty||busy} onClick={save}><Save size={15}/> {busy?'सुरक्षित…':'बदलाव सुरक्षित करें'}</button></div>
     <small className="new-editor-path">चयन पथ: {selected.path}</small>
    </>}
    <p className="new-editor-notice">{notice}</p>
   </aside>
  </div>
 </section>;
}
