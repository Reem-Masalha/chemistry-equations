import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = [
  'site-language-v2.js',
  'site-language-final.js',
  'learn-full-i18n.js',
  'learn-extra-i18n.js',
  'i18n-universal-fix.js',
  'language-final-fix.js',
  'challenge-language-v4.js',
  'challenge-language-complete.js',
  'challenge-i18n-final.js',
  'site-language-complete-v2.js',
  'language-v2.js'
];

const overrides = {
  'Language': ['اللغة', 'שפה'],
  '👤 Account': ['👤 الحساب', '👤 חשבון'],
  '⚗ Chemistry Equations': ['⚗ معادلات الكيمياء', '⚗ משוואות כימיות'],
  'Learn • Quiz • Challenges • Balance • Check': ['تعلّم • اختبار • تحديات • موازنة • تحقق', 'למידה • חידון • אתגרים • איזון • בדיקה'],
  '03 · BALANCER': ['03 · موازنة المعادلات', '03 · איזון משוואות'],
  '04 · CHECKER': ['04 · التحقق', '04 · בדיקה'],
  '02 · PRACTICE & QUIZ': ['02 · تدريب واختبار', '02 · תרגול וחידון'],
  '03 · MULTIPLAYER': ['03 · لعب جماعي', '03 · משחק מרובה משתתפים'],
  '01 · LEARNING GUIDE': ['01 · دليل التعلّم', '01 · מדריך למידה'],
  'Balance equations.': ['وازن المعادلات.', 'אזנו משוואות.'],
  'Understand why.': ['افهم السبب.', 'הבינו מדוע.'],
  'Balance an equation': ['وازن معادلة', 'אזנו משוואה'],
  'BALANCE': ['موازنة', 'איזון'],
  'Set a new password': ['عيّن كلمة مرور جديدة', 'הגדירו סיסמה חדשה'],
  'This is for an existing account that currently has no password. Your account and saved scores are preserved.': ['هذا مخصص لحساب حالي لا يملك كلمة مرور. سيُحفظ حسابك ونتائجك المسجلة.', 'אפשרות זו מיועדת לחשבון קיים שעדיין אין לו סיסמה. החשבון והתוצאות השמורות יישמרו.'],
  'New password': ['كلمة المرور الجديدة', 'סיסמה חדשה'],
  'Confirm new password': ['تأكيد كلمة المرور الجديدة', 'אישור הסיסמה החדשה'],
  'Set password': ['تعيين كلمة المرور', 'הגדרת סיסמה'],
  'Setting password…': ['جارٍ تعيين كلمة المرور…', 'מגדירים סיסמה…'],
  'Password set successfully. Redirecting to your profile…': ['تم تعيين كلمة المرور بنجاح. جارٍ الانتقال إلى ملفك الشخصي…', 'הסיסמה הוגדרה בהצלחה. עוברים לפרופיל…'],
  'Could not set the password.': ['تعذر تعيين كلمة المرور.', 'לא ניתן להגדיר את הסיסמה.'],
  'Account': ['الحساب', 'חשבון'],
  'Sign in': ['تسجيل الدخول', 'התחברות'],
  'Sign out': ['تسجيل الخروج', 'התנתקות'],
  'Sign in to access your saved scores and progress.': ['سجّل الدخول للوصول إلى نتائجك وتقدمك المحفوظين.', 'התחברו כדי לגשת לתוצאות ולהתקדמות השמורות שלכם.'],
  'Remember me on this device': ['تذكّرني على هذا الجهاز', 'זכרו אותי במכשיר הזה'],
  'Forgot password?': ['هل نسيت كلمة المرور؟', 'שכחתם סיסמה?'],
  'Don’t have an account?': ['ليس لديك حساب؟', 'אין לכם חשבון?'],
  'Sign up for free': ['أنشئ حسابًا مجانًا', 'הירשמו בחינם'],
  'Create an account': ['إنشاء حساب', 'יצירת חשבון'],
  'Create a free account to save your scores and progress.': ['أنشئ حسابًا مجانيًا لحفظ نتائجك وتقدمك.', 'צרו חשבון בחינם כדי לשמור את התוצאות וההתקדמות שלכם.'],
  'Name': ['الاسم', 'שם'],
  'Username': ['اسم المستخدم', 'שם משתמש'],
  'Password': ['كلمة المرور', 'סיסמה'],
  'Confirm password': ['تأكيد كلمة المرور', 'אישור סיסמה'],
  'At least 8 characters': ['8 أحرف على الأقل', 'לפחות 8 תווים'],
  'You will receive a recovery code after creating your account. Save it somewhere safe.': ['ستتلقى رمز استرداد بعد إنشاء حسابك. احفظه في مكان آمن.', 'לאחר יצירת החשבון תקבלו קוד שחזור. שמרו אותו במקום בטוח.'],
  'Sign up': ['إنشاء حساب', 'הרשמה'],
  'Already have an account?': ['لديك حساب بالفعل؟', 'כבר יש לכם חשבון?'],
  'Recover your password': ['استرداد كلمة المرور', 'שחזור הסיסמה'],
  'Use the recovery code you saved when you created your account.': ['استخدم رمز الاسترداد الذي حفظته عند إنشاء حسابك.', 'השתמשו בקוד השחזור ששמרתם בעת יצירת החשבון.'],
  'Recovery code': ['رمز الاسترداد', 'קוד שחזור'],
  'Reset password': ['إعادة تعيين كلمة المرور', 'איפוס סיסמה'],
  'Back to sign in': ['العودة إلى تسجيل الدخول', 'חזרה להתחברות'],
  'Account & security': ['الحساب والأمان', 'חשבון ואבטחה'],
  'Manage your session and password securely.': ['أدِر جلستك وكلمة مرورك بأمان.', 'נהלו את ההתחברות והסיסמה שלכם באופן מאובטח.'],
  'View profile': ['عرض الملف الشخصي', 'צפייה בפרופיל'],
  'Change password': ['تغيير كلمة المرور', 'שינוי סיסמה'],
  'Current password': ['كلمة المرور الحالية', 'סיסמה נוכחית'],
  'Sign out from all devices': ['تسجيل الخروج من جميع الأجهزة', 'התנתקות מכל המכשירים'],
  'Delete account': ['حذف الحساب', 'מחיקת החשבון'],
  'Show': ['إظهار', 'הצגה'],
  'Hide': ['إخفاء', 'הסתרה'],
  'Save your recovery code': ['احفظ رمز الاسترداد', 'שמרו את קוד השחזור'],
  'This code can be used to reset your password if you forget it. Save it somewhere safe. It will not be shown again unless you generate a new one.': ['يمكن استخدام هذا الرمز لإعادة تعيين كلمة مرورك إذا نسيتها. احفظه في مكان آمن. لن يظهر مرة أخرى ما لم تنشئ رمزًا جديدًا.', 'אפשר להשתמש בקוד הזה לאיפוס הסיסמה אם תשכחו אותה. שמרו אותו במקום בטוח. הוא לא יוצג שוב אלא אם תיצרו קוד חדש.'],
  'Copy code': ['نسخ الرمز', 'העתקת הקוד'],
  'Print': ['طباعة', 'הדפסה'],
  "I've saved it": ['حفظتُه', 'שמרתי אותו'],
  'Copied!': ['تم النسخ!', 'הועתק!'],
  'Could not copy the code. Please copy it manually.': ['تعذر نسخ الرمز. يُرجى نسخه يدويًا.', 'לא ניתן להעתיק את הקוד. העתיקו אותו ידנית.'],
  'Please allow pop-ups to print the recovery code.': ['يُرجى السماح بالنوافذ المنبثقة لطباعة رمز الاسترداد.', 'אפשרו חלונות קופצים כדי להדפיס את קוד השחזור.'],
  'Recovery code saved. You are signed in.': ['تم حفظ رمز الاسترداد. لقد سجّلت الدخول.', 'קוד השחזור נשמר. אתם מחוברים.'],
  'Account Recovery Code': ['رمز استرداد الحساب', 'קוד שחזור החשבון'],
  'Keep this code private and safe.': ['احتفظ بهذا الرمز سريًا وآمنًا.', 'שמרו על הקוד הזה פרטי ובטוח.'],
  'Could not connect to the account server.': ['تعذر الاتصال بخادم الحساب.', 'לא ניתן להתחבר לשרת החשבונות.'],
  'Could not complete the request.': ['تعذر إكمال الطلب.', 'לא ניתן להשלים את הבקשה.'],
  'Could not sign out from all devices.': ['تعذر تسجيل الخروج من جميع الأجهزة.', 'לא ניתן להתנתק מכל המכשירים.'],
  'Name is required.': ['الاسم مطلوب.', 'יש להזין שם.'],
  'Username is required.': ['اسم المستخدم مطلوب.', 'יש להזין שם משתמש.'],
  'Password is required.': ['كلمة المرور مطلوبة.', 'יש להזין סיסמה.'],
  'Password must be at least 8 characters.': ['يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.', 'הסיסמה חייבת להכיל לפחות 8 תווים.'],
  'Please confirm your password.': ['يُرجى تأكيد كلمة المرور.', 'יש לאשר את הסיסמה.'],
  'Passwords do not match.': ['كلمتا المرور غير متطابقتين.', 'הסיסמאות אינן תואמות.'],
  'Creating account…': ['جارٍ إنشاء الحساب…', 'יוצרים חשבון…'],
  'Secure session was not returned by the server.': ['لم يُرجع الخادم جلسة آمنة.', 'השרת לא החזיר התחברות מאובטחת.'],
  'Account created successfully.': ['تم إنشاء الحساب بنجاح.', 'החשבון נוצר בהצלחה.'],
  'This username is already taken. Please choose another username.': ['اسم المستخدم هذا مستخدم بالفعل. يُرجى اختيار اسم آخر.', 'שם המשתמש הזה כבר תפוס. בחרו שם משתמש אחר.'],
  'Could not create the account.': ['تعذر إنشاء الحساب.', 'לא ניתן ליצור את החשבון.'],
  'Signing in…': ['جارٍ تسجيل الدخول…', 'מתחברים…'],
  'Could not sign in.': ['تعذر تسجيل الدخول.', 'לא ניתן להתחבר.'],
  'Recovery code is required.': ['رمز الاسترداد مطلوب.', 'יש להזין קוד שחזור.'],
  'New password is required.': ['كلمة المرور الجديدة مطلوبة.', 'יש להזין סיסמה חדשה.'],
  'Resetting password…': ['جارٍ إعادة تعيين كلمة المرور…', 'מאפסים את הסיסמה…'],
  'Password reset successfully.': ['تمت إعادة تعيين كلمة المرور بنجاح.', 'הסיסמה אופסה בהצלחה.'],
  'Could not reset the password.': ['تعذر إعادة تعيين كلمة المرور.', 'לא ניתן לאפס את הסיסמה.'],
  'Current password is required.': ['كلمة المرور الحالية مطلوبة.', 'יש להזין את הסיסמה הנוכחית.'],
  'Changing password…': ['جارٍ تغيير كلمة المرور…', 'משנים את הסיסמה…'],
  'Password changed successfully.': ['تم تغيير كلمة المرور بنجاح.', 'הסיסמה שונתה בהצלחה.'],
  'Could not change the password.': ['تعذر تغيير كلمة المرور.', 'לא ניתן לשנות את הסיסמה.'],
  'Delete your account and saved account data? This cannot be undone.': ['هل تريد حذف حسابك وبيانات الحساب المحفوظة؟ لا يمكن التراجع عن ذلك.', 'למחוק את החשבון ואת נתוני החשבון השמורים? לא ניתן לבטל פעולה זו.'],
  'Enter your password to confirm account deletion:': ['أدخل كلمة مرورك لتأكيد حذف الحساب:', 'הזינו את הסיסמה כדי לאשר את מחיקת החשבון:'],
  'Deleting account…': ['جارٍ حذف الحساب…', 'מוחקים את החשבון…'],
  'Could not delete the account.': ['تعذر حذف الحساب.', 'לא ניתן למחוק את החשבון.'],
  'Opening Personal Quiz…': ['جارٍ فتح الاختبار الشخصي…', 'פותחים את החידון האישי…'],
  'Continue': ['متابعة', 'המשך'],
  '01 · COMBUSTION': ['01 · الاحتراق', '01 · בעירה'],
  '02 · REDOX': ['02 · الأكسدة والاختزال', '02 · חמצון־חיזור'],
  '03 · COMPLEX IONIC EQUATIONS': ['03 · المعادلات الأيونية المعقدة', '03 · משוואות יוניות מורכבות'],
  '04 · SYSTEMATIC BALANCING': ['04 · الموازنة المنهجية', '04 · איזון שיטתי'],
  'Balance CH₄ + O₂ → CO₂ + H₂O.': ['وازن CH₄ + O₂ → CO₂ + H₂O.', 'אזנו CH₄ + O₂ → CO₂ + H₂O.'],
  'Balance C₂H₅OH + O₂ → CO₂ + H₂O.': ['وازن C₂H₅OH + O₂ → CO₂ + H₂O.', 'אזנו C₂H₅OH + O₂ → CO₂ + H₂O.'],
  'Practice Advanced Quiz': ['تدرّب باختبار المستوى المتقدم', 'תרגלו בחידון למתקדמים'],
  'Practice Medium Quiz': ['تدرّب باختبار المستوى المتوسط', 'תרגלו בחידון בינוני'],
  'Practice Beginner Quiz': ['تدرّب باختبار المبتدئين', 'תרגלו בחידון למתחילים'],
  'Back to Learning': ['العودة إلى التعلّم', 'חזרה ללמידה'],
  '01 · WHAT IS A CHEMICAL EQUATION?': ['01 · ما المعادلة الكيميائية؟', '01 · מהי משוואה כימית?'],
  '02 · READING CHEMICAL FORMULAS': ['02 · قراءة الصيغ الكيميائية', '02 · קריאת נוסחאות כימיות'],
  '03 · CONSERVATION OF MASS': ['03 · حفظ الكتلة', '03 · שימור המסה'],
  '04 · HOW TO BALANCE A CHEMICAL EQUATION': ['04 · كيفية موازنة معادلة كيميائية', '04 · כיצד מאזנים משוואה כימית'],
  '05 · DIATOMIC ELEMENTS': ['05 · العناصر ثنائية الذرة', '05 · יסודות דו־אטומיים'],
  '06 · PUTTING IT ALL TOGETHER': ['06 · تجميع كل ما تعلّمته', '06 · חיבור הכול יחד'],
  'H₂O contains 2 hydrogen atoms and 1 oxygen atom. When there is no subscript, the number is 1.': ['يحتوي H₂O على ذرتي هيدروجين وذرة أكسجين واحدة. عندما لا يوجد رقم سفلي يكون العدد 1.', 'ב־H₂O יש שני אטומי מימן ואטום חמצן אחד. כאשר אין מספר תחתון, המספר הוא 1.'],
  'How many oxygen atoms are in Ca(OH)₂?': ['كم ذرة أكسجين توجد في Ca(OH)₂؟', 'כמה אטומי חמצן יש ב־Ca(OH)₂?'],
  'How many hydrogen atoms are in 3H₂O?': ['كم ذرة هيدروجين توجد في 3H₂O؟', 'כמה אטומי מימן יש ב־3H₂O?'],
  'What does the coefficient in 3H₂O multiply?': ['ما الذي يضربه المعامل في 3H₂O؟', 'מה מכפיל המקדם ב־3H₂O?'],
  'Why should a subscript not be changed while balancing?': ['لماذا لا يجوز تغيير الرقم السفلي أثناء الموازنة؟', 'מדוע אסור לשנות מספר תחתון במהלך האיזון?'],
  'Count hydrogen: the left side has 4 H atoms and the right side has 4 H atoms. Count oxygen: the left side has 2 O atoms and the right side has 2 O atoms. The equation is balanced.': ['عند عدّ الهيدروجين نجد 4 ذرات H في كل جانب. وعند عدّ الأكسجين نجد ذرتي O في كل جانب. المعادلة موزونة.', 'בספירת המימן יש 4 אטומי H בכל צד. בספירת החמצן יש 2 אטומי O בכל צד. המשוואה מאוזנת.'],
  'Why must each element have the same atom count on both sides?': ['لماذا يجب أن يكون لكل عنصر العدد نفسه من الذرات في الجانبين؟', 'מדוע לכל יסוד חייב להיות אותו מספר אטומים בשני הצדדים?'],
  'How many H atoms are in 2H₂?': ['كم ذرة H توجد في 2H₂؟', 'כמה אטומי H יש ב־2H₂?'],
  'How many O atoms are in 2H₂O?': ['كم ذرة O توجد في 2H₂O؟', 'כמה אטומי O יש ב־2H₂O?'],
  'Is H₂ + O₂ → H₂O balanced? Explain by counting atoms.': ['هل المعادلة H₂ + O₂ → H₂O موزونة؟ وضّح ذلك بعدّ الذرات.', 'האם H₂ + O₂ → H₂O מאוזנת? הסבירו באמצעות ספירת אטומים.'],
  'Use a reliable step-by-step method': ['استخدم طريقة موثوقة خطوة بخطوة', 'השתמשו בשיטה אמינה שלב אחר שלב'],
  'Balancing is not about changing the substances. It is about finding coefficients that make the number of atoms of every element equal on both sides.': ['لا تعني الموازنة تغيير المواد، بل إيجاد معاملات تجعل عدد ذرات كل عنصر متساويًا في الجانبين.', 'איזון אינו שינוי החומרים, אלא מציאת מקדמים שמשווים את מספר האטומים של כל יסוד בשני הצדדים.'],
  'Step 1 — Write the correct formulas': ['الخطوة 1 — اكتب الصيغ الصحيحة', 'שלב 1 — כתבו את הנוסחאות הנכונות'],
  'Make sure every element symbol and chemical formula is correct before balancing. Remember that capitalization matters: Co is cobalt, while CO represents carbon monoxide.': ['تأكد من صحة رمز كل عنصر وكل صيغة كيميائية قبل الموازنة. تذكّر أن حالة الأحرف مهمة: Co هو الكوبالت، بينما CO يمثل أول أكسيد الكربون.', 'ודאו שכל סמל יסוד וכל נוסחה כימית נכונים לפני האיזון. זכרו שגודל האות חשוב: Co הוא קובלט, ואילו CO מייצג פחמן חד־חמצני.'],
  'Step 2 — Count every atom': ['الخطوة 2 — عُدّ كل ذرة', 'שלב 2 — ספרו כל אטום'],
  'Write down the number of atoms of each element on the reactant side and product side.': ['دوّن عدد ذرات كل عنصر في جانب المتفاعلات وجانب النواتج.', 'רשמו את מספר האטומים של כל יסוד בצד המגיבים ובצד התוצרים.'],
  'Step 3 — Add coefficients': ['الخطوة 3 — أضف المعاملات', 'שלב 3 — הוסיפו מקדמים'],
  'Place whole-number coefficients in front of formulas. Do not change subscripts.': ['ضع معاملات صحيحة أمام الصيغ، ولا تغيّر الأرقام السفلية.', 'הציבו מקדמים שלמים לפני הנוסחאות. אל תשנו מספרים תחתיים.'],
  'Step 4 — Recount all elements': ['الخطوة 4 — أعد عدّ جميع العناصر', 'שלב 4 — ספרו מחדש את כל היסודות'],
  'After every change, count the atoms again.': ['بعد كل تغيير، أعد عدّ الذرات.', 'לאחר כל שינוי, ספרו שוב את האטומים.'],
  'Step 5 — Check the final equation': ['الخطوة 5 — تحقق من المعادلة النهائية', 'שלב 5 — בדקו את המשוואה הסופית'],
  'Make sure every element has exactly the same number of atoms on both sides and that the coefficients are in the smallest whole-number ratio.': ['تأكد من أن لكل عنصر العدد نفسه تمامًا من الذرات في الجانبين، وأن المعاملات في أصغر نسبة من أعداد صحيحة.', 'ודאו שלכל יסוד יש בדיוק אותו מספר אטומים בשני הצדדים ושהמקדמים הם ביחס השלמים הקטן ביותר.'],
  'Put 2 before H₂O.': ['ضع 2 قبل H₂O.', 'הציבו 2 לפני H₂O.'],
  'Put 2 before H₂.': ['ضع 2 قبل H₂.', 'הציבו 2 לפני H₂.'],
  'H = 4 on both sides and O = 2 on both sides.': ['H = 4 في الجانبين وO = 2 في الجانبين.', 'H = 4 בשני הצדדים ו־O = 2 בשני הצדדים.'],
  'Balance Fe + O₂ → Fe₂O₃.': ['وازن Fe + O₂ → Fe₂O₃.', 'אזנו Fe + O₂ → Fe₂O₃.'],
  'Balance H₂ + Cl₂ → HCl.': ['وازن H₂ + Cl₂ → HCl.', 'אזנו H₂ + Cl₂ → HCl.'],
  'Balance N₂ + H₂ → NH₃.': ['وازن N₂ + H₂ → NH₃.', 'אזנו N₂ + H₂ → NH₃.'],
  'Which formula represents elemental oxygen?': ['أي صيغة تمثل الأكسجين العنصري؟', 'איזו נוסחה מייצגת חמצן יסודי?'],
  'Which formula represents elemental chlorine?': ['أي صيغة تمثل الكلور العنصري؟', 'איזו נוסחה מייצגת כלור יסודי?'],
  'Balance H₂ + O₂ → H₂O.': ['وازن H₂ + O₂ → H₂O.', 'אזנו H₂ + O₂ → H₂O.'],
  'Build beyond': ['تجاوز', 'התקדמו מעבר'],
  'the basics.': ['الأساسيات.', 'ליסודות.'],
  'Learn the ideas you need for equations involving groups, parentheses, fractions and more complicated reactions.': ['تعلّم الأفكار اللازمة لمعادلات تتضمن مجموعات وأقواسًا وكسورًا وتفاعلات أكثر تعقيدًا.', 'למדו את הרעיונות הדרושים למשוואות הכוללות קבוצות, סוגריים, שברים ותגובות מורכבות יותר.'],
  '01 · POLYATOMIC IONS': ['01 · الأيونات متعددة الذرات', '01 · יונים רב־אטומיים'],
  '02 · PARENTHESES': ['02 · الأقواس', '02 · סוגריים'],
  '03 · FRACTIONAL COEFFICIENTS': ['03 · المعاملات الكسرية', '03 · מקדמים שבריים'],
  '04 · COMPLICATED REACTIONS': ['04 · التفاعلات المعقدة', '04 · תגובות מורכבות'],
  'Recognize groups that can stay together': ['تعرّف على المجموعات التي يمكن أن تبقى معًا', 'זהו קבוצות שיכולות להישאר יחד'],
  'Polyatomic ions are groups of atoms that carry an overall charge, such as SO₄²⁻, NO₃⁻ and OH⁻. In many equations, the same polyatomic ion appears unchanged on both sides. When that happens, treating the group as one unit can make balancing easier.': ['الأيونات متعددة الذرات مجموعات من الذرات تحمل شحنة كلية، مثل SO₄²⁻ وNO₃⁻ وOH⁻. في كثير من المعادلات يظهر الأيون نفسه دون تغيير في الجانبين، وعندها يمكن التعامل معه كوحدة واحدة لتسهيل الموازنة.', 'יונים רב־אטומיים הם קבוצות אטומים בעלות מטען כולל, כגון SO₄²⁻, NO₃⁻ ו־OH⁻. במשוואות רבות אותו יון מופיע ללא שינוי בשני הצדדים, ואז אפשר להתייחס לקבוצה כיחידה אחת כדי להקל על האיזון.'],
  'OH and H₂O must still be counted atom by atom when needed. Do not change a subscript inside a chemical formula.': ['يجب مع ذلك عدّ OH وH₂O ذرةً ذرة عند الحاجة. لا تغيّر رقمًا سفليًا داخل صيغة كيميائية.', 'עדיין יש לספור את OH ואת H₂O אטום אחר אטום בעת הצורך. אל תשנו מספר תחתון בתוך נוסחה כימית.'],
  'How many oxygen atoms are in 2SO₄?': ['كم ذرة أكسجين توجد في 2SO₄؟', 'כמה אטומי חמצן יש ב־2SO₄?'],
  'What atoms are in NO₃?': ['ما الذرات الموجودة في NO₃؟', 'אילו אטומים יש ב־NO₃?'],
  'Why can an unchanged polyatomic group sometimes be balanced as a unit?': ['لماذا يمكن أحيانًا موازنة مجموعة متعددة الذرات لم تتغير كوحدة واحدة؟', 'מדוע אפשר לפעמים לאזן קבוצה רב־אטומית שלא השתנתה כיחידה אחת?'],
  'Count everything inside a group': ['عُدّ كل ما داخل المجموعة', 'ספרו את כל מה שנמצא בתוך הקבוצה'],
  'A subscript outside parentheses multiplies every atom inside the parentheses.': ['يضرب الرقم السفلي خارج القوس كل ذرة داخل القوس.', 'מספר תחתון מחוץ לסוגריים מכפיל כל אטום שבתוכם.'],
  'Ca(OH)₂ contains 1 Ca, 2 O and 2 H. The 2 applies to both O and H.': ['يحتوي Ca(OH)₂ على Ca واحد وذرتي O وذرتي H. وينطبق الرقم 2 على O وH معًا.', 'ב־Ca(OH)₂ יש Ca אחד, שני O ושני H. המספר 2 חל גם על O וגם על H.'],
  'Al₂(SO₄)₃ contains 2 Al, 3 S and 12 O.': ['يحتوي Al₂(SO₄)₃ على ذرتي Al و3 ذرات S و12 ذرة O.', 'ב־Al₂(SO₄)₃ יש שני Al, שלושה S ושנים עשר O.'],
  'Count every atom in Mg(OH)₂.': ['عُدّ كل ذرة في Mg(OH)₂.', 'ספרו כל אטום ב־Mg(OH)₂.'],
  'Count every atom in Al₂(SO₄)₃.': ['عُدّ كل ذرة في Al₂(SO₄)₃.', 'ספרו כל אטום ב־Al₂(SO₄)₃.'],
  'Why does the 3 outside SO₄ multiply oxygen as well as sulfur?': ['لماذا يضرب الرقم 3 خارج SO₄ الأكسجين والكبريت معًا؟', 'מדוע המספר 3 שמחוץ ל־SO₄ מכפיל גם את החמצן וגם את הגופרית?'],
  'Use fractions when they simplify the process': ['استخدم الكسور عندما تبسّط العملية', 'השתמשו בשברים כאשר הם מפשטים את התהליך'],
  'Sometimes a fractional coefficient is convenient during balancing. Fractions are temporary: after the equation is balanced, multiply every coefficient by the denominator needed to produce the smallest whole-number ratio.': ['قد يكون المعامل الكسري مفيدًا أثناء الموازنة. الكسور مؤقتة: بعد موازنة المعادلة اضرب كل معامل في المقام اللازم للحصول على أصغر نسبة من أعداد صحيحة.', 'לפעמים מקדם שברי נוח במהלך האיזון. השברים זמניים: לאחר איזון המשוואה, הכפילו כל מקדם במכנה הדרוש לקבלת יחס השלמים הקטן ביותר.'],
  'Multiplying every coefficient by 2 gives:': ['ضرب كل معامل في 2 يعطي:', 'הכפלת כל מקדם ב־2 נותנת:'],
  'Why can a fraction be useful while balancing?': ['لماذا قد يكون الكسر مفيدًا أثناء الموازنة؟', 'מדוע שבר יכול להיות שימושי במהלך האיזון?'],
  'What must you do before giving the final answer?': ['ماذا يجب أن تفعل قبل تقديم الإجابة النهائية؟', 'מה צריך לעשות לפני מתן התשובה הסופית?'],
  'Turn 1/2, 3 and 2 into the smallest whole-number ratio.': ['حوّل 1/2 و3 و2 إلى أصغر نسبة من أعداد صحيحة.', 'המירו את 1/2, 3 ו־2 ליחס השלמים הקטן ביותר.'],
  'Choose an order and check repeatedly': ['اختر ترتيبًا وتحقق مرارًا', 'בחרו סדר ובדקו שוב ושוב'],
  'For larger equations, start with an element that appears in fewer formulas. Leave hydrogen and oxygen until later when they occur in many compounds. After each coefficient change, recount every affected element.': ['في المعادلات الأكبر، ابدأ بعنصر يظهر في عدد أقل من الصيغ. اترك الهيدروجين والأكسجين إلى مرحلة لاحقة عندما يظهران في مركبات كثيرة. بعد كل تغيير في المعامل، أعد عدّ كل عنصر متأثر.', 'במשוואות גדולות יותר, התחילו ביסוד שמופיע בפחות נוסחאות. השאירו את המימן והחמצן לשלב מאוחר כאשר הם מופיעים בתרכובות רבות. לאחר כל שינוי מקדם, ספרו מחדש כל יסוד שהושפע.'],
  'A useful strategy is to recognize SO₄ as an unchanged group, balance Fe, then OH, then K, and finally verify every element.': ['استراتيجية مفيدة هي اعتبار SO₄ مجموعة لم تتغير، ثم موازنة Fe، ثم OH، ثم K، وأخيرًا التحقق من كل عنصر.', 'אסטרטגיה שימושית היא לזהות את SO₄ כקבוצה שלא השתנתה, לאזן את Fe, אחר כך את OH, אחר כך את K, ולבסוף לבדוק כל יסוד.'],
  'Which element or group would you balance first and why?': ['أي عنصر أو مجموعة ستوازن أولًا، ولماذا؟', 'איזה יסוד או קבוצה הייתם מאזנים תחילה, ומדוע?'],
  'Balance Fe₂(SO₄)₃ + KOH → Fe(OH)₃ + K₂SO₄.': ['وازن Fe₂(SO₄)₃ + KOH → Fe(OH)₃ + K₂SO₄.', 'אזנו Fe₂(SO₄)₃ + KOH → Fe(OH)₃ + K₂SO₄.'],
  'How can you verify your final coefficients?': ['كيف يمكنك التحقق من معاملاتك النهائية؟', 'כיצד אפשר לבדוק את המקדמים הסופיים?'],
  'Reactants, products, reaction arrows, and how to read an equation.': ['المتفاعلات والنواتج وأسهم التفاعل وكيفية قراءة المعادلة.', 'מגיבים, תוצרים, חיצי תגובה וכיצד לקרוא משוואה.'],
  'Subscripts, parentheses, coefficients, and how atom counts are built.': ['الأرقام السفلية والأقواس والمعاملات وكيفية حساب عدد الذرات.', 'מספרים תחתיים, סוגריים, מקדמים וכיצד נבנית ספירת האטומים.'],
  'Why every element must have the same total atom count on both sides.': ['لماذا يجب أن يكون لكل عنصر العدد الإجمالي نفسه من الذرات في الجانبين.', 'מדוע לכל יסוד חייב להיות אותו מספר כולל של אטומים בשני הצדדים.'],
  'Coefficients and balancing': ['المعاملات والموازنة', 'מקדמים ואיזון'],
  'A reliable step-by-step method, including a worked example.': ['طريقة موثوقة خطوة بخطوة، تشمل مثالًا محلولًا.', 'שיטה אמינה שלב אחר שלב, כולל דוגמה פתורה.'],
  'Recognize H₂, N₂, O₂, F₂, Cl₂, Br₂, and I₂ when they are free elements.': ['تعرّف على H₂ وN₂ وO₂ وF₂ وCl₂ وBr₂ وI₂ عندما تكون عناصر حرة.', 'זהו H₂, N₂, O₂, F₂, Cl₂, Br₂ ו־I₂ כאשר הם יסודות חופשיים.'],
  'Use a final checklist and practise before moving to Intermediate.': ['استخدم قائمة تحقق نهائية وتدرّب قبل الانتقال إلى المستوى المتوسط.', 'השתמשו ברשימת בדיקה סופית ותרגלו לפני המעבר לרמת הביניים.'],
  'Recognize groups that can sometimes be balanced as units.': ['تعرّف على المجموعات التي يمكن أحيانًا موازنتها كوحدات.', 'זהו קבוצות שלפעמים אפשר לאזן כיחידות.'],
  'Understand how outside subscripts multiply every atom inside.': ['افهم كيف تضرب الأرقام السفلية الخارجية كل ذرة في الداخل.', 'הבינו כיצד מספרים תחתיים חיצוניים מכפילים כל אטום בפנים.'],
  'Fractional coefficients': ['المعاملات الكسرية', 'מקדמים שבריים'],
  'Use temporary fractions, then convert to the smallest whole numbers.': ['استخدم كسورًا مؤقتة، ثم حوّلها إلى أصغر أعداد صحيحة.', 'השתמשו בשברים זמניים ואז המירו אותם למספרים השלמים הקטנים ביותר.'],
  'Complicated reactions': ['التفاعلات المعقدة', 'תגובות מורכבות'],
  'Choose a useful balancing order and verify every element.': ['اختر ترتيبًا مفيدًا للموازنة وتحقق من كل عنصر.', 'בחרו סדר איזון שימושי ובדקו כל יסוד.'],
  'Combustion': ['الاحتراق', 'בעירה'],
  'Balance carbon and hydrogen first, then oxygen.': ['وازن الكربون والهيدروجين أولًا، ثم الأكسجين.', 'אזנו תחילה פחמן ומימן, ואז חמצן.'],
  'Redox': ['الأكسدة والاختزال', 'חמצון־חיזור'],
  'Track oxidation, reduction, atoms, and charge.': ['تتبّع الأكسدة والاختزال والذرات والشحنة.', 'עקבו אחר חמצון, חיזור, אטומים ומטען.'],
  'Complex ionic equations': ['المعادلات الأيونية المعقدة', 'משוואות יוניות מורכבות'],
  'Balance atoms and charge systematically.': ['وازن الذرات والشحنة بطريقة منهجية.', 'אזנו אטומים ומטען באופן שיטתי.'],
  'Systematic balancing': ['الموازنة المنهجية', 'איזון שיטתי'],
  'Use conservation equations when guessing becomes difficult.': ['استخدم معادلات الحفظ عندما يصبح التخمين صعبًا.', 'השתמשו במשוואות שימור כאשר הניחוש נעשה קשה.'],
  'Simple equations and core ideas': ['معادلات بسيطة وأفكار أساسية', 'משוואות פשוטות ורעיונות בסיסיים'],
  'Parentheses and more steps': ['أقواس وخطوات إضافية', 'סוגריים ושלבים נוספים'],
  'Complex and combustion reactions': ['تفاعلات معقدة وتفاعلات احتراق', 'תגובות מורכבות ותגובות בעירה'],
  'ADMIN': ['الإدارة', 'ניהול'],
  'Admin tools': ['أدوات الإدارة', 'כלי ניהול'],
  'Private testing controls for the site owner.': ['أدوات اختبار خاصة بمالك الموقع.', 'פקדי בדיקה פרטיים לבעל האתר.'],
  'Daily Challenge': ['التحدي اليومي', 'האתגר היומי'],
  'Reset today’s challenge and open Learn with a fresh start.': ['أعد تعيين تحدي اليوم وافتح صفحة التعلّم ببداية جديدة.', 'אפסו את האתגר של היום ופתחו את דף הלמידה להתחלה חדשה.'],
  'Replay Daily Challenge': ['إعادة التحدي اليومي', 'הפעלה מחדש של האתגר היומי'],
  'Fresh Challenge': ['تحدٍ جديد', 'אתגר חדש'],
  'Clear saved Daily Challenge state and open Learn.': ['امسح حالة التحدي اليومي المحفوظة وافتح صفحة التعلّم.', 'נקו את מצב האתגר היומי השמור ופתחו את דף הלמידה.'],
  'Reset & Open Learn': ['إعادة التعيين وفتح التعلّم', 'איפוס ופתיחת הלמידה'],
  'Test Progress': ['تقدم الاختبار', 'התקדמות בדיקה'],
  'Clear local XP, streak, and student-progress data.': ['امسح بيانات الخبرة والسلسلة وتقدم الطالب المحفوظة محليًا.', 'נקו נתוני XP, רצף והתקדמות תלמיד השמורים מקומית.'],
  'Clear Test Progress': ['مسح تقدم الاختبار', 'ניקוי התקדמות הבדיקה'],
  'Certificate Preview': ['معاينة الشهادة', 'תצוגה מקדימה של התעודה'],
  'Admin key': ['مفتاح الإدارة', 'מפתח ניהול'],
  'Open dashboard': ['فتح لوحة التحكم', 'פתיחת לוח הבקרה'],
  'Enter your admin key.': ['أدخل مفتاح الإدارة.', 'הזינו את מפתח הניהול.'],
  'Analytics loaded.': ['تم تحميل التحليلات.', 'הנתונים נטענו.'],
  'Admin testing tools': ['أدوات اختبار الإدارة', 'כלי בדיקה למנהלים'],
  'These controls are only for testing this browser. They do not modify student accounts.': ['هذه الأدوات لاختبار هذا المتصفح فقط ولا تعدّل حسابات الطلاب.', 'הפקדים האלה מיועדים לבדיקת הדפדפן בלבד ואינם משנים חשבונות תלמידים.'],
  'Privacy:': ['الخصوصية:', 'פרטיות:'],
  'visitor tables show aggregated country/city counts only. No IP addresses or visitor IDs are displayed. City is approximate IP-based geolocation and can differ from the visitor\'s actual location.': ['تعرض جداول الزوار أعدادًا مجمعة حسب الدولة والمدينة فقط. لا تظهر عناوين IP أو معرّفات الزوار. تحديد المدينة تقريبي اعتمادًا على IP وقد يختلف عن الموقع الفعلي للزائر.', 'טבלאות המבקרים מציגות רק ספירות מצטברות לפי מדינה ועיר. כתובות IP ומזהי מבקרים אינם מוצגים. מיקום העיר משוער לפי IP ועשוי להיות שונה מהמיקום בפועל.'],
  'Total registered accounts': ['إجمالي الحسابات المسجلة', 'סך החשבונות הרשומים'],
  'Active users': ['المستخدمون النشطون', 'משתמשים פעילים'],
  'last 30 minutes': ['آخر 30 دقيقة', 'ב־30 הדקות האחרונות'],
  'Unique viewers': ['المشاهدون الفريدون', 'צופים ייחודיים'],
  'Total page views': ['إجمالي مشاهدات الصفحات', 'סך הצפיות בדפים'],
  'Daily visitors': ['الزوار اليوميون', 'מבקרים יומיים'],
  'Weekly visitors': ['الزوار الأسبوعيون', 'מבקרים שבועיים'],
  'Monthly visitors': ['الزوار الشهريون', 'מבקרים חודשיים'],
  'Quizzes taken': ['الاختبارات المكتملة', 'חידונים שהושלמו'],
  'Average quiz score': ['متوسط نتيجة الاختبار', 'ציון חידון ממוצע'],
  'Visitors — last 7 days': ['الزوار — آخر 7 أيام', 'מבקרים — 7 הימים האחרונים'],
  'Unique viewers per day': ['المشاهدون الفريدون يوميًا', 'צופים ייחודיים ביום'],
  'Visitors by country': ['الزوار حسب الدولة', 'מבקרים לפי מדינה'],
  'Aggregated counts only.': ['أعداد مجمعة فقط.', 'ספירות מצטברות בלבד.'],
  'Country': ['الدولة', 'מדינה'],
  'Different viewers': ['مشاهدون مختلفون', 'צופים שונים'],
  'Views': ['المشاهدات', 'צפיות'],
  'Visitors by city': ['الزوار حسب المدينة', 'מבקרים לפי עיר'],
  'Approximate IP-based city. Not GPS.': ['مدينة تقريبية اعتمادًا على IP، وليس GPS.', 'עיר משוערת לפי IP, לא לפי GPS.'],
  'City': ['المدينة', 'עיר'],
  'Pages viewed by different viewers': ['الصفحات التي شاهدها مستخدمون مختلفون', 'דפים שנצפו בידי צופים שונים'],
  'Page names are shown instead of URLs.': ['تظهر أسماء الصفحات بدلًا من عناوين URL.', 'שמות הדפים מוצגים במקום כתובות URL.'],
  'Page': ['الصفحة', 'דף'],
  'Most popular difficulty': ['مستوى الصعوبة الأكثر شيوعًا', 'רמת הקושי הפופולרית ביותר'],
  'No quiz difficulty data yet.': ['لا توجد بيانات عن صعوبة الاختبارات بعد.', 'עדיין אין נתונים על רמות קושי.'],
  'Most used features': ['الميزات الأكثر استخدامًا', 'התכונות הנפוצות ביותר'],
  'No feature events yet.': ['لا توجد أحداث ميزات بعد.', 'עדיין אין אירועי שימוש בתכונות.'],
  'Balancer vs Quiz vs Learning': ['الموازنة مقابل الاختبار مقابل التعلّم', 'איזון לעומת חידון לעומת למידה'],
  'Most commonly missed questions': ['الأسئلة الأكثر شيوعًا في الأخطاء', 'השאלות שבהן טועים הכי הרבה'],
  'Question': ['السؤال', 'שאלה'],
  'Misses': ['الأخطاء', 'טעויות'],
  'Visitors by day': ['الزوار حسب اليوم', 'מבקרים לפי יום'],
  'Day': ['اليوم', 'יום'],
  'Accounts': ['الحسابات', 'חשבונות'],
  'Name': ['الاسم', 'שם'],
  'Username': ['اسم المستخدم', 'שם משתמש'],
  'Created': ['تاريخ الإنشاء', 'נוצר'],
  'last 30 days': ['آخر 30 يومًا', 'ב־30 הימים האחרונים'],
  'No data yet.': ['لا توجد بيانات بعد.', 'עדיין אין נתונים.'],
  'No visitor data yet.': ['لا توجد بيانات زوار بعد.', 'עדיין אין נתוני מבקרים.'],
  'Dark': ['داكن', 'כהה'],
  'Light': ['فاتح', 'בהיר']
};

