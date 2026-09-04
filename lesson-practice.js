(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const normalize=s=>String(s||'').trim().replace(/[₂]/g,'2').replace(/[₃]/g,'3').replace(/[₄]/g,'4').replace(/[₅]/g,'5').replace(/[₆]/g,'6').replace(/[₇]/g,'7').replace(/[₈]/g,'8').replace(/[₉]/g,'9').replace(/\s+/g,'').toLowerCase();
const sets={
  beginner:[
    ['What is a chemical equation?',['The arrow separates reactants from products.','Reactants are on the left.','Products are on the right.'],1,'What does the arrow show?'],
    ['Reading chemical formulas',['Ca(OH)2 has 1 Ca, 2 O, and 2 H.','3H2O has 6 H and 3 O.','A coefficient multiplies the entire formula.'],0,'How many oxygen atoms are in Ca(OH)₂?'],
    ['Conservation of mass',['Atoms are conserved; they are rearranged.','Every element must have equal totals on both sides.','2H₂ contains 4 hydrogen atoms.'],1,'What must be equal on both sides of a balanced equation?'],
    ['How to balance a chemical equation',['Use coefficients, not changed subscripts.','Count atoms before and after each change.','Finish with the smallest whole-number ratio.'],0,'What should you change to balance an equation?'],
    ['Diatomic elements',['H₂, N₂, O₂, F₂, Cl₂, Br₂, and I₂ are diatomic as free elements.','They appear as pairs when elemental.','Do not write elemental oxygen as O in a normal molecular equation.'],0,'Which formula represents elemental oxygen?'],
    ['Putting it all together',['Check formulas first.','Count atoms on both sides.','Reduce coefficients to the smallest whole-number ratio.'],1,'What should you do after changing coefficients?']
  ],
  intermediate:[
    ['Polyatomic ions',['A polyatomic ion is a bonded group with an overall charge.','An unchanged group can sometimes be balanced as one unit.','Never change subscripts inside the ion.'],0,'What can make an unchanged polyatomic ion easier to balance?'],
    ['Parentheses',['The outside subscript multiplies every atom inside.','Al₂(SO₄)₃ has 2 Al, 3 S, and 12 O.','Parentheses keep a group together.'],1,'How many oxygen atoms are in Al₂(SO₄)₃?'],
    ['Fractional coefficients',['Fractions may be temporary.','Multiply every coefficient by the denominator to clear fractions.','Reduce to the smallest whole-number ratio.'],1,'What should you do after using a fractional coefficient?'],
    ['Complicated reactions',['Start with elements or groups that appear in fewer formulas.','Leave H and O later when they occur in many species.','Verify every element at the end.'],2,'When should you verify the final equation?']
  ],
  advanced:[
    ['Combustion',['Balance C first, then H, then O.','Oxygen often ends up last because it appears in several species.','A temporary fraction can be cleared at the end.'],0,'Which element is usually balanced first in a hydrocarbon combustion reaction?'],
    ['Redox',['Oxidation means loss of electrons.','Reduction means gain of electrons.','Atoms and charge must both be conserved in ionic equations.'],0,'What happens to electrons during oxidation?'],
    ['Complex ionic equations',['Balance atoms, then oxygen with H₂O and hydrogen with H⁺ in acidic solution.','Use electrons to balance charge in half-reactions.','Charge conservation matters as well as atom conservation.'],2,'What else must be conserved in an ionic equation besides atoms?'],
    ['Systematic balancing',['Assign an unknown coefficient to each formula.','Write one conservation equation per element.','Scale to the smallest positive whole-number solution.'],0,'What do you assign to each formula in an algebraic balancing method?']
  ]
};
function build(title,options,correct,prompt){
  const card=document.createElement('div');card.className='lesson-practice-card';
  card.innerHTML=`<div class="lesson-practice-eyebrow">Practice</div><h3>Check your understanding</h3><p class="lesson-practice-prompt"></p><div class="lesson-practice-options"></div><div class="lesson-practice-feedback" aria-live="polite"></div>`;
  q('.lesson-practice-prompt',card).textContent=prompt;
  const box=q('.lesson-practice-options',card),feedback=q('.lesson-practice-feedback',card);
  options.forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.className='secondary lesson-practice-option';b.textContent=text;b.onclick=()=>{qa('button',box).forEach(x=>x.disabled=true);card.dataset.practiceAnswered='1';if(i===correct){card.dataset.practicePassed='1';b.classList.add('practice-correct');feedback.textContent='✓ Correct — '+text}else{card.dataset.practicePassed='0';b.classList.add('practice-wrong');const right=qa('button',box)[correct];right.classList.add('practice-correct');feedback.textContent='Not quite. The correct idea is: '+right.textContent}};box.appendChild(b)});
  return card;
}
function lessonKey(text){const t=normalize(text);if(t.includes('chemicalequation'))return'What is a chemical equation?';if(t.includes('readingchemicalformulas'))return'Reading chemical formulas';if(t.includes('conservationofmass'))return'Conservation of mass';if(t.includes('howtobalanceachemicalequation'))return'How to balance a chemical equation';if(t.includes('diatomicelements'))return'Diatomic elements';if(t.includes('puttingitalltogether'))return'Putting it all together';if(t.includes('polyatomicions'))return'Polyatomic ions';if(t.includes('parentheses'))return'Parentheses';if(t.includes('fractionalcoefficients'))return'Fractional coefficients';if(t.includes('complicatedreactions'))return'Complicated reactions';if(t.includes('combustion'))return'Combustion';if(t.includes('redox'))return'Redox';if(t.includes('complexionicequations'))return'Complex ionic equations';if(t.includes('systematicbalancing'))return'Systematic balancing';return null}
function init(){const page=location.pathname.toLowerCase();const level=page.includes('beginner-lessons')?'beginner':page.includes('intermediate-lessons')?'intermediate':page.includes('advanced-lessons')?'advanced':null;if(!level)return;const pool=new Map(sets[level].map(x=>[normalize(x[0]),x]));qa('article.card').forEach(article=>{const e=qa('.eyebrow',article).find(x=>x.textContent.includes('·'));if(!e)return;const key=lessonKey(e.textContent);const data=key&&pool.get(normalize(key));if(!data||q('.lesson-practice-card',article))return;article.appendChild(build(...data))})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
