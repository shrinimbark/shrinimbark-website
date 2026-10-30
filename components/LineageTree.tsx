const stages=[
 {title:'सनकादि कुमार',subtitle:'परम्परागत सम्प्रदाय-गुरु परम्परा'},
 {title:'श्रीनारद मुनि',subtitle:'परम्परागत गुरु-शिष्य क्रम'},
 {title:'श्रीनिम्बार्काचार्य',subtitle:'निम्बार्क सम्प्रदाय के प्रमुख आचार्य'},
 {title:'आचार्य-परम्परा',subtitle:'विभिन्न शाखाओं और पीठों के अभिलेख अलग-अलग सत्यापित किए जाएँगे'},
];
export default function LineageTree(){return <div className="lineage-tree" aria-label="गुरु परम्परा का परिचयात्मक क्रम">{stages.map((s,i)=><div className="lineage-node" key={s.title}><span className="lineage-index">{String(i+1).padStart(2,'0')}</span><div><h3>{s.title}</h3><p>{s.subtitle}</p></div></div>)}<p className="lineage-caveat">यह केवल परम्परा के परिचय हेतु संक्षिप्त रूपरेखा है, सम्पूर्ण ऐतिहासिक गुरु-सूची नहीं। विस्तृत गुरु-क्रम प्रकाशित करने से पहले प्रत्येक नाम, क्रम और सम्बन्ध के लिए सम्बद्ध ग्रन्थ/पीठीय स्रोत का उल्लेख किया जाएगा।</p></div>}
