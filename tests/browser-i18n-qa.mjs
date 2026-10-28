import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = 'https://reem-masalha.github.io/chemistry-equations/';
const pages = ['index.html','learn.html','beginner-lessons.html','intermediate-lessons.html','advanced-lessons.html','personal-quiz.html','quiz.html','challenges.html','checker.html','profile.html','set-password.html','admin-tools.html','admin.html'];
const languages = [{code:'en',dir:'ltr',nav:'Learn'},{code:'ar',dir:'rtl',nav:'تعلّم'},{code:'he',dir:'rtl',nav:'למידה'}];
const viewports = [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}];
const out='browser-i18n-artifacts';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const report={base,generatedAt:new Date().toISOString(),checks:[],screenshots:[],untranslatedCandidates:[],errors:[]};
const baselines=new Map();

for(const viewport of viewports){
 for(const lang of languages){
  for(const pagePath of pages){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
   await context.addInitScript(language=>localStorage.setItem('chemistryLanguage',language),lang.code);
   const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push({page:pagePath,lang:lang.code,viewport:viewport.name,error:String(e),stack:String(e.stack||'').slice(0,1200)}));
   page.on('response',response=>{if(response.status()===404)report.errors.push({page:pagePath,lang:lang.code,viewport:viewport.name,notFoundStatus:404,resourceType:response.request().resourceType(),notFoundUrl:response.url()})});
   page.on('console',msg=>{if(msg.type()==='error')report.errors.push({page:pagePath,lang:lang.code,viewport:viewport.name,console:msg.text()})});
   try{
    const response=await page.goto(new URL(pagePath,base).href,{waitUntil:'domcontentloaded',timeout:25000});
    await page.waitForFunction(()=>document.querySelector('#site-language-select')||document.querySelector('#adminLanguageSelect'),null,{timeout:7000});
    await page.waitForTimeout(lang.code==='en'?350:2700);
    const state=await page.evaluate(()=>{
     const visible=el=>!!(el&&(el.offsetWidth||el.offsetHeight||el.getClientRects().length));
     const bodyLines=(document.body.innerText||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
     const textNodes=[];
     const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
     while(walker.nextNode()){
      const n=walker.currentNode,p=n.parentElement;
      if(!p||!visible(p)||p.closest('script,style,noscript,textarea,select,option,code,pre,.equation,.chemical-equation,.formula,.math,[data-equation],[data-chemical],.site-language-control'))continue;
      const v=(n.nodeValue||'').replace(/\s+/g,' ').trim();
      if(v.length>=3)textNodes.push(v);
     }
     const placeholders=[...document.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label]')].filter(visible).map(el=>el.getAttribute('placeholder')||el.getAttribute('aria-label')||'').filter(Boolean);
     const heading=document.querySelector('main h1,h1');
     const nav=[...document.querySelectorAll('.main-nav a')].filter(visible).map(a=>a.innerText.trim());
     const selector=document.querySelector('#site-language-select,#adminLanguageSelect');
     const overflowingElements=[...document.querySelectorAll('body *')].filter(visible).map(el=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return {tag:el.tagName,id:el.id||'',className:typeof el.className==='string'?el.className:'',left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,overflowX:cs.overflowX,parent:el.parentElement?.tagName+'#'+(el.parentElement?.id||'')+'.'+(typeof el.parentElement?.className==='string'?el.parentElement.className:'')};}).filter(x=>x.right>innerWidth+2||x.left < -2).sort((a,b)=>(b.right-innerWidth)-(a.right-innerWidth)).slice(0,20);
     const controls=[...document.querySelectorAll('.topbar .brand,.topbar .main-nav,.topbar-controls,#site-language-select,#adminLanguageSelect,#accountTopBtn')].filter(visible).map(el=>{
      const r=el.getBoundingClientRect();
      return {name:el.id||el.className||el.tagName,left:Math.round(r.left),right:Math.round(r.right),top:Math.round(r.top),bottom:Math.round(r.bottom),width:Math.round(r.width),height:Math.round(r.height)};
     });
     return {title:document.title,lang:document.documentElement.lang,dir:document.documentElement.dir,selectedLanguage:selector?.value,languageLabel:document.querySelector('.site-language-label,#adminLanguageLabel')?.innerText||'',heading:heading?.innerText?.replace(/\s+/g,' ').trim()||'',nav,bodyLines,textNodes,placeholders,overflowingElements,bodyScrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,documentHeight:document.documentElement.scrollHeight,controls};
    });
    report.checks.push({page:pagePath,lang:lang.code,viewport:viewport.name,status:response?.status()??null,...state});
    const key=viewport.name+':'+pagePath;
    if(lang.code==='en')baselines.set(key,new Set([...state.textNodes,...state.placeholders]));
    else{
     const baseline=baselines.get(key)||new Set();
     const formula=/^(?=.*(?:\d|[₀-₉]|→|⇌|⇄|=|\+))[A-Z0-9\s.,()+→⇌⇄=₀-₉_:\-·•✓✔✕×÷%]+$/;
     const candidates=[...new Set([...state.textNodes,...state.placeholders].filter(line=>baseline.has(line)&&line.length>=3&&!formula.test(line)&&!['⚗ Chemistry Equations','English','العربية','עברית','Ctrl K'].includes(line)))].slice(0,120);
     if(candidates.length)report.untranslatedCandidates.push({page:pagePath,lang:lang.code,viewport:viewport.name,lines:candidates});
    }
    const shot=path.join(out,pagePath.replace('.html','')+'-'+lang.code+'-'+viewport.name+'.png');
    await page.screenshot({path:shot,fullPage:true,animations:'disabled',timeout:20000});
    report.screenshots.push(shot);
    const assertions={
     httpOk:(response?.status()??500)<400,
     languageApplied:state.lang===lang.code&&state.selectedLanguage===lang.code,
     directionCorrect:state.dir===lang.dir,
     languageLabelTranslated:state.languageLabel===(lang.code==='ar'?'اللغة':lang.code==='he'?'שפה':'Language'),
     navTranslated:state.nav.length===0||state.nav.some(item=>item.includes(lang.nav)),
     noPageHorizontalOverflow:state.bodyScrollWidth<=state.viewportWidth+2,
     headerControlsInsideViewport:state.controls.filter(x=>['site-language-select','adminLanguageSelect','topbar-controls','topbarControls','accountTopBtn'].includes(x.name)).every(x=>x.left>=-1&&x.right<=state.viewportWidth+1)
    };
    report.checks[report.checks.length-1].assertions=assertions;
   }catch(e){report.errors.push({page:pagePath,lang:lang.code,viewport:viewport.name,error:String(e)})}
   finally{await context.close()}
  }
 }
}
for(const lang of languages){
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(language=>localStorage.setItem('chemistryLanguage',language),lang.code);
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push({page:'interactive-journeys',lang:lang.code,error:String(e),stack:String(e.stack||'').slice(0,1200)}));
 page.on('response',response=>{if(response.status()===404)report.errors.push({page:'interactive-journeys',lang:lang.code,notFoundStatus:404,resourceType:response.request().resourceType(),notFoundUrl:response.url()})});
 try{
  await page.goto(new URL('checker.html',base).href,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#site-language-select');await page.waitForTimeout(700);
  await page.locator('.checker-example').first().click();
  const filled=await page.locator('#checkInput').inputValue();
  await page.locator('#checkBtn').click();await page.waitForTimeout(300);
  report.checks.push({page:'checker.html:example-and-check',lang:lang.code,exampleFilled:Boolean(filled),inputValue:filled,resultVisible:(await page.locator('#checkResult').innerText()).trim().length>0});
  await page.goto(new URL('personal-quiz.html',base).href,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#site-language-select');await page.waitForTimeout(700);
  await page.locator('#newQuiz').click();await page.waitForTimeout(500);
  const quizAreaText=(await page.locator('#quizArea').innerText()).trim();
  const questionMeta=(await page.locator('.practice-question-meta').innerText().catch(()=>'' )).trim();
  const questionMetaLocalized=lang.code==='en'||!/\b(basic balancing|coefficients|diatomic elements|already-balanced equations|tricky formulas|parentheses|polyatomic ions|combustion|redox|ionic equations|beginner|intermediate|advanced|easy|medium|hard)\b/i.test(questionMeta);
  report.checks.push({page:'personal-quiz.html:start-practice',lang:lang.code,quizAreaVisible:quizAreaText.length>0,questionMeta,scoreArea:(await page.locator('#scoreArea').innerText()).trim(),assertions:{practiceStarted:quizAreaText.length>0,questionMetaLocalized}});
  await page.locator('#cancelQuiz').click();
  await page.locator('input[name="qtype"][value="coefficients"]').check();
  await page.locator('#newQuiz').click();
  const coefInputs=page.locator('#quizArea [data-coef]');
  await coefInputs.first().fill('99');
  for(let i=1;i<await coefInputs.count();i++)await coefInputs.nth(i).fill('1');
  await page.locator('#quizArea .practice-submit').click();
  await page.waitForSelector('#answerFeedback .muted',{timeout:5000});
  const feedbackHint=(await page.locator('#answerFeedback .muted').innerText()).trim();
  const feedbackHintLocalized=lang.code==='en'||(lang.code==='ar'?/[ء-ي]/.test(feedbackHint):/[א-ת]/.test(feedbackHint));
  report.checks.push({page:'personal-quiz.html:feedback-hint',lang:lang.code,feedbackHint,assertions:{feedbackHintLocalized}});
 }catch(e){report.errors.push({page:'interactive-journeys',lang:lang.code,error:String(e)})}
 finally{await context.close()}
}

for(const lang of languages){
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addInitScript(language=>localStorage.setItem('chemistryLanguage',language),lang.code);
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push({page:'dynamic-journeys',lang:lang.code,error:String(e),stack:String(e.stack||'').slice(0,1200)}));
 page.on('response',response=>{if(response.status()===404)report.errors.push({page:'dynamic-journeys',lang:lang.code,notFoundStatus:404,resourceType:response.request().resourceType(),notFoundUrl:response.url()})});
 try{
  await page.goto(new URL('index.html',base).href,{waitUntil:'domcontentloaded',timeout:25000});
  await page.waitForSelector('#site-language-select',{timeout:7000});
  await page.waitForTimeout(lang.code==='en'?350:2700);
  await page.locator('button[data-eq]').first().click();
  await page.locator('#balanceBtn').click();
  await page.waitForTimeout(500);
  const balanceText=(await page.locator('#balanceResult').innerText().catch(()=>'' )).trim();
  const balanceVisible=balanceText.length>0;
  report.checks.push({page:'index.html:balance-equation',lang:lang.code,resultVisible:balanceVisible,resultText:balanceText,assertions:{balanceResultVisible:balanceVisible}});
  await page.screenshot({path:path.join(out,'balancer-result-'+lang.code+'.png'),fullPage:true,animations:'disabled',timeout:20000});
 }catch(e){report.errors.push({page:'index.html:balance-equation',lang:lang.code,error:String(e)})}
 try{
  await page.goto(new URL('learn.html',base).href,{waitUntil:'domcontentloaded',timeout:25000});
  await page.waitForSelector('#site-language-select',{timeout:7000});
  await page.waitForTimeout(lang.code==='en'?350:2700);
  await page.locator('#dailyStart').click();
  await page.waitForTimeout(700);
  const dailyText=(await page.locator('#dailyArea').innerText().catch(()=>'' )).trim();
  const dailyVisible=await page.locator('#dailyArea').isVisible().catch(()=>false)&&dailyText.length>0;
  report.checks.push({page:'learn.html:daily-challenge-start',lang:lang.code,dailyAreaVisible:dailyVisible,dailyText,assertions:{dailyChallengeOpened:dailyVisible}});
  await page.screenshot({path:path.join(out,'daily-challenge-'+lang.code+'.png'),fullPage:true,animations:'disabled',timeout:20000});
 }catch(e){report.errors.push({page:'learn.html:daily-challenge-start',lang:lang.code,error:String(e)})}
 try{
  await page.goto(new URL('learn.html',base).href,{waitUntil:'domcontentloaded',timeout:25000});
  await page.waitForSelector('#site-language-select',{timeout:7000});
  await page.waitForTimeout(lang.code==='en'?350:2700);
  await page.locator('#accountTopBtn').click();
  await page.waitForSelector('#accountModal',{timeout:5000});
  await page.waitForTimeout(lang.code==='en'?250:1000);
  const modalText=(await page.locator('#accountModal').innerText()).trim();
  const modalVisible=await page.locator('#accountModal').isVisible().catch(()=>false)&&modalText.length>0;
  report.checks.push({page:'account-modal',lang:lang.code,modalVisible,modalText,assertions:{accountModalVisible:modalVisible}});
  await page.screenshot({path:path.join(out,'account-modal-'+lang.code+'.png'),fullPage:true,animations:'disabled',timeout:20000});
 }catch(e){report.errors.push({page:'account-modal',lang:lang.code,error:String(e)})}
 await context.close();
}

const failed=report.checks.filter(c=>c.assertions&&Object.values(c.assertions).some(v=>!v));
report.summary={pages:pages.length,languages:languages.map(x=>x.code),viewports:viewports.map(x=>x.name),screenshotCount:report.screenshots.length,assertionFailures:failed.map(c=>({page:c.page,lang:c.lang,viewport:c.viewport,failures:Object.entries(c.assertions).filter(([,v])=>!v).map(([k])=>k)})),errorCount:report.errors.length,untranslatedCandidateGroups:report.untranslatedCandidates.length};
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
console.log('BROWSER_I18N_QA_SUMMARY='+JSON.stringify(report.summary));
console.log('UNTRANSLATED_CANDIDATES='+JSON.stringify(report.untranslatedCandidates));
console.log('BROWSER_ERRORS='+JSON.stringify(report.errors));
await browser.close();
if(failed.length||report.errors.length)process.exitCode=1;
