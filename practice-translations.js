(()=>{
  const language = window.ChemistryLanguage;
  if(!language?.translate) return;

  const t = language.translate;
  const add = (en, ar, he) => {
    t.en[en] = en;
    t.ar[en] = ar;
    t.he[en] = he;
  };

  const entries = [
    ['What does the arrow in a chemical equation show?','ماذا يُظهر السهم في المعادلة الكيميائية؟','מה מראה החץ במשוואה כימית؟'],
    ['What are the substances on the left called?','ماذا تُسمّى المواد الموجودة على اليسار؟','כיצד נקראים החומרים שבצד שמאל?'],
    ['What are the substances on the right called?','ماذا تُسمّى المواد الموجودة على اليمين؟','כיצד נקראים החומרים שבצד ימין?'],
    ['How many oxygen atoms are in Ca(OH)₂?','كم عدد ذرات الأكسجين في Ca(OH)₂؟','כמה אטומי חמצן יש ב-Ca(OH)₂?'],
    ['How many hydrogen atoms are in 3H₂O?','كم عدد ذرات الهيدروجين في 3H₂O؟','כמה אטומי מימן יש ב-3H₂O?'],
    ['What does the coefficient in 3H₂O multiply?','ماذا يضاعف المعامل في 3H₂O؟','מה מכפיל המקדם ב-3H₂O?'],
    ['Why should a subscript not be changed while balancing?','لماذا لا ينبغي تغيير الرقم السفلي أثناء الموازنة؟','מדוע אין לשנות מספר תחתון בזמן איזון?'],
    ['Why must each element have the same atom count on both sides?','لماذا يجب أن يكون لكل عنصر العدد نفسه من الذرات على الجانبين؟','מדוע חייב להיות לכל יסוד אותו מספר אטומים בשני הצדדים?'],
    ['How many H atoms are in 2H₂?','كم عدد ذرات H في 2H₂؟','כמה אטומי H יש ב-2H₂?'],
    ['How many O atoms are in 2H₂O?','كم عدد ذرات O في 2H₂O؟','כמה אטומי O יש ב-2H₂O?'],
    ['Is H₂ + O₂ → H₂O balanced? Explain by counting atoms.','هل H₂ + O₂ → H₂O موزونة؟ اشرح ذلك من خلال عدّ الذرات.','האם H₂ + O₂ → H₂O מאוזנת? הסבר באמצעות ספירת האטומים.'],
    ['Balance Fe + O₂ → Fe₂O₃.','وازن Fe + O₂ → Fe₂O₃.','אזן את Fe + O₂ → Fe₂O₃.'],
    ['Balance H₂ + Cl₂ → HCl.','وازن H₂ + Cl₂ → HCl.','אזן את H₂ + Cl₂ → HCl.'],
    ['Balance N₂ + H₂ → NH₃.','وازن N₂ + H₂ → NH₃.','אזן את N₂ + H₂ → NH₃.'],
    ['Why must you avoid changing subscripts?','لماذا يجب تجنّب تغيير الأرقام السفلية؟','מדוע יש להימנע משינוי מספרים תחתונים?'],
    ['What should you check after adding all coefficients?','ماذا يجب أن تتحقق منه بعد إضافة جميع المعاملات؟','מה צריך לבדוק לאחר הוספת כל המקדמים?'],
    ['Which formula represents elemental oxygen?','أي صيغة تمثل الأكسجين العنصري؟','איזו נוסחה מייצגת חמצן יסודי?'],
    ['Which formula represents elemental chlorine?','أي صيغة تمثل الكلور العنصري؟','איזו נוסחה מייצגת כלור יסודי?'],
    ['Why does O₂ contain two oxygen atoms?','لماذا يحتوي O₂ على ذرتي أكسجين؟','מדוע O₂ מכיל שני אטומי חמצן?'],
    ['Balance H₂ + O₂ → H₂O.','وازن H₂ + O₂ → H₂O.','אזן את H₂ + O₂ → H₂O.'],
    ['Balance N₂ + H₂ → NH₃.','وازن N₂ + H₂ → NH₃.','אזן את N₂ + H₂ → NH₃.']
  ];

  entries.forEach(x=>add(...x));

  // Make the balancing checklist part of the same translation dictionary.
  add('Balancing checklist','قائمة تحقق للموازنة','רשימת בדיקה לאיזון');
  add('Correct element symbols','رموز العناصر الصحيحة','סמלי היסודות הנכונים');
  add('Correct chemical formulas and subscripts','الصيغ الكيميائية الصحيحة والأرقام السفلية الصحيحة','נוסחאות כימיות ומספרים תחתונים נכונים');
  add('Correct diatomic formulas when applicable','الصيغ الصحيحة للعناصر ثنائية الذرة عند الحاجة','נוסחאות נכונות של יסודות דו-אטומיים כאשר הדבר רלוונטי');
  add('Count atoms on both sides','عُدّ الذرات على كلا الجانبين','ספור את האטומים בשני הצדדים');
  add('Add coefficients instead of changing formulas','أضف المعاملات بدلًا من تغيير الصيغ','הוסף מקדמים במקום לשנות נוסחאות');
  add('Recount every element','أعد عَدّ جميع العناصر','ספור מחדש את כל היסודות');
  add('Use the smallest whole-number ratio','استخدم أصغر نسبة ممكنة من الأعداد الصحيحة','השתמש ביחס הקטן ביותר של מספרים שלמים');

  const current = language.get();
  language.set(current);
})();
