const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let current = '0';
let previous = null;
let operator = null;
let overwrite = true;

const opSymbolToFn = {
    '+': (a, b) => a + b,
    '−': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => (b === 0 ? NaN : a / b),
};

function formatNumber(num) {
    if (Number.isNaN(num)) return 'Error';
    if (!Number.isFinite(num)) return 'Error';
    const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
    let str = rounded.toString();
    if (str.length > 12) {
      str = rounded.toPrecision(8).replace(/\.?0+$/, '');
      if (str.includes('e')) str = rounded.toExponential(4);
    }
    return str;
}
 
  function updateScreen() {
    resultEl.textContent = current;
    if (operator && previous !== null) {
      expressionEl.textContent = `${formatNumber(previous)} ${operator}`;
    } else {
      expressionEl.textContent = '\u00A0';
    }
}
 
function inputDigit(d) {
    if (overwrite) {
      current = d === '0' ? '0' : d;
      overwrite = false;
    } else {
      if (current === '0') current = d;
      else if (current.length < 14) current += d;
    }
}
 
function inputDecimal() {
    if (overwrite) {
      current = '0.';
      overwrite = false;
      return;
    }
    if (!current.includes('.')) current += '.';
}
 
function setOperator(sym) {
    if (operator && !overwrite) {
      compute();
      previous = parseFloat(current);
    } else {
      previous = parseFloat(current);
    }
    operator = sym;
    overwrite = true;
}
 
function compute() {
    if (operator === null || previous === null) return;
    const a = previous;
    const b = parseFloat(current);
    const fn = opSymbolToFn[operator];
    const res = fn(a, b);
    current = formatNumber(res);
    operator = null;
    previous = null;
    overwrite = true;
}
 
function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    overwrite = true;
}
 
function negate() {
    if (current === '0') return;
    current = current.startsWith('-') ? current.slice(1) : '-' + current;
}
 
function percent() {
    const val = parseFloat(current) / 100;
    current = formatNumber(val);
}
 
document.querySelector('.keys').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
 
    if (btn.dataset.num !== undefined) {
      inputDigit(btn.dataset.num);
      updateScreen();
      return;
    }
 
    switch (btn.dataset.action) {
      case 'clear': clearAll(); break;
      case 'negate': negate(); break;
      case 'percent': percent(); break;
      case 'decimal': inputDecimal(); break;
      case 'op': setOperator(btn.dataset.op); break;
      case 'equals': compute(); break;
    }
    updateScreen();
});

window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') setOperator('+');
    else if (e.key === '-') setOperator('−');
    else if (e.key === '*') setOperator('×');
    else if (e.key === '/') { e.preventDefault(); setOperator('÷'); }
    else if (e.key === 'Enter' || e.key === '=') compute();
    else if (e.key === 'Escape') clearAll();
    else if (e.key === 'Backspace') {
      if (!overwrite && current.length > 1) current = current.slice(0, -1);
      else { current = '0'; overwrite = true; }
    } else {
      return;
    }
    updateScreen();
});
 
updateScreen();