function objectLiteralAfter(source, marker) {
  const match = marker.exec(source);
  if (!match) return null;
  let start = match.index + match[0].length;
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return null;
}

function cleanPair(pair) {
  if (!Array.isArray(pair) || pair.length < 2) return null;
  const ar = String(pair[0] ?? '').trim();
  const he = String(pair[1] ?? '').trim();
  const cleanArabic = ar && !/[֐-׿]/u.test(ar) ? ar : null;
  const cleanHebrew = he && !/[؀-ۿ]/u.test(he) ? he : null;
  return cleanArabic || cleanHebrew ? [cleanArabic, cleanHebrew] : null;
}

function normalizeMap(value) {
  const result = {};
  if (!value || typeof value !== 'object') return result;
  if (value.ar && value.he && typeof value.ar === 'object' && typeof value.he === 'object') {
    for (const key of new Set([...Object.keys(value.ar), ...Object.keys(value.he)])) {
      const pair = cleanPair([value.ar[key], value.he[key]]);
      if (pair) result[key] = pair;
    }
    return result;
  }
  for (const [key, item] of Object.entries(value)) {
    let pair = null;
    if (Array.isArray(item)) pair = cleanPair(item);
    else if (item && typeof item === 'object') pair = cleanPair([item.ar, item.he]);
    if (pair) result[key] = pair;
  }
  return result;
}

const dictionary = {};
for (const file of sources) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const literal = objectLiteralAfter(source, /const\s+(?:M|MAP|T)\s*=\s*/u);
  if (!literal) continue;
  const parsed = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
  for (const [key, pair] of Object.entries(normalizeMap(parsed))) {
    const current = dictionary[key] || [null, null];
    dictionary[key] = [current[0] || pair[0], current[1] || pair[1]];
  }
}

Object.assign(dictionary, overrides);
const ordered = Object.fromEntries(
  Object.entries(dictionary)
    .filter(([, pair]) => pair[0] && pair[1])
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
);
const output = `/* Generated by tools/build-i18n-dictionary.mjs. */\nwindow.ChemistryTranslations=${JSON.stringify(ordered)};\n`;
fs.writeFileSync(path.join(root, 'i18n-dictionary.js'), output, 'utf8');
console.log(`Generated ${Object.keys(ordered).length} translation entries.`);
