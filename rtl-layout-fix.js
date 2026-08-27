(()=>{
const css=`
html[dir="rtl"] body,.rtl{direction:rtl;text-align:right}
html[dir="rtl"] .topbar{direction:rtl}
html[dir="rtl"] .brand{margin-right:0;margin-left:auto}
html[dir="rtl"] .main-nav{direction:rtl}
html[dir="rtl"] .section-head{direction:rtl}
html[dir="rtl"] .section-head>div{text-align:right}
html[dir="rtl"] .hero,.rtl .hero{direction:rtl}
html[dir="rtl"] .hero>div{text-align:right}
html[dir="rtl"] .hero-card{direction:rtl;text-align:right}
html[dir="rtl"] .lesson,.rtl .lesson{text-align:right}
html[dir="rtl"] .card,.rtl .card{text-align:right}
html[dir="rtl"] .quiz-q,.rtl .quiz-q{text-align:right}
html[dir="rtl"] .quiz-actions{direction:rtl}
html[dir="rtl"] .mode-list label{text-align:right;display:block}
html[dir="rtl"] input:not([type="radio"]):not([type="checkbox"]),html[dir="rtl"] textarea,html[dir="rtl"] select{text-align:right;direction:rtl}
html[dir="rtl"] .equation,html[dir="rtl"] .equation *,html[dir="rtl"] canvas{direction:ltr!important;text-align:center!important}
html[dir="rtl"] .chips{direction:rtl}
html[dir="rtl"] .stage-list .stage{text-align:right}
html[dir="rtl"] .progress-grid>div{text-align:center}
html[dir="rtl"] footer{direction:rtl}
html[dir="rtl"] .certificate{direction:ltr;text-align:center}
html[dir="rtl"] .profile-table{text-align:right}
html[dir="rtl"] .profile-table td{text-align:right}
html[dir="rtl"] .achievement{text-align:right}
html[dir="rtl"] .challenge-feature,.rtl .challenge-feature{text-align:right}
html[dir="rtl"] .experience-card,.rtl .experience-card{text-align:right}
html[dir="rtl"] .invite-panel{text-align:right}
html[dir="rtl"] .eyebrow{letter-spacing:.06em}
@media(max-width:700px){html[dir="rtl"] .topbar{align-items:center}html[dir="rtl"] .main-nav{justify-content:flex-start}html[dir="rtl"] .hero{grid-template-columns:1fr}html[dir="rtl"] .input-row{direction:rtl}}
`;
function install(){if(document.getElementById('rtl-layout-fix'))return;const s=document.createElement('style');s.id='rtl-layout-fix';s.textContent=css;document.head.appendChild(s)}
window.addEventListener('DOMContentLoaded',install);install();
})();
