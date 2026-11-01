import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readRepoFile, saveRepoFile } from '@/lib/github-content';
const PATH='content/settings/homepage-content.json';
export async function GET(){
 if(!await isAdmin()) return NextResponse.json({error:'लॉगिन आवश्यक है।'},{status:401});
 try { const raw=await readRepoFile(PATH); return NextResponse.json({content:raw?JSON.parse(raw):null},{headers:{'Cache-Control':'no-store'}}); }
 catch(e){ return NextResponse.json({error:e instanceof Error?e.message:'मुखपृष्ठ सामग्री नहीं पढ़ी जा सकी।'},{status:500}); }
}
export async function PUT(req:Request){
 if(!await isAdmin()) return NextResponse.json({error:'लॉगिन आवश्यक है।'},{status:401});
 const data=await req.json().catch(()=>null);
 if(!data||typeof data!=='object') return NextResponse.json({error:'अमान्य सामग्री।'},{status:400});
 const keys=['heroTitle','heroSubtitle','heroDescription','heroButton1','heroButton2','heroCaption','departmentEyebrow','departmentTitle','departmentDescription','acharyaEyebrow','acharyaTitle','acharyaSubtitle','acharyaDescription','acharyaLink','featureEyebrow','featureTitle','closingTitle','closingDescription','lower1Title','lower1Description','lower1Link','lower2Title','lower2Description','lower2Link','lower3Title','lower3Description','lower3Link'];
 const clean:any={};
 for(const k of keys){const x=data[k];if(!x||typeof x!=='object')return NextResponse.json({error:'प्रत्येक शीर्षक के लिए हिन्दी, संस्कृत और English सामग्री दें।'},{status:400});clean[k]={};for(const l of ['hi','sa','en']){if(typeof x[l]!=='string'||x[l].length>2000)return NextResponse.json({error:'पाठ अमान्य या बहुत बड़ा है।'},{status:400});clean[k][l]=x[l];}}
 try{await saveRepoFile(PATH,JSON.stringify({...clean,updatedAt:new Date().toISOString()},null,2),'Update multilingual homepage content');return NextResponse.json({ok:true,message:'मुखपृष्ठ सामग्री सुरक्षित हुई।'});}
 catch(e){return NextResponse.json({error:e instanceof Error?e.message:'सामग्री सुरक्षित नहीं हुई।'},{status:500});}
}
