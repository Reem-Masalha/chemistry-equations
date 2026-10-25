import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = 'https://reem-masalha.github.io/chemistry-equations/';
const pages = ['index.html','learn.html','beginner-lessons.html','intermediate-lessons.html','advanced-lessons.html','personal-quiz.html','challenges.html','checker.html','profile.html','set-password.html'];
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
   page.on('pageerror',e=>report.errors.push({page:pagePath,lang:lang.code,viewport:viewport.name,error:String(e)}));
   page.on('console',msg=>{if(msg.type()==='error')report.errors.push({page:pagePath,lang:lang.code,viewport:viewport.name,console:msg.text()})});
   try{
    const response=await page.goto(new URL(pagePath,base).href,{waitUntil:'domcontentloaded',timeout:25000});
    await page.waitForSelector('#site-language-select',{timeout:7000});
    await page.waitForTimeout(500);
    const state=await page.evaluate(()=>{
     const visible=el=>!!(el&&(el.offsetWidth||el.offsetHeight||el.getClientRects().length));
     const bodyLines=(document.body.innerText||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
     const heading=document.querySelector('main h1,h1');
     const nav=[...document.querySelectorAll('.main-nav a')].filter(visible).map(a=>a.innerText.trim());
     const selector=document.querySelector('#site-language-select');
     const controls=[...document.querySelectorAll('.topbar .brand,.topbar .main-nav,.topbar-controls,#site-language-select,#accountTopBtn')].filter(visible).map(el=>{
      const r=el.getBoundingClientRect();
      return {name:el.id||el.className||el.tagName,left:Math.round(r.left),right:Math.round(r.right),top:Math.round(r.top),bottom:Math.round(r.bottom),width:Math.round(r.width),height:Math.round(r.height)};
     });
     return {title:document.title,lang:document.documentElement.lang,dir:document.documentElement.dir,selectedLanguage:selector?.value,heading:heading?.innerText?.replace(/\s+/g,' ').trim()||'',nav,bodyLines,bodyScrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,documentHeight:document.documentElement.scrollHeight,controls};
    });
    report.checks.push({page:pagePath,lang:lang.code,viewport:viewport.name,status:response?.status()??null,...state});
    const key=viewport.name+':'+pagePath;
    if(lang.code==='en')baselines.set(key,new Set(state.bodyLines));
    else{
     const baseline=baselines.get(key)||new Set();
     const ignored=/^(?:⚗ Chemistry|Equations|Learn|Quiz|Challenges|Balancer|Checker|Account|English|العربية|עברית|[\d\s.,()+→⇌⇄=₀-₉A-Za-z_\-:·•✓✔✕×÷%]+)$/;
     const candidates=[...new Set(state.bodyLines.filter(line=>baseline.has(line)&&line.length>=5&&!ignored.test(line)))].slice(0,80);
     if(candidates.length)report.untranslatedCandidates.push({page:pagePath,lang:lang.code,viewport:viewport.name,lines:candidates});
    }
    const shot=path.join(out,pagePath.replace('.html','')+'-'+lang.code+'-'+viewport.name+'.png');
    await page.screenshot({path:shot,fullPage:true,animations:'disabled',timeout:20000});
    report.screenshots.push(shot);
    const assertions={
     httpOk:(response?.status()??500)<400,
     languageApplied:state.lang===lang.code&&state.selectedLanguage===lang.code,
     directionCorrect:state.dir===lang.dir,
     navTranslated:state.nav.some(item=>item.includes(lang.nav)),
     noPageHorizontalOverflow:state.bodyScrollWidth<=state.viewportWidth+2,
     headerControlsInsideViewport:state.controls.filter(x=>['site-language-select','topbar-controls','topbarControls','accountTopBtn'].includes(x.name)).every(x=>x.left>=-1&&x.right<=state.viewportWidth+1)
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
 page.on('pageerror',e=>report.errors.push({page:'interactive-journeys',lang:lang.code,error:String(e)}));
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
  report.checks.push({page:'personal-quiz.html:start-practice',lang:lang.code,quizAreaVisible:(await page.locator('#quizArea').innerText()).trim().length>0,scoreArea:(await page.locator('#scoreArea').innerText()).trim()});
 }catch(e){report.errors.push({page:'interactive-journeys',lang:lang.code,error:String(e)})}
 finally{await context.close()}
}
const failed=report.checks.filter(c=>c.assertions&&Object.values(c.assertions).some(v=>!v));
report.summary={pages:pages.length,languages:languages.map(x=>x.code),viewports:viewports.map(x=>x.name),screenshotCount:report.screenshots.length,assertionFailures:failed.map(c=>({page:c.page,lang:c.lang,viewport:c.viewport,failures:Object.entries(c.assertions).filter(([,v])=>!v).map(([k])=>k)})),errorCount:report.errors.length,untranslatedCandidateGroups:report.untranslatedCandidates.length};
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
console.log('BROWSER_I18N_QA_SUMMARY='+JSON.stringify(report.summary));
console.log('UNTRANSLATED_CANDIDATES='+JSON.stringify(report.untranslatedCandidates));
console.log('BROWSER_ERRORS='+JSON.stringify(report.errors));
await browser.close();
if(failed.length||report.errors.length)process.exitCode=1;
