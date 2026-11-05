'use client';

import {useEffect,useState} from 'react';
import {LockKeyhole,LogOut,ExternalLink} from 'lucide-react';
import VisualSiteEditor from '@/components/VisualSiteEditor';

export default function AdminPanel(){
 const [logged,setLogged]=useState(false);
 const [authChecked,setAuthChecked]=useState(false);
 const [password,setPassword]=useState('');
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');

 useEffect(()=>{
  let active=true;
  fetch('/api/admin/session',{cache:'no-store'})
   .then(r=>r.json())
   .then(d=>{if(active)setLogged(Boolean(d.authenticated));})
   .catch(()=>{if(active)setNotice('प्रशासन सत्र की जाँच नहीं हो सकी।');})
   .finally(()=>{if(active)setAuthChecked(true);});
  return()=>{active=false;};
 },[]);

 async function login(e:React.FormEvent){
  e.preventDefault();setBusy(true);setNotice('');
  try{
   const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
   const d=await r.json();
   if(!r.ok)throw new Error(d.error||'लॉगिन असफल।');
   setLogged(true);setPassword('');setNotice('सुरक्षित लॉगिन सफल।');
  }catch(error){setNotice(error instanceof Error?error.message:'लॉगिन असफल।');}
  finally{setBusy(false);}
 }

 async function logout(){
  setBusy(true);
  try{await fetch('/api/admin/logout',{method:'POST'});setLogged(false);setNotice('आप लॉगआउट हो गए हैं।');}
  finally{setBusy(false);}
 }

 return <main className="admin-shell admin-shell-rebuilt">
  <header className="admin-head">
   <div><div className="admin-kicker">SHRI NIMBARKA SAMPRADAYA</div><h1>वेबसाइट सम्पादन केन्द्र</h1><p>एक ही स्थान से वेबसाइट को सीधे देखकर संपादित करें।</p></div>
   <a href="/hi" target="_blank" rel="noreferrer">वेबसाइट देखें <ExternalLink size={15}/></a>
  </header>
  {!authChecked?<div className="admin-login"><p>प्रशासन सत्र जाँचा जा रहा है…</p></div>:!logged?
   <form className="admin-login" onSubmit={login}>
    <div className="admin-lock"><LockKeyhole size={28}/></div><h2>प्रशासक लॉगिन</h2><p>वेबसाइट संपादित करने के लिए लॉगिन करें।</p>
    <label className="admin-field"><span>पासवर्ड</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/></label>
    <button className="admin-primary" disabled={busy}>{busy?'कृपया प्रतीक्षा करें':'लॉगिन करें'}</button>
    {notice&&<p className="admin-notice">{notice}</p>}
   </form>
  :
   <>
    <div className="admin-toolbar"><span><span className="admin-live-dot"/> संपादन सत्र सक्रिय</span><button type="button" onClick={logout} disabled={busy}><LogOut size={15}/> लॉगआउट</button></div>
    <VisualSiteEditor/>
    {notice&&<p className="admin-notice">{notice}</p>}
   </>
  }
 </main>;
}
