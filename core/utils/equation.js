/** Chemistry equation utilities — superscript/subscript and formatted reaction display. */
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };

/** Convert numeric digits in a chemical formula to subscript characters. 'H2O' -> 'H₂O'. */
export function sub(formula) {
  return String(formula).replace(/(\d+)/g, m => m.split('').map(d => SUB[d] || d).join(''));
}

/**
 * Render a formatted chemical equation as HTML.
 * @param {string} left  Reactant side (digits auto-subscripted)
 * @param {string} right Product side (↑/↓ auto-highlighted)
 * @param {string} [condition] Reaction condition (e.g. '点燃', '高温')
 * @returns {string} HTML string
 */
export function eq(left, right, condition) {
  const mark = s => String(s)
    .replace(/↑/g, '<span class="chem-gas">↑</span>')
    .replace(/↓/g, '<span class="chem-ppt">↓</span>')
    .split('').map(c => SUB[c] ? SUB[c] : c).join('');
  return `<span class="chem-eq"><span class="chem-eq-left">${mark(left)}</span><span class="chem-eq-sign">${condition ? `<span class="chem-eq-cond">${condition}</span>` : ''}<span class="chem-eq-line">═══</span></span><span class="chem-eq-right">${mark(right)}</span></span>`;
}

/** Format a number, stripping trailing zeros after decimal. */
export function num(v, digits) {
  const s = Number(v).toFixed(digits == null ? 2 : digits);
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
}
