import {NextResponse} from 'next/server';
import {isAdmin} from '@/lib/admin-auth';
import {readRepoFile,saveRepoFile} from '@/lib/github-content';
const PATH='content/settings/visual-edits.json';
type Edit={path:string;lang:'hi'|'sa'|'en';text?:string;image?:string;href?:string;style?:Record<string,string>;hidden?:boolean};
function clean(data:any):Edit|null{
 if(!data||typeof data.path!=='string'||data.path.length>1200||!['hi','sa','en'].includes(data.lang))return null;
 const edit:Edit={path:data.path,lang:data.lang};
 if(typeof data.text==='string')edit.text=data.text.slice(0,5000);
 if(typeof data.image==='string'&&/^\/(uploads|images)\/[a-zA-Z0-9_./-]+$/.test(data.image))edit.image=data.image;
 if(typeof data.href==='string'&&data.href.length<500&&!data.href.startsWith('//'))edit.href=data.href;
 if(data.style&&typeof data.style==='object'){edit.style={};const allowed=['maxWidth','minHeight','fontSize','textAlign','padding','border','borderRadius','width','height'];for(const k of allowed)if(typeof data.style[k]==='string'&&data.style[k].length<80)(edit.style as Record<string,string>)[k]=data.style[k];}
 if(typeof data.hidden==='boolean')edit.hidden=data.hidden;
 return edit;
}
export async function GET(){try{const raw=await readRepoFile(PATH);return NextResponse.json({edits:raw?JSON.parse(raw).edits||[]:[]},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({edits:[]},{headers:{'Cache-Control':'no-store'}})}}
export async function PUT(req:Request){
 if(!await isAdmin())return NextResponse.json({error:'लॉगिन आवश्यक है।'},{status:401});
 const data=await req.json().catch(()=>null);const incoming=Array.isArray(data?.edits)?data.edits.map(clean):[clean(data)];
 if(!incoming.length||incoming.some((x:Edit|null)=>!x))return NextResponse.json({error:'चयनित वस्तु का विवरण अमान्य है।'},{status:400});
 try{const raw=await readRepoFile(PATH);const edits:Edit[]=raw?(JSON.parse(raw).edits||[]):[];
 for(const edit of incoming as Edit[]){const i=edits.findIndex(x=>x.path===edit.path&&x.lang===edit.lang);if(i>=0)edits[i]={...edits[i],...edit,style:{...(edits[i].style||{}),...(edit.style||{})}};else edits.push(edit);}
 await saveRepoFile(PATH,JSON.stringify({edits,updatedAt:new Date().toISOString()},null,2),'Save visual website edit');
 return NextResponse.json({ok:true,message:'बदलाव वेबसाइट के लिए सुरक्षित हो गया है।'});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'बदलाव सुरक्षित नहीं हुआ।'},{status:500});}
}