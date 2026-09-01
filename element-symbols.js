(()=>{
'use strict';
// Single canonical source for all 118 chemical element symbols.
// Other site scripts should read window.CHEMISTRY_ELEMENT_SYMBOLS instead of maintaining their own lists.
const symbols='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr'.split(' ');
window.CHEMISTRY_ELEMENT_SYMBOLS=new Set(symbols);
window.CHEMISTRY_ELEMENT_SYMBOL_LIST=Object.freeze(symbols.slice());
})();
