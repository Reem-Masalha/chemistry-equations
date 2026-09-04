#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILES = ['quiz-system-v2.js', 'challenges.js'];
const ELEMENTS = new Set('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' '));

function stripState(s) { return String(s).replace(/\s*_?\s*\(aq|\s*_?\s*\(s|\s*_?\s*\(l|\s*_?\s*\(g/gi, '').replace(/\)/g, ''); }
function cleanEq(s) { return String(s).replace(/[₀₁₂₃₄₅₆₇₈₉]/g, c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).replace(/=>|->|⟶|⇒|➜|⟹|⟾/g, '→').replace(/\s+/g, ' ').trim(); }

function parseFormula(formula) {
  let s = String(formula).replace(/^\d+\s*/, '').replace(/\s*_?\s*\((?:aq|s|l|g)\)$/i, '').trim();
  const stack = [Object.create(null)];
  let i = 0;
  function add(el, n) { stack[stack.length - 1][el] = (stack[stack.length - 1][el] || 0) + n; }
  function parseNumber() { const m = s.slice(i).match(/^\d+/); if (!m) return 1; i += m[0].length; return Number(m[0]); }
  while (i < s.length) {
    if (s[i] === '(' || s[i] === '[') { stack.push(Object.create(null)); i++; continue; }
    if (s[i] === ')' || s[i] === ']') {
      if (stack.length === 1) throw new Error('unmatched closing bracket');
      const group = stack.pop(); i++; const mult = parseNumber();
      for (const [el, n] of Object.entries(group)) add(el, n * mult);
      continue;
    }
    const m = s.slice(i).match(/^([A-Z][a-z]?)/);
    if (!m) throw new Error(`unexpected character "${s[i]}"`);
    const el = m[1]; if (!ELEMENTS.has(el)) throw new Error(`invalid element symbol ${el}`);
    i += el.length; add(el, parseNumber());
  }
  if (stack.length !== 1) throw new Error('unclosed bracket');
  return stack[0];
}

function sideCounts(side, coefficients) {
  const parts = side.split('+').map(x => x.trim()).filter(Boolean);
  if (!parts.length) throw new Error('empty side');
  const total = Object.create(null);
  parts.forEach((part, idx) => {
    const m = part.match(/^(\d+)\s*(.*)$/); const c = m ? Number(m[1]) : 1; const formula = m ? m[2] : part;
    if (!formula) throw new Error('missing formula');
    if (coefficients) coefficients.push(c);
    const atoms = parseFormula(formula);
    for (const [el, n] of Object.entries(atoms)) total[el] = (total[el] || 0) + c * n;
  });
  return total;
}

function balanced(eq) {
  const parts = cleanEq(eq).split('→');
  if (parts.length !== 2) throw new Error('equation must contain exactly one →');
  const left = sideCounts(parts[0], []), right = sideCounts(parts[1], []);
  const els = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const el of els) if ((left[el] || 0) !== (right[el] || 0)) return false;
  return true;
}

function answerCoefficients(eq) {
  const out = [];
  for (const side of cleanEq(eq).split('→')) sideCounts(side, out);
  return out;
}
function gcd(a,b){ while(b){const t=a%b;a=b;b=t;} return a; }
function isMinimal(cs){ let g=0; for(const n of cs){ if(!Number.isInteger(n)||n<1)return false; g=gcd(g,n); } return g===1; }
function canonical(eq){ return cleanEq(eq).replace(/\s+/g,'').replace(/^(?:1)?(?=[A-Z(])/,''); }

function extractTuples(text) {
  const out=[];
  const re=/\[['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"](?:\s*,\s*['\"]([^'\"]*)['\"])?\]/g;
  let m; while((m=re.exec(text))) out.push({equation:m[1],answer:m[2],hint:m[3]||''});
  return out;
}
function extractChallengeTuples(text) {
  const out=[]; const re=/\[['\"]([^'\"]+)['\"]\s*,\s*['\"]([^'\"]+)['\"]\]/g; let m;
  while((m=re.exec(text))) out.push({equation:m[1],answer:m[2]}); return out;
}

const errors=[]; const seen=new Map(); let total=0;
for (const file of FILES) {
  const text=fs.readFileSync(path.join(ROOT,file),'utf8');
  const qs=file==='challenges.js'?extractChallengeTuples(text):extractTuples(text);
  for(const q of qs){
    total++;
    const label=`${file}: ${q.equation}`;
    try {
      if (!q.equation.includes('→') && !/=>|->|⟶|⇒|➜|⟹|⟾/.test(q.equation)) throw new Error('missing reaction arrow');
      if (balanced(q.equation)) errors.push(`${label} is already balanced; a balancing question must start unbalanced`);
      if (!balanced(q.answer)) errors.push(`${label} has an answer that is not balanced`);
      const cs=answerCoefficients(q.answer);
      if (!isMinimal(cs)) errors.push(`${label} has non-minimal answer coefficients: ${cs.join(',')}`);
      const key=canonical(q.equation);
      if(seen.has(key)) errors.push(`${label} duplicates ${seen.get(key)}`); else seen.set(key,label);
    } catch(e) { errors.push(`${label} is invalid: ${e.message}`); }
  }
}

if(!total) errors.push('No question tuples were found in the configured question banks');
if(errors.length){ console.error(`Question-bank validation failed (${errors.length} issue${errors.length===1?'':'s'}):`); errors.forEach(e=>console.error(`- ${e}`)); process.exit(1); }
console.log(`Question-bank validation passed: ${total} balancing questions checked; formulas valid, starting equations unbalanced, answers balanced, coefficients minimal, and duplicates absent.`);
