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


## प्रशासन पटल (Admin Panel)

`/admin` पर सुरक्षित सम्पादक उपलब्ध है। यह लेखों को इसी GitHub repository के `content/articles/<language>/` फ़ोल्डर में सुरक्षित करता है। हर सेव/प्रकाशन पर GitHub commit होता है और Vercel का मौजूदा automatic deployment वेबसाइट को पुनः प्रकाशित करता है। अलग database subscription की आवश्यकता नहीं है।

### एक बार का Vercel सेटअप

Vercel → Project → Settings → Environment Variables में ये चार variables **Production** environment के लिए जोड़ें:

- `ADMIN_PASSWORD`: अपना लम्बा, अनोखा प्रशासन पासवर्ड।
- `ADMIN_SESSION_SECRET`: कम-से-कम 32 अक्षरों का random secret।
- `GITHUB_CONTENT_TOKEN`: GitHub का fine-grained Personal Access Token; केवल `shrinimbark-website` repository चुनें और `Contents: Read and write` अनुमति दें। इसे कभी वेबसाइट कोड या सार्वजनिक चैट में न डालें।
- `GITHUB_OWNER`: `shrinimbark` (वैकल्पिक; यही default है)।

`GITHUB_REPO` का default `shrinimbark-website` और `GITHUB_BRANCH` का default `main` है। Variables जोड़ने के बाद Vercel में एक नया Production deployment करें। फिर `https://shrinimbark.org/admin` खोलें।

### लेख प्रकाशित करना

1. Admin Panel में पासवर्ड से लॉगिन करें।
2. भाषा, विभाग और विषय चुनें।
3. शीर्षक, परिचय, पूरा लेख और स्रोत-सन्दर्भ भरें।
4. चाहें तो JPG/PNG/WEBP चित्र या PDF अपलोड करें (प्रति फ़ाइल अधिकतम 8 MB)।
5. पहले ड्राफ्ट सुरक्षित करें या प्रकाशित करें।

ड्राफ्ट सार्वजनिक विषय-पृष्ठ पर नहीं दिखेगा। प्रकाशित लेख सम्बन्धित विषय-पृष्ठ पर दिखाई देगा। प्रत्येक भाषा की सामग्री अलग-अलग भरनी होगी।

### महत्वपूर्ण सीमाएँ

- यह संस्करण विषय-पृष्ठों के लेख, चित्र और PDF के लिए Admin Panel देता है। समाचार/कार्यक्रम, homepage के सभी पाठ, सदस्य प्रबन्धन और विस्तृत डिजिटल लाइब्रेरी की अलग व्यवस्थाएँ अभी इसमें शामिल नहीं हैं।
- GitHub API के माध्यम से प्रत्येक सामग्री/फ़ाइल अलग commit के रूप में सुरक्षित होती है। PDF/चित्र की सीमा 8 MB प्रति फ़ाइल है।
- पासवर्ड और GitHub token केवल Vercel Environment Variables में रखें। यदि token कभी सार्वजनिक हो जाए तो GitHub से तुरन्त revoke करें।
- संस्कृत, सिद्धान्त, इतिहास, मन्त्र और पूजा-विधि की सामग्री प्रकाशित करने से पहले स्रोत और विद्वत् समीक्षा आवश्यक है।

### मुखपृष्ठ चित्र बदलना

`/admin` में लॉगिन करने के बाद सबसे ऊपर **मुखपृष्ठ का मुख्य चित्र** अनुभाग दिखाई देता है। JPG, PNG या WEBP चित्र (अधिकतम 8 MB) चुनें। चित्र सुरक्षित होते ही GitHub में `content/settings/homepage.json` अपडेट होता है और Vercel स्वतः नया संस्करण प्रकाशित करता है। एक ही मुख्य चित्र हिन्दी, संस्कृत और अंग्रेज़ी—तीनों मुखपृष्ठों पर लागू होता है। चित्र अपलोड के लिए वही सुरक्षित Admin API और GitHub token उपयोग होता है।
