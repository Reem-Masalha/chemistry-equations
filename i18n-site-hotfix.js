(()=>{
  const KEY='chemistryLanguage';
  const T={
    ar:{
      'DIFFICULTY':'الصعوبة','MODE':'طريقة التدريب','YOUR STATS':'إحصاءاتك','Choose a level':'اختر المستوى',
      'Easy':'سهل','Medium':'متوسط','Hard':'صعب','Basics and simple equations':'الأساسيات والمعادلات البسيطة',
      'Groups, parentheses and more steps':'المجموعات والأقواس والمزيد من الخطوات','Combustion and complex reactions':'الاحتراق والتفاعلات المعقدة',
      'How do you want to practice?':'كيف تريد أن تتدرّب؟','Untimed':'بدون مؤقت','Timed · 5 minutes':'مؤقت · 5 دقائق','Challenge · 60 seconds':'تحدٍّ · 60 ثانية',
      'Start new quiz':'ابدأ اختبارًا جديدًا','New quiz':'اختبار جديد','Retry mistakes only':'أعد الأخطاء فقط','Question history':'سجل الأسئلة',
      'Practice at your own pace with Easy, Medium and Hard quizzes.':'تدرّب بالوتيرة التي تناسبك باستخدام اختبارات سهلة ومتوسطة وصعبة.',
      'Practice Medium':'تدرّب على المستوى المتوسط','Practice Hard':'تدرّب على المستوى الصعب','Choose how to play':'اختر طريقة اللعب',
      'Choose how to practice':'اختر طريقة التدريب','Solo Practice':'التدريب الفردي','Challenge':'التحدّي',
      'LEARNING GUIDE':'دليل التعلّم','BEGINNER · EASY':'مبتدئ · سهل','INTERMEDIATE · MEDIUM':'متوسط · متوسط','ADVANCED · HARD':'متقدم · صعب',
      'Build the basics':'ابنِ الأساسيات','Handle more structure':'تعامَل مع تراكيب أكثر تعقيدًا','Challenge yourself':'تحدَّ نفسك',
      'What is a chemical equation?':'ما هي المعادلة الكيميائية؟','Reading chemical formulas':'قراءة الصيغ الكيميائية','Conservation of mass':'حفظ الكتلة',
      'Coefficients and simple balancing':'المعاملات والموازنة البسيطة','Diatomic elements':'العناصر ثنائية الذرة','Putting it all together':'تجميع كل ما تعلّمته',
      'Polyatomic ions':'الأيونات متعددة الذرات','Parentheses':'الأقواس','Fractions':'الكسور','Complicated reactions':'التفاعلات المعقدة',
      'Combustion':'الاحتراق','Redox':'الأكسدة والاختزال','Complex ionic equations':'المعادلات الأيونية المعقدة','Several-step balancing':'الموازنة متعددة الخطوات',
      'Learn':'تعلّم','Quiz':'اختبار','Challenges':'التحديات','Balancer':'موازنة المعادلات','Checker':'التحقق','Account':'الحساب',
      'Balance':'وازن','Check':'تحقق','Clear':'مسح','Undo':'تراجع','Redo':'إعادة','Eraser':'ممحاة','Recognize':'تعرّف',
      'Start Beginner Path →':'ابدأ مسار المبتدئين ←','Practice at':'تدرّب','your pace.':'بالوتيرة التي تناسبك.'
    },
    he:{
      'DIFFICULTY':'רמת קושי','MODE':'אופן תרגול','YOUR STATS':'הסטטיסטיקה שלך','Choose a level':'בחרו רמה',
      'Easy':'קל','Medium':'בינוני','Hard':'קשה','Basics and simple equations':'יסודות ומשוואות פשוטות',
      'Groups, parentheses and more steps':'קבוצות, סוגריים ושלבים נוספים','Combustion and complex reactions':'בעירה ותגובות מורכבות',
      'How do you want to practice?':'איך תרצו לתרגל?','Untimed':'ללא הגבלת זמן','Timed · 5 minutes':'מתוזמן · 5 דקות','Challenge · 60 seconds':'אתגר · 60 שניות',
      'Start new quiz':'התחילו חידון חדש','New quiz':'חידון חדש','Retry mistakes only':'תרגלו רק טעויות','Question history':'היסטוריית שאלות',
      'Practice at your own pace with Easy, Medium and Hard quizzes.':'תרגלו בקצב שלכם עם חידונים קלים, בינוניים וקשים.',
      'Practice Medium':'תרגול בינוני','Practice Hard':'תרגול קשה','Choose how to play':'בחרו איך לשחק',
      'Choose how to practice':'בחרו איך לתרגל','Solo Practice':'תרגול אישי','Challenge':'אתגר',
      'LEARNING GUIDE':'מדריך למידה','BEGINNER · EASY':'מתחילים · קל','INTERMEDIATE · MEDIUM':'בינוני · בינוני','ADVANCED · HARD':'מתקדם · קשה',
      'Build the basics':'בנו את היסודות','Handle more structure':'התמודדו עם מבנים מורכבים יותר','Challenge yourself':'אתגרו את עצמכם',
      'What is a chemical equation?':'מהי משוואה כימית?','Reading chemical formulas':'קריאת נוסחאות כימיות','Conservation of mass':'שימור המסה',
      'Coefficients and simple balancing':'מקדמים ואיזון פשוט','Diatomic elements':'יסודות דו-אטומיים','Putting it all together':'חיבור כל מה שלמדתם',
      'Polyatomic ions':'יונים רב-אטומיים','Parentheses':'סוגריים','Fractions':'שברים','Complicated reactions':'תגובות מורכבות',
      'Combustion':'בעירה','Redox':'חמצון-חיזור','Complex ionic equations':'משוואות יוניות מורכבות','Several-step balancing':'איזון במספר שלבים',
      'Learn':'למידה','Quiz':'חידון','Challenges':'אתגרים','Balancer':'מאזן משוואות','Checker':'בדיקה','Account':'חשבון',
      'Balance':'אזן','Check':'בדיקה','Clear':'ניקוי','Undo':'בטל','Redo':'בצע שוב','Eraser':'מחק','Recognize':'זיהוי',
      'Start Beginner Path →':'התחילו במסלול המתחילים ←','Practice at':'תרגלו','your pace.':'בקצב שלכם.'
    }
  };
  const getLang=()=>localStorage.getItem(KEY)||'en';
  const isChem=(el)=>!!el.closest?.('.equation,.chemical-equation,.formula,.chemistry-equation,[data-chemical]');
  function apply(){
    const l=getLang(), rtl=l==='ar'||l==='he', map=T[l]||{};
    document.documentElement.lang=l; document.documentElement.dir=rtl?'rtl':'ltr';
    document.body.classList.toggle('rtl-language',rtl);
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{
      const el=n.parentElement; if(!el||isChem(el)) return;
      const raw=n.nodeValue, text=raw.trim(); if(!text) return;
      if(map[text]) n.nodeValue=raw.replace(text,map[text]);
    });
    document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
      ['placeholder','title','aria-label'].forEach(a=>{const v=el.getAttribute(a); if(v&&map[v]) el.setAttribute(a,map[v]);});
    });
    document.querySelectorAll('main,.hero,.section,.section-head,.card,.page-title,.dashboard-card,.quiz-settings,.stats-card').forEach(el=>{
      if(!isChem(el)) el.style.textAlign=rtl?'right':'';
    });
    document.querySelectorAll('.main-nav').forEach(el=>{el.style.direction='ltr';el.style.flexDirection='row';});
    document.querySelectorAll('.main-nav a').forEach(el=>el.style.direction='ltr');
    document.querySelectorAll('.brand,.account-top').forEach(el=>el.style.direction='ltr');
    document.querySelectorAll('.lesson-grid,.stage-list,.mode-list,.quiz-list,.achievements').forEach(el=>el.style.direction=rtl?'rtl':'ltr');
    document.querySelectorAll('.lesson,.stage,.mode-list label,.achievement').forEach(el=>{if(!isChem(el)) el.style.textAlign=rtl?'right':'';});
    document.querySelectorAll('.equation,.chemical-equation,.formula,.chemistry-equation,[data-chemical]').forEach(el=>{el.style.direction='ltr';el.style.textAlign='center';});
  }
  let timer;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(apply,0)};
  const obs=new MutationObserver(schedule);
  function start(){apply();obs.observe(document.body,{subtree:true,childList:true});window.addEventListener('storage',e=>{if(e.key===KEY) schedule();});window.addEventListener('languagechange',schedule);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
