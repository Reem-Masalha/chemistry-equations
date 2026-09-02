(() => {
  'use strict';

  if (!location.pathname.endsWith('learn.html')) return;

  const language = () => localStorage.getItem('chemistryLanguage') || 'en';
  const tr = (en, ar, he) => language() === 'ar' ? ar : language() === 'he' ? he : en;
  const today = () => new Date().toISOString().slice(0, 10);
  const dayNumber = () => Math.floor((Date.parse(today() + 'T00:00:00Z') - Date.parse('2020-01-01T00:00:00Z')) / 86400000);

  const BANK = [
    ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', 'Make the product oxygen count even: use 2H₂O. Then match H.'],
    ['Na + Cl₂ → NaCl', '2Na + Cl₂ → 2NaCl', 'Cl₂ has two chlorine atoms, so use 2NaCl. Then match Na.'],
    ['Mg + O₂ → MgO', '2Mg + O₂ → 2MgO', 'O₂ has two oxygen atoms, so use 2MgO. Then match Mg.'],
    ['N₂ + H₂ → NH₃', 'N₂ + 3H₂ → 2NH₃', 'Use 2NH₃ to match N₂. Then use 3H₂ for the six H atoms.'],
    ['Fe + O₂ → Fe₂O₃', '4Fe + 3O₂ → 2Fe₂O₃', 'Make six O atoms with 2Fe₂O₃. Then match Fe and O₂.'],
    ['Zn + HCl → ZnCl₂ + H₂', 'Zn + 2HCl → ZnCl₂ + H₂', 'Zn is already balanced. ZnCl₂ needs two Cl, so use 2HCl.'],
    ['KClO₃ → KCl + O₂', '2KClO₃ → 2KCl + 3O₂', 'Make six O atoms with 2KClO₃, then use 3O₂.'],
    ['Na₂O + H₂O → NaOH', 'Na₂O + H₂O → 2NaOH', 'There are two Na atoms, so use 2NaOH.'],
    ['C₃H₈ + O₂ → CO₂ + H₂O', 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'For combustion: balance C first, H second, and O last.'],
    ['NH₃ + O₂ → NO + H₂O', '4NH₃ + 5O₂ → 4NO + 6H₂O', 'N is already 1:1. Start with H: 4NH₃ gives 12 H, so use 6H₂O. Then finish O.'],
    ['FeS₂ + O₂ → Fe₂O₃ + SO₂', '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂', 'Balance Fe first, then S. Leave O until the end.'],
    ['Ca(OH)₂ + HCl → CaCl₂ + H₂O', 'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O', 'Use 2HCl for two Cl atoms, then 2H₂O balances H and O.'],
    ['Al + O₂ → Al₂O₃', '4Al + 3O₂ → 2Al₂O₃', 'Make six O atoms with 2Al₂O₃, then match Al.'],
    ['CO + O₂ → CO₂', '2CO + O₂ → 2CO₂', 'Use 2CO₂ so the product side has four O atoms.'],
    ['P + O₂ → P₂O₅', '4P + 5O₂ → 2P₂O₅', 'Use 2P₂O₅ for four P atoms; then 10 O atoms need 5O₂.'],
    ['H₂ + Cl₂ → HCl', 'H₂ + Cl₂ → 2HCl', 'H₂ and Cl₂ each have two atoms, so use 2HCl.'],
    ['Ag + S → Ag₂S', '2Ag + S → Ag₂S', 'Ag₂S contains two Ag atoms, so use 2Ag.'],
    ['CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 2O₂ → CO₂ + 2H₂O', 'Balance C first, H second, and O last.'],
    ['C₂H₆ + O₂ → CO₂ + H₂O', '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O', 'Balance C and H first. Fourteen O atoms require 7O₂.'],
    ['CaCO₃ → CaO + CO₂', 'CaCO₃ → CaO + CO₂', 'Count Ca, C, and O: they are already balanced.'],
    ['Cu + O₂ → CuO', '2Cu + O₂ → 2CuO', 'O₂ needs two O atoms, so use 2CuO, then match Cu.'],
    ['Cl₂ + NaBr → NaCl + Br₂', '2NaBr + Cl₂ → 2NaCl + Br₂', 'Keep Br₂ together. Use 2NaBr and 2NaCl.'],
    ['H₂O₂ → H₂O + O₂', '2H₂O₂ → 2H₂O + O₂', 'Use 2H₂O₂ so the remaining oxygen forms one O₂ molecule.'],
    ['SO₂ + O₂ → SO₃', '2SO₂ + O₂ → 2SO₃', 'Use 2SO₃ so each side has six O atoms.'],
    ['NO + O₂ → NO₂', '2NO + O₂ → 2NO₂', 'Use 2NO₂ so N is 2:2 and O is 4:4.']
  ];

  const startIndex = () => ((dayNumber() * 5) % BANK.length + BANK.length) % BANK.length;
  const questions = () => Array.from({ length: 5 }, (_, i) => BANK[(startIndex() + i) % BANK.length]);
  const storageKey = () => 'chemistryDailyV5:' + today();

  const readState = () => {
    try { return JSON.parse(localStorage.getItem(storageKey()) || '{}'); }
    catch (_) { return {}; }
  };
  const writeState = (state) => {
    try { localStorage.setItem(storageKey(), JSON.stringify(state)); }
    catch (_) {}
  };

  const normalize = (value) => String(value || '')
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)])
    .replace(/\s+/g, '')
    .replace(/→|->|=/g, '>')
    .toUpperCase()
    .replace(/(^|>)1(?=[A-Z(])/g, '$1');

  function addStyles() {
    if (document.getElementById('daily-v5-style')) return;
    const style = document.createElement('style');
    style.id = 'daily-v5-style';
    style.textContent = `
      #daily-v5 { margin: 24px 0; }
      #daily-v5 .daily-card { padding: 24px; border: 1px solid var(--line,#dce3ee); border-radius: 20px; background: var(--surface,#fff); box-shadow: 0 10px 28px rgba(25,43,76,.07); }
      #daily-v5 .daily-head { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; }
      #daily-v5 .daily-kicker { font-size:11px; letter-spacing:.12em; font-weight:800; color:var(--accent); }
      #daily-v5 .daily-title { margin:6px 0; }
      #daily-v5 .daily-sub { margin:0; color:var(--muted); }
      #daily-v5 .daily-badge { padding:7px 10px; border-radius:999px; background:#edf1ff; font-size:12px; font-weight:800; white-space:nowrap; }
      #daily-v5 .daily-progress { display:flex; gap:6px; margin:16px 0; }
      #daily-v5 .daily-dot { height:8px; flex:1; border-radius:99px; background:#e4e9f1; }
      #daily-v5 .daily-dot.done { background:var(--accent); }
      #daily-v5 .daily-dot.current { box-shadow:0 0 0 2px rgba(49,88,214,.2); }
      #daily-v5 .daily-meta { display:flex; justify-content:space-between; gap:12px; color:var(--muted); font-size:13px; }
      #daily-v5 .daily-equation { direction:ltr; text-align:center; font-size:clamp(25px,4vw,40px); font-weight:900; padding:20px 10px; margin:18px 0; border:1px solid var(--line); border-radius:15px; }
      #daily-v5 .daily-input { width:100%; box-sizing:border-box; padding:14px; border:1px solid var(--line); border-radius:11px; font-size:18px; text-align:center; direction:ltr; background:transparent; color:inherit; }
      #daily-v5 .daily-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:10px; }
      #daily-v5 .daily-actions > * { min-height:44px; }
      #daily-v5 #dailySubmit { background:var(--accent); color:#fff; border:1px solid var(--accent); }
      #daily-v5 #dailySubmit:hover:not(:disabled) { filter:brightness(.95); }
      #daily-v5 .daily-feedback { min-height:32px; margin-top:12px; font-weight:800; }
      #daily-v5 .daily-note { margin-top:9px; padding:12px 14px; border:1px solid var(--line); border-radius:12px; background:var(--surface-2,#f7f9fc); color:var(--muted); }
      #daily-v5 .daily-hint { margin-top:9px; padding:12px 14px; border:1px solid var(--line); border-radius:12px; background:var(--surface-2,#f7f9fc); color:var(--muted); }
      #daily-v5 .daily-result { margin-top:16px; padding:18px; border:1px solid var(--line); border-radius:15px; }
      #daily-v5 .daily-score { font-size:38px; font-weight:900; }
      @media(max-width:760px){ #daily-v5 .daily-card{padding:17px;} #daily-v5 .daily-head,#daily-v5 .daily-meta{flex-direction:column;} #daily-v5 .daily-badge{align-self:flex-start;} #daily-v5 .daily-actions > *{flex:1 1 145px;} }
      body.dark #daily-v5 .daily-note, body.dark #daily-v5 .daily-hint { background:#1b2330; }
    `;
    document.head.appendChild(style);
  }

  function mount() {
    if (document.getElementById('daily-v5')) return;
    const main = document.querySelector('main');
    if (!main) return;

    addStyles();
    ['daily-final', 'dc-final', 'dc4', 'dc3', 'dc2', 'dc6', 'real-daily', 'ce3-daily-card', 'daily-question-card', 'daily-home-challenge'].forEach(id => document.getElementById(id)?.remove());

    const params = new URLSearchParams(location.search);
    let replay = params.has('adminReplay') || params.has('adminFresh');
    try { replay = replay || sessionStorage.getItem('chemistryAdminReplayRequested') === '1'; } catch (_) {}
    if (replay) {
      try { localStorage.removeItem(storageKey()); } catch (_) {}
      try { sessionStorage.removeItem('chemistryAdminReplayRequested'); } catch (_) {}
    }

    const qs = questions();
    const saved = readState();
    let index = Math.max(0, Math.min(5, Number(saved.index) || 0));
    let score = Math.max(0, Math.min(5, Number(saved.score) || 0));
    let started = !!saved.started;
    let complete = !!saved.complete;
    let endAt = Number(saved.endAt) || 0;
    const status = Array.isArray(saved.status) ? saved.status : [];
    const answers = Array.isArray(saved.answers) ? saved.answers : [];
    let timer = null;

    const section = document.createElement('section');
    section.id = 'daily-v5';
    section.className = 'section';
    section.innerHTML = `
      <div class="daily-card">
        <div class="daily-head">
          <div>
            <div class="daily-kicker">🧪 ${tr('DAILY CHEMISTRY CHALLENGE','التحدي اليومي للكيمياء','אתגר הכימיה היומי')}</div>
            <h2 class="daily-title">${tr('5 questions · 2 minutes','٥ أسئلة · دقيقتان','5 שאלות · 2 דקות')}</h2>
            <p class="daily-sub">${tr('A different set of five equations every day.','مجموعة مختلفة من خمس معادلات كل يوم.','סט שונה של חמש משוואות בכל יום.')}</p>
          </div>
          <span id="dailyBadge" class="daily-badge"></span>
        </div>
        <div id="dailyProgress" class="daily-progress"></div>
        <div class="daily-meta">
          <span>⏱ <b id="dailyTimer">2:00</b></span>
          <span>🏆 ${tr('Score','النتيجة','ציון')} <b id="dailyScore">0</b>/5</span>
        </div>
        <div id="dailyEquation" class="daily-equation">${questions()[Math.max(0, Math.min(4, Number(saved.index) || 0))][0]}</div>
        <input id="dailyInput" class="daily-input" autocomplete="off" spellcheck="false" placeholder="${tr('Type your balanced equation','اكتب المعادلة الموازنة','הקלידו את המשוואה המאוזנת')}">
        <div class="daily-actions">
          <button id="dailyStart" class="primary" type="button">▶ ${tr('Start challenge','ابدأ التحدي','התחילו אתגר')}</button>
          <button id="dailyCheck" class="primary" type="button">${tr('Check answer','تحقق من الإجابة','בדוק תשובה')}</button>
          <button id="dailySubmit" class="secondary" type="button">${tr('Submit answer','أرسل الإجابة','שלחו תשובה')}</button>
          <button id="dailyNext" class="primary" type="button" hidden>${tr('Next question','السؤال التالي','השאלה הבאה')} →</button>
          <button id="dailyHintBtn" class="secondary" type="button">💡 ${tr('Hint','تلميح','רמז')}</button>
        </div>
        <div id="dailyFeedback" class="daily-feedback"></div>
        <div id="dailyNote" class="daily-note"></div>
        <div id="dailyHint" class="daily-hint" hidden></div>
        <div id="dailyResult" class="daily-result" hidden></div>
      </div>`;

    const anchor = main.querySelector('#course-map');
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else main.appendChild(section);

    const $ = id => section.querySelector('#' + id);
    const equation = $('dailyEquation');
    const input = $('dailyInput');
    const startButton = $('dailyStart');
    const checkButton = $('dailyCheck');
    const submitButton = $('dailySubmit');
    const nextButton = $('dailyNext');
    const hintButton = $('dailyHintBtn');
    const feedback = $('dailyFeedback');
    const note = $('dailyNote');
    const hintBox = $('dailyHint');
    const result = $('dailyResult');
    const badge = $('dailyBadge');
    const progress = $('dailyProgress');
    const timerLabel = $('dailyTimer');
    const scoreLabel = $('dailyScore');

    function save() {
      writeState({ index, score, started, complete, endAt, status, answers });
    }

    function render() {
      if (index >= 5) { finish(); return; }
      const q = qs[index];
      equation.textContent = q[0];
      badge.textContent = `🔥 ${tr('Question ' + (index + 1) + ' of 5', 'السؤال ' + (index + 1) + ' من 5', 'שאלה ' + (index + 1) + ' מתוך 5')}`;
      scoreLabel.textContent = String(score);
      progress.replaceChildren(...Array.from({ length: 5 }, (_, n) => {
        const dot = document.createElement('span');
        dot.className = 'daily-dot' + (n < index ? ' done' : '') + (n === index ? ' current' : '');
        return dot;
      }));
      input.value = answers[index] || '';
      const recorded = status[index] > 0;
      input.disabled = !started || complete || recorded;
      checkButton.disabled = !started || complete || recorded;
      submitButton.disabled = !started || complete || recorded;
      hintButton.disabled = !started || complete;
      nextButton.hidden = !recorded || complete;
      startButton.hidden = started || complete;
      feedback.textContent = '';
      hintBox.hidden = true;
      note.textContent = recorded
        ? tr('Answer recorded. Use Next question when ready.','تم تسجيل الإجابة. اضغط السؤال التالي عندما تكون مستعدًا.','התשובה נרשמה. עברו לשאלה הבאה כשתהיו מוכנים.')
        : tr('Check your answer, or submit it when you are ready.','تحقق من إجابتك، أو أرسلها عندما تكون مستعدًا.','בדקו את התשובה، או שלחו אותה כשאתם מוכנים.');
      result.hidden = true;
    }

    function startChallenge() {
      if (started || complete) return;
      started = true;
      endAt = Date.now() + 120000;
      save();
      render();
      clearInterval(timer);
      timer = setInterval(tick, 500);
      tick();
      input.focus();
    }

    function tick() {
      if (!started || complete) return;
      const remaining = Math.max(0, endAt - Date.now());
      timerLabel.textContent = Math.floor(remaining / 60000) + ':' + String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      if (remaining <= 0) finish();
    }

    function evaluate(finalSubmission) {
      if (!started || complete || status[index] > 0) return;
      const value = input.value.trim();
      if (!value) {
        feedback.textContent = '⚠️ ' + tr('Enter an answer first.','اكتب إجابة أولًا.','הקלידו תשובה קודם.');
        return;
      }
      answers[index] = value;
      const correct = normalize(value) === normalize(qs[index][1]);
      if (correct) {
        status[index] = 1;
        score += 1;
        feedback.textContent = '✓ ' + tr('Correct! Great job.','صحيح! أحسنت.','נכון! עבודה מצוינת.');
        note.textContent = tr('Correct. This feedback stays visible until you choose Next question.','إجابة صحيحة. ستبقى هذه الملاحظة ظاهرة حتى تختار السؤال التالي.','נכון. המשוב יישאר עד שתבחרו שאלה הבאה.');
      } else if (finalSubmission) {
        status[index] = 2;
        feedback.textContent = '✕ ' + tr('Answer submitted. No point added.','تم إرسال الإجابة. لم تُضف نقطة.','התשובה נשלחה. לא נוספה נקודה.');
        note.textContent = tr('Final answer recorded.','تم تسجيل الإجابة النهائية.','התשובה הסופית נרשמה.');
      } else {
        feedback.textContent = '❌ ' + tr('Not quite. Edit your answer and check again, or submit it without another check.','ليس تمامًا. عدّل إجابتك وتحقق مرة أخرى، أو أرسلها دون فحص آخر.','לא בדיוק. ערכו את התשובה ובדקו שוב, או שלחו אותה בלי בדיקה נוספת.');
        save();
        return;
      }
      save();
      checkButton.disabled = true;
      submitButton.disabled = true;
      input.disabled = true;
      nextButton.hidden = false;
    }

    function nextQuestion() {
      if (complete || status[index] === 0) return;
      if (index < 4) {
        index += 1;
        save();
        render();
        input.disabled = false;
        input.focus();
      } else {
        finish();
      }
    }

    function finish() {
      if (complete) return;
      clearInterval(timer);
      timer = null;
      complete = true;
      started = false;
      save();
      input.disabled = true;
      checkButton.disabled = true;
      submitButton.disabled = true;
      hintButton.disabled = true;
      nextButton.hidden = true;
      startButton.hidden = true;
      badge.textContent = '✓ ' + tr('Completed today','أكملت تحدي اليوم','הושלם היום');
      progress.replaceChildren(...Array.from({ length: 5 }, () => {
        const dot = document.createElement('span');
        dot.className = 'daily-dot done';
        return dot;
      }));
      equation.textContent = tr('Challenge complete!','اكتمل التحدي!','האתגר הושלם!');
      scoreLabel.textContent = String(score);
      result.hidden = false;
      let message;
      if (score === 5) message = tr('Perfect score! 5/5 correct.','نتيجة كاملة! 5/5 صحيحة.','תוצאה מושלמת! 5/5 נכונות.');
      else if (score >= 4) message = tr('Great work! ' + score + '/5 correct.','عمل رائع! ' + score + '/5 صحيحة.','עבודה נהדרת! ' + score + '/5 נכונות.');
      else if (score >= 3) message = tr('Good effort! ' + score + '/5 correct. Review the ones you missed.','محاولة جيدة! ' + score + '/5 صحيحة. راجع المعادلات التي أخطأت فيها.','מאמץ טוב! ' + score + '/5 נכונות. עברו על מה שפספסתם.');
      else message = tr('Keep practising! ' + score + '/5 correct. Come back tomorrow and try a new set.','واصل التدريب! ' + score + '/5 صحيحة. عد غدًا لمجموعة جديدة.','המשיכו לתרגל! ' + score + '/5 נכונות. חזרו מחר לסט חדש.');
      result.innerHTML = '<div class="daily-score">' + score + '/5</div><p><b>' + message + '</b></p>';
    }

    startButton.addEventListener('click', startChallenge);
    checkButton.addEventListener('click', () => evaluate(false));
    submitButton.addEventListener('click', () => evaluate(true));
    nextButton.addEventListener('click', nextQuestion);
    hintButton.addEventListener('click', () => {
      if (!started || complete) return;
      hintBox.hidden = false;
      hintBox.textContent = '💡 ' + qs[index][2];
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') evaluate(false);
    });

    if (replay) {
      started = true;
      endAt = Date.now() + 120000;
      save();
      render();
      input.disabled = false;
      checkButton.disabled = false;
      submitButton.disabled = false;
      hintButton.disabled = false;
      timer = setInterval(tick, 500);
      tick();
      input.focus();
    } else if (complete) {
      finish();
    } else {
      render();
      if (started && endAt > Date.now()) {
        timer = setInterval(tick, 500);
        tick();
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
