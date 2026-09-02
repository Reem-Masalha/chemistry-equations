(() => {
  'use strict';
  if (!location.pathname.endsWith('learn.html')) return;

  const BANK = [
    ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O'], ['Na + Cl₂ → NaCl', '2Na + Cl₂ → 2NaCl'],
    ['Mg + O₂ → MgO', '2Mg + O₂ → 2MgO'], ['N₂ + H₂ → NH₃', 'N₂ + 3H₂ → 2NH₃'],
    ['Fe + O₂ → Fe₂O₃', '4Fe + 3O₂ → 2Fe₂O₃'], ['Zn + HCl → ZnCl₂ + H₂', 'Zn + 2HCl → ZnCl₂ + H₂'],
    ['KClO₃ → KCl + O₂', '2KClO₃ → 2KCl + 3O₂'], ['Na₂O + H₂O → NaOH', 'Na₂O + H₂O → 2NaOH'],
    ['C₃H₈ + O₂ → CO₂ + H₂O', 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O'], ['NH₃ + O₂ → NO + H₂O', '4NH₃ + 5O₂ → 4NO + 6H₂O'],
    ['FeS₂ + O₂ → Fe₂O₃ + SO₂', '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂'], ['Ca(OH)₂ + HCl → CaCl₂ + H₂O', 'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O'],
    ['Al + O₂ → Al₂O₃', '4Al + 3O₂ → 2Al₂O₃'], ['CO + O₂ → CO₂', '2CO + O₂ → 2CO₂'],
    ['P + O₂ → P₂O₅', '4P + 5O₂ → 2P₂O₅'], ['H₂ + Cl₂ → HCl', 'H₂ + Cl₂ → 2HCl'],
    ['Ag + S → Ag₂S', '2Ag + S → Ag₂S'], ['CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 2O₂ → CO₂ + 2H₂O'],
    ['C₂H₆ + O₂ → CO₂ + H₂O', '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O'], ['CaCO₃ → CaO + CO₂', 'CaCO₃ → CaO + CO₂'],
    ['Cu + O₂ → CuO', '2Cu + O₂ → 2CuO'], ['Cl₂ + NaBr → NaCl + Br₂', '2NaBr + Cl₂ → 2NaCl + Br₂'],
    ['H₂O₂ → H₂O + O₂', '2H₂O₂ → 2H₂O + O₂'], ['SO₂ + O₂ → SO₃', '2SO₂ + O₂ → 2SO₃'],
    ['NO + O₂ → NO₂', '2NO + O₂ → 2NO₂']
  ];
  const today = () => new Date().toISOString().slice(0, 10);
  const dayNumber = () => Math.floor((Date.parse(today() + 'T00:00:00Z') - Date.parse('2020-01-01T00:00:00Z')) / 86400000);
  const qs = () => Array.from({length:5}, (_, i) => BANK[((dayNumber() * 5) % BANK.length + i) % BANK.length]);
  const key = () => 'chemistryDailyV5:' + today();
  const normalize = v => String(v || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/\s+/g,'').replace(/→|->|=/g,'>').toUpperCase().replace(/(^|>)1(?=[A-Z(])/g,'$1');
  const tr = (en, ar, he) => (localStorage.getItem('chemistryLanguage') || 'en') === 'ar' ? ar : (localStorage.getItem('chemistryLanguage') || 'en') === 'he' ? he : en;

  function init() {
    const root = document.getElementById('daily-v5');
    if (!root || root.dataset.submitFix === '1') return;
    root.dataset.submitFix = '1';
    const input = root.querySelector('#dailyInput'), submit = root.querySelector('#dailySubmit'), check = root.querySelector('#dailyCheck'), next = root.querySelector('#dailyNext');
    if (!input || !submit || !check || !next) return;
    let internalNext = false;
    let internalEvaluation = false;

    const read = () => { try { return JSON.parse(localStorage.getItem(key()) || '{}'); } catch (_) { return {}; } };
    const save = s => { try { localStorage.setItem(key(), JSON.stringify(s)); } catch (_) {} };
    const gradeCurrent = () => {
      const s = read();
      const i = Math.max(0, Math.min(4, Number(s.index) || 0));
      const value = input.value.trim();
      if (!value) return null;
      if (!Array.isArray(s.answers)) s.answers = [];
      if (!Array.isArray(s.status)) s.status = [];
      s.answers[i] = value;
      const correct = normalize(value) === normalize(qs()[i][1]);
      if (s.status[i] === undefined || Number(s.status[i]) === 0) {
        s.status[i] = correct ? 1 : 2;
        s.score = Math.max(0, Math.min(5, Number(s.score) || 0)) + (correct ? 1 : 0);
      }
      save(s);
      return correct;
    };

    const syncOriginalController = (correct) => {
      internalEvaluation = true;
      try {
        (correct ? check : submit).click();
      } finally {
        internalEvaluation = false;
      }
    };

    const advance = () => {
      internalNext = true;
      next.click();
      setTimeout(() => { internalNext = false; addReviewButton(); }, 0);
    };

    root.addEventListener('click', e => {
      if (internalEvaluation) return;

      if (e.target.closest('#dailySubmit')) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const correct = gradeCurrent();
        if (correct === null) {
          root.querySelector('#dailyFeedback').textContent = '⚠️ ' + tr('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');
          return;
        }
        syncOriginalController(correct);
        root.querySelector('#dailyFeedback').textContent = '✓ ' + tr('Answer submitted. Moving to the next question…','تم إرسال الإجابة. الانتقال إلى السؤال التالي…','התשובה נשלחה. עוברים לשאלה הבאה…');
        advance();
      }

      if (e.target.closest('#dailyNext') && !internalNext) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        const correct = gradeCurrent();
        if (correct === null) {
          root.querySelector('#dailyFeedback').textContent = '⚠️ ' + tr('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');
          return;
        }
        syncOriginalController(correct);
        root.querySelector('#dailyFeedback').textContent = '✓ ' + tr('Answer recorded. Moving to the next question…','تم تسجيل الإجابة. الانتقال إلى السؤال التالي…','התשובה נרשמה. עוברים לשאלה הבאה…');
        advance();
      }
    }, true);

    input.addEventListener('input', () => {
      const s = read(), i = Math.max(0, Math.min(4, Number(s.index) || 0));
      if (s.started && !s.complete && (!s.status || Number(s.status[i]) === 0) && input.value.trim()) next.hidden = false;
    });

    function addReviewButton() {
      const result = root.querySelector('#dailyResult');
      if (!result || result.hidden || result.querySelector('#dailyReviewBtn')) return;
      const button = document.createElement('button');
      button.id = 'dailyReviewBtn'; button.type = 'button'; button.className = 'secondary';
      button.textContent = tr('Review daily quiz answers','مراجعة إجابات الاختبار اليومي','סקירת תשובות החידון היומי');
      const panel = document.createElement('div'); panel.id = 'dailyReviewPanel'; panel.hidden = true;
      panel.style.cssText = 'margin-top:14px;display:grid;gap:10px;text-align:left;';
      button.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
        if (!panel.hidden) renderReview(panel);
      });
      result.appendChild(button); result.appendChild(panel);
    }

    function renderReview(panel) {
      const s = read(), answers = Array.isArray(s.answers) ? s.answers : [], status = Array.isArray(s.status) ? s.status : [];
      panel.replaceChildren();
      qs().forEach((q, i) => {
        const item = document.createElement('div'); item.style.cssText = 'padding:12px;border:1px solid var(--line,#dce3ee);border-radius:12px;background:var(--surface,#fff);';
        const state = Number(status[i]) === 1 ? tr('Correct','صحيح','נכון') : Number(status[i]) === 2 ? tr('Incorrect','خطأ','לא נכון') : tr('Not answered','لم تتم الإجابة','לא נענה');
        item.innerHTML = '<b>' + (i + 1) + '. ' + q[0] + '</b><div style="margin-top:6px">' + tr('Your answer: ','إجابتك: ','התשובה שלך: ') + '<span dir="ltr">' + (answers[i] || tr('No answer','لا توجد إجابة','אין תשובה')) + '</span></div><div>' + tr('Correct answer: ','الإجابة الصحيحة: ','התשובה الصحيحة: ') + '<span dir="ltr">' + q[1] + '</span></div><div style="margin-top:5px;font-weight:800">' + state + '</div>';
        panel.appendChild(item);
      });
    }

    const observer = new MutationObserver(addReviewButton);
    observer.observe(root, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden']});
    addReviewButton();
  }

  function wait() { const root = document.getElementById('daily-v5'); if (root) init(); else setTimeout(wait, 50); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wait, {once:true}); else wait();
})();