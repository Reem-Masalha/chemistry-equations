(() => {
  'use strict';
  if (!location.pathname.endsWith('learn.html')) return;

  const tr = (en, ar, he) => {
    const lang = localStorage.getItem('chemistryLanguage') || 'en';
    return lang === 'ar' ? ar : lang === 'he' ? he : en;
  };

  const equations = [
    ['H₂ + O₂ → H₂O','2H₂ + O₂ → 2H₂O'], ['Na + Cl₂ → NaCl','2Na + Cl₂ → 2NaCl'],
    ['Mg + O₂ → MgO','2Mg + O₂ → 2MgO'], ['N₂ + H₂ → NH₃','N₂ + 3H₂ → 2NH₃'],
    ['Fe + O₂ → Fe₂O₃','4Fe + 3O₂ → 2Fe₂O₃'], ['Zn + HCl → ZnCl₂ + H₂','Zn + 2HCl → ZnCl₂ + H₂'],
    ['KClO₃ → KCl + O₂','2KClO₃ → 2KCl + 3O₂'], ['Na₂O + H₂O → NaOH','Na₂O + H₂O → 2NaOH'],
    ['C₃H₈ + O₂ → CO₂ + H₂O','C₃H₈ + 5O₂ → 3CO₂ + 4H₂O'], ['NH₃ + O₂ → NO + H₂O','4NH₃ + 5O₂ → 4NO + 6H₂O'],
    ['FeS₂ + O₂ → Fe₂O₃ + SO₂','4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂'], ['Ca(OH)₂ + HCl → CaCl₂ + H₂O','Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O'],
    ['Al + O₂ → Al₂O₃','4Al + 3O₂ → 2Al₂O₃'], ['CO + O₂ → CO₂','2CO + O₂ → 2CO₂'],
    ['P + O₂ → P₂O₅','4P + 5O₂ → 2P₂O₅'], ['H₂ + Cl₂ → HCl','H₂ + Cl₂ → 2HCl'],
    ['Ag + S → Ag₂S','2Ag + S → Ag₂S'], ['CH₄ + O₂ → CO₂ + H₂O','CH₄ + 2O₂ → CO₂ + 2H₂O'],
    ['C₂H₆ + O₂ → CO₂ + H₂O','2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O'], ['CaCO₃ → CaO + CO₂','CaCO₃ → CaO + CO₂'],
    ['Cu + O₂ → CuO','2Cu + O₂ → 2CuO'], ['Cl₂ + NaBr → NaCl + Br₂','2NaBr + Cl₂ → 2NaCl + Br₂'],
    ['H₂O₂ → H₂O + O₂','2H₂O₂ → 2H₂O + O₂'], ['SO₂ + O₂ → SO₃','2SO₂ + O₂ → 2SO₃'],
    ['NO + O₂ → NO₂','2NO + O₂ → 2NO₂']
  ];

  const normalize = value => String(value || '')
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)])
    .replace(/\s+/g, '')
    .replace(/→|->|=/g, '>')
    .toUpperCase()
    .replace(/(^|>)1(?=[A-Z(])/g, '$1');

  function todayKey() { return new Date().toISOString().slice(0, 10); }
  function getState() { try { return JSON.parse(localStorage.getItem('chemistryDailyV5:' + todayKey()) || '{}'); } catch (_) { return {}; } }
  function saveState(state) { try { localStorage.setItem('chemistryDailyV5:' + todayKey(), JSON.stringify(state)); } catch (_) {} }

  function recordTypedAnswer(state, index, value) {
    const answers = Array.isArray(state.answers) ? state.answers.slice() : [];
    const status = Array.isArray(state.status) ? state.status.slice() : [];
    if (Number(status[index]) > 0) return state;
    answers[index] = value;
    const day = Math.floor((Date.parse(todayKey() + 'T00:00:00Z') - Date.parse('2020-01-01T00:00:00Z')) / 86400000);
    const start = ((day * 5) % equations.length + equations.length) % equations.length;
    const correct = normalize(value) === normalize(equations[(start + index) % equations.length][1]);
    status[index] = correct ? 1 : 2;
    let score = Math.max(0, Math.min(5, Number(state.score) || 0));
    if (correct) score += 1;
    return { ...state, score, status, answers };
  }

  function advance(root, requireVisibleNext) {
    const input = root.querySelector('#dailyInput');
    const next = root.querySelector('#dailyNext');
    if (!input || !next) return;
    if (requireVisibleNext && (next.hidden || next.disabled)) return;
    let state = getState();
    const index = Math.max(0, Math.min(4, Number(state.index) || 0));
    const status = Array.isArray(state.status) ? state.status : [];
    if (Number(status[index]) === 0) {
      const value = input.value.trim();
      if (!value) return;
      state = recordTypedAnswer(state, index, value);
    }
    if (Number(state.status?.[index]) === 0) return;
    if (index < 4) {
      state.index = index + 1;
      saveState(state);
      location.reload();
    } else {
      state.index = 5;
      state.complete = true;
      state.started = false;
      saveState(state);
      location.reload();
    }
  }

  function init() {
    const root = document.getElementById('daily-v5');
    if (!root || root.dataset.submitFix === '7') return;
    const input = root.querySelector('#dailyInput');
    const submit = root.querySelector('#dailySubmit');
    const check = root.querySelector('#dailyCheck');
    let next = root.querySelector('#dailyNext');
    const result = root.querySelector('#dailyResult');
    if (!input || !submit || !check || !next || !result) return;
    root.dataset.submitFix = '7';

    const replacement = next.cloneNode(true);
    next.replaceWith(replacement);
    next = replacement;
    next.addEventListener('click', () => advance(root, true));

    submit.addEventListener('click', () => {
      setTimeout(() => {
        if (root.isConnected) advance(root, false);
      }, 0);
    });

    function addReviewButton() {
      if (root.querySelector('#dailyReviewBtn') || result.hidden) return;
      const button = document.createElement('button');
      button.id = 'dailyReviewBtn';
      button.type = 'button';
      button.className = 'secondary';
      button.textContent = tr('Review daily quiz answers', 'مراجعة إجابات الاختبار اليومي', 'סקירת תשובות החידון היומי');
      const panel = document.createElement('div');
      panel.id = 'dailyReviewPanel';
      panel.hidden = true;
      panel.style.cssText = 'margin-top:14px;display:grid;gap:10px;text-align:left;';
      button.addEventListener('click', () => { panel.hidden = !panel.hidden; if (!panel.hidden) renderReview(panel); });
      result.appendChild(button);
      result.appendChild(panel);
    }

    function renderReview(panel) {
      const state = getState();
      const answers = Array.isArray(state.answers) ? state.answers : [];
      const status = Array.isArray(state.status) ? state.status : [];
      const day = Math.floor((Date.parse(todayKey() + 'T00:00:00Z') - Date.parse('2020-01-01T00:00:00Z')) / 86400000);
      const start = ((day * 5) % equations.length + equations.length) % equations.length;
      panel.replaceChildren();
      for (let i = 0; i < 5; i++) {
        const q = equations[(start + i) % equations.length];
        const item = document.createElement('div');
        item.style.cssText = 'padding:12px;border:1px solid var(--line,#dce3ee);border-radius:12px;background:var(--surface,#fff);';
        const stateText = Number(status[i]) === 1 ? tr('Correct','صحيح','נכון') : Number(status[i]) === 2 ? tr('Incorrect','خطأ','לא נכון') : tr('Not answered','لم تتم الإجابة','לא נענה');
        item.innerHTML = '<b>' + (i + 1) + '. ' + q[0] + '</b>' +
          '<div style="margin-top:6px">' + tr('Your answer: ','إجابتك: ','התשובה שלך: ') + '<span dir="ltr">' + (answers[i] || tr('No answer','لا توجد إجابة','אין תשובה')) + '</span></div>' +
          '<div>' + tr('Correct answer: ','الإجابة الصحيحة: ','התשובה الصحيحة: ') + '<span dir="ltr">' + q[1] + '</span></div>' +
          '<div style="margin-top:5px;font-weight:800">' + stateText + '</div>';
        panel.appendChild(item);
      }
    }

    const observer = new MutationObserver(addReviewButton);
    observer.observe(result, { childList:true, subtree:true, attributes:true, attributeFilter:['hidden'] });
    addReviewButton();
  }

  function wait() { if (document.getElementById('daily-v5')) init(); else setTimeout(wait, 50); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wait, { once:true });
  else wait();
})();