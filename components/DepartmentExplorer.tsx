'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Landmark,BookOpen,Users,LibraryBig,Flower2,ScrollText,Globe2,ChevronDown,ChevronUp} from 'lucide-react';
import type {Lang} from '@/lib/site';
const icons=[Landmark,BookOpen,Users,LibraryBig,Flower2,Landmark,ScrollText,Globe2];
export default function DepartmentExplorer({departments,lang}:{departments:any[];lang:Lang}){
 const [all,setAll]=useState(false);
 const shown=all?departments:departments.slice(0,8);
 return <div className="department-explorer"><div className="department-grid">{shown.map((d,i)=>{const Icon=icons[i%icons.length];return <Link className="department-card" href={`/${lang}/${d.slug}`} key={d.slug}><span className="card-number">{d.no}</span><Icon className="department-icon" strokeWidth={1.35}/><h3>{lang==='en'?d.en:lang==='sa'?d.sa:d.hi}</h3><p>{d.desc}</p><span className="card-arrow"><ArrowUpRight size={16}/></span></Link>})}</div><div className="all-departments"><button type="button" onClick={()=>setAll(!all)}>{all?'कम विषय दिखाएँ':'अधिक देखें — सभी 16 खण्ड'} {all?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button></div></div>;
}