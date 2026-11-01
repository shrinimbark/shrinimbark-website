export function mediaUrl(value:string|undefined|null):string{
 if(!value)return '';
 if(value.startsWith('/uploads/'))return `/api/media?file=${encodeURIComponent(value.slice('/uploads/'.length))}`;
 return value;
}
