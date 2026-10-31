# श्रीनिम्बार्क सम्प्रदाय — shrinimbark.org

मोबाइल-अनुकूल Next.js वेबसाइट का अद्यतन प्रारम्भिक संस्करण।

## इसमें क्या है
- जयपुरी राजसी शैली: मरून, प्राचीन स्वर्णिम और हाथीदाँत रंग।
- साफ़ मुख्य चित्र; पहले वाले पूरे पृष्ठ के स्क्रीनशॉट को मुख्य चित्र के रूप में उपयोग नहीं किया गया।
- हिन्दी, संस्कृत और अंग्रेज़ी के लिए अलग URL मार्ग (`/hi`, `/sa`, `/en`)।
- 16 विभागों के पृष्ठ और साझा विभाग-सूची।
- परिचय, सम्पर्क, विभाग सूची, गोपनीयता, sitemap और robots पृष्ठ।
- मोबाइल स्क्रीन के लिए responsive layout।

## महत्वपूर्ण स्थिति
यह वेबसाइट का front-end starter है। विभागों के पृष्ठों में अभी परिचयात्मक/प्रारम्भिक सामग्री है। पूर्ण डिजिटल पुस्तकालय, वास्तविक खोज, प्रशासन पैनल, डेटाबेस, सदस्य प्रबंधन और सम्पादकीय workflow अभी जुड़े नहीं हैं। इन्हें अगले चरणों में बनाना होगा। संस्कृत, सिद्धान्त, इतिहास, मन्त्र और पूजा-विधि की सामग्री स्रोत-सत्यापन और योग्य विद्वानों की समीक्षा के बाद ही प्रकाशित करें।

## आवश्यकताएँ
Node.js 20.9 या नया।

## चलाने के लिए
```bash
npm install
npm run dev
```
फिर `http://localhost:3000` खोलें।

## Production build जाँच
```bash
npm run build
```
इस पैकेज को इस वातावरण में build-test किया हुआ नहीं बताया जा रहा है। Vercel पर deploy होने के बाद Deployment Logs में build परिणाम देखें।

## डोमेन
Vercel पर `shrinimbark.org` और `www.shrinimbark.org` कनेक्ट किए जा चुके हैं। DNS बदलावों को दोबारा बदलने की आवश्यकता नहीं, जब तक Vercel स्वयं कोई त्रुटि न दिखाए।

## Editorial and topic-page framework (Phase 2)

- Every topic listed under the 16 departments now opens its own structured topic record.
- Topic records expose publication status and bibliographic/source fields. They intentionally do not invent article content or historical claims.
- Added a trilingual editorial and source policy at `/{lang}/editorial-policy`.
- Department topic cards are navigable, and topic/policy routes are included in the sitemap.
- Unpublished topics are explicitly labelled as being in preparation. They should only be marked published after source review and editorial approval.

This phase still does not include a database, CMS, admin login, or contributor workflow. Those require selecting and configuring a persistent content backend before production use.
