/**
 * Kurdish Keyboard — A mobile-friendly virtual keyboard for typing
 * Kurdish (Sorani) Unicode characters with a C4Kurd/Arabic-style layout.
 *
 * Usage:
 *   import { KurdishKeyboard } from 'kurdish-keyboard';
 *   const kb = new KurdishKeyboard({ target: document.getElementById('my-input')! });
 */
// ============================================================
// Ali-K / C4Kurd character mapping table (Latin → Kurdish Unicode)
// Covers: Ali-K, C4Kurd, and common legacy Kurdish Latin fonts
// ============================================================
export const ALI_K_MAP = {
    // Lowercase
    'a': 'ا', 'b': 'ب', 'c': 'ج', 'd': 'د', 'e': 'ە',
    'f': 'ف', 'g': 'گ', 'h': 'ھ', 'i': '', 'j': 'ژ',
    'k': 'ک', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'ۆ',
    'p': 'پ', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
    'u': 'و', 'v': 'ڤ', 'w': 'و', 'x': 'خ', 'y': 'ی', 'z': 'ز',
    // Uppercase
    'A': 'ا', 'B': 'ب', 'C': 'چ', 'D': 'د', 'E': 'ە',
    'F': 'ف', 'G': 'گ', 'H': 'ھ', 'I': 'ی', 'J': 'ژ',
    'K': 'ک', 'L': 'ڵ', 'M': 'م', 'N': 'ن', 'O': 'ۆ',
    'P': 'پ', 'Q': 'ق', 'R': 'ڕ', 'S': 'ش', 'T': 'ت',
    'U': 'و', 'V': 'ڤ', 'W': 'و', 'X': 'خ', 'Y': 'ێ', 'Z': 'ز',
    // Numbers
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
    // Symbols
    '[': 'ڵ', ']': 'ڕ', '{': 'ڕ', '}': 'ڵ',
    ',': '،', '?': '؟', ';': '؛',
};
/** Arabic/Persian keyboard → proper Kurdish Unicode */
export const ARABIC_KB_MAP = {
    '\u0643': 'ک', // Arabic Kaf → Kurdish Keheh
    '\u064A': 'ی', // Arabic Yeh → Kurdish Yeh
    '\u0649': 'ی', // Alef Maksura → Kurdish Yeh
    '\u06CC': 'ی', // Persian Yeh → Kurdish Yeh  
    '\u0629': 'ە', // Teh Marbuta → Ae
    '\u0647': 'ە', // Heh → Ae (word-final handled by normalizer)
};
/**
 * Convert Ali-K / C4Kurd legacy Latin text to Kurdish Unicode.
 * e.g. "kUrdy" → "کوردی"
 */
export function convertAliK(text) {
    if (!text)
        return '';
    let result = '';
    for (const ch of text) {
        result += ALI_K_MAP[ch] || ch;
    }
    return result;
}
/**
 * Fix Arabic/Persian keyboard text to proper Kurdish Unicode.
 * e.g. "\u0643\u0648\u0631\u062F\u064A" → "کوردی"
 */
export function convertArabicKB(text) {
    if (!text)
        return '';
    let result = '';
    for (const ch of text) {
        result += ARABIC_KB_MAP[ch] || ch;
    }
    return result;
}
/**
 * Simple Latin→Arabic conversion for Hawar-style input.
 * e.g. "kurdî" → "کوردی"
 */
export function convertLatin(text) {
    if (!text)
        return '';
    text = text.toLowerCase();
    // Handle digraphs first
    text = text.replace(/ch/g, 'چ');
    text = text.replace(/sh/g, 'ش');
    text = text.replace(/gh/g, 'غ');
    text = text.replace(/hh/g, 'ح');
    text = text.replace(/rr/g, 'ڕ');
    text = text.replace(/ll/g, 'ڵ');
    // Then single chars
    const map = { ...ALI_K_MAP,
        'C': 'چ', 'S': 'ش', 'R': 'ڕ', 'L': 'ڵ', 'h': 'ھ',
        'ê': 'ێ', 'î': 'ی', 'û': 'وو', 'ş': 'ش', 'ç': 'چ',
    };
    let result = '';
    for (const ch of text) {
        result += map[ch] || ch;
    }
    return result;
}
/**
 * Convert Latin characters in-place within mixed Kurdish text.
 * Preserves existing Kurdish/Arabic characters, only converts Latin.
 * e.g. "کوردiستان" → "کوردستان" (i removed as per Ali-K mapping)
 *      "رودaw" → "روداو"
 *      "dzn" → "دزن"
 */
export function convertMixedText(text, mode) {
    if (!text)
        return '';
    // Only convert if there are Latin chars
    if (!/[a-zA-Z]/.test(text)) {
        // No Latin chars — check for Arabic keyboard issues
        if (mode === 'auto' || mode === 'arabic-kb') {
            return convertArabicKB(text);
        }
        return text;
    }
    // Determine conversion strategy
    const hasUpper = /[A-Z]/.test(text);
    const useMap = (mode === 'ali-k') || (mode === 'auto' && hasUpper)
        ? ALI_K_MAP
        : mode === 'latin' || mode === 'auto'
            ? { ...ALI_K_MAP, 'ê': 'ێ', 'î': 'ی', 'û': 'وو', 'ş': 'ش', 'ç': 'چ', 'h': 'ھ' }
            : ALI_K_MAP;
    // Handle digraphs first (for latin/Hawar mode)
    if (mode === 'latin' || (mode === 'auto' && !hasUpper)) {
        text = text.replace(/ch/gi, 'چ');
        text = text.replace(/sh/gi, 'ش');
        text = text.replace(/gh/gi, 'غ');
        text = text.replace(/hh/gi, 'ح');
        text = text.replace(/rr/gi, 'ڕ');
        text = text.replace(/ll/gi, 'ڵ');
    }
    // Convert character by character, skipping non-Latin
    let result = '';
    for (const ch of text) {
        if (/[a-zA-Z]/.test(ch)) {
            result += useMap[ch] !== undefined ? useMap[ch] : ch;
        }
        else {
            result += ch;
        }
    }
    // Also fix Arabic keyboard chars if present
    if (mode === 'auto') {
        result = convertArabicKB(result);
    }
    return result;
}
// ---- Layouts ----
const LAYOUTS = {
    standard: [
        [
            { label: 'ض', output: 'ض' }, { label: 'ص', output: 'ص' },
            { label: 'ث', output: 'ث' }, { label: 'ق', output: 'ق' },
            { label: 'ف', output: 'ف' }, { label: 'غ', output: 'غ' },
            { label: 'ع', output: 'ع' }, { label: 'ھ', output: 'ھ' },
            { label: 'خ', output: 'خ' }, { label: 'ح', output: 'ح' },
            { label: 'ج', output: 'ج' }, { label: 'چ', output: 'چ' },
        ],
        [
            { label: 'ش', output: 'ش' }, { label: 'س', output: 'س' },
            { label: 'ی', output: 'ی' }, { label: 'ب', output: 'ب' },
            { label: 'ل', output: 'ل' }, { label: 'ا', output: 'ا' },
            { label: 'ت', output: 'ت' }, { label: 'ن', output: 'ن' },
            { label: 'م', output: 'م' }, { label: 'ک', output: 'ک' },
            { label: 'گ', output: 'گ' }, { label: 'پ', output: 'پ' },
        ],
        [
            { label: '⇧', output: 'SHIFT', wide: true },
            { label: 'ئ', output: 'ئ' }, { label: 'ء', output: 'ء' },
            { label: 'ۆ', output: 'ۆ' }, { label: 'ر', output: 'ر' },
            { label: 'ێ', output: 'ێ' }, { label: 'ە', output: 'ە' },
            { label: 'و', output: 'و' }, { label: 'ز', output: 'ز' },
            { label: 'ژ', output: 'ژ' }, { label: 'ڵ', output: 'ڵ' },
            { label: 'ڕ', output: 'ڕ' }, { label: 'ڤ', output: 'ڤ' },
            { label: '⌫', output: 'BACKSPACE', wide: true },
        ],
        [
            { label: '123', output: 'NUMS', wide: true },
            { label: '‌', output: '\u200C' },
            { label: '،', output: '،' },
            { label: '.', output: '.' },
            { label: '␣', output: ' ', wide: true },
            { label: '؟', output: '؟' },
            { label: '؛', output: '؛' },
            { label: '↵', output: 'ENTER', wide: true },
        ],
    ],
    numbers: [
        [
            { label: '١', output: '١' }, { label: '٢', output: '٢' },
            { label: '٣', output: '٣' }, { label: '٤', output: '٤' },
            { label: '٥', output: '٥' }, { label: '٦', output: '٦' },
            { label: '٧', output: '٧' }, { label: '٨', output: '٨' },
            { label: '٩', output: '٩' }, { label: '٠', output: '٠' },
        ],
        [
            { label: '!', output: '!' }, { label: '@', output: '@' },
            { label: '#', output: '#' }, { label: '$', output: '$' },
            { label: '%', output: '%' }, { label: '^', output: '^' },
            { label: '&', output: '&' }, { label: '*', output: '*' },
            { label: '(', output: '(' }, { label: ')', output: ')' },
        ],
        [
            { label: '-', output: '-' }, { label: '+', output: '+' },
            { label: '=', output: '=' }, { label: '/', output: '/' },
            { label: '\\', output: '\\' }, { label: '|', output: '|' },
            { label: '<', output: '<' }, { label: '>', output: '>' },
            { label: '[', output: '[' }, { label: ']', output: ']' },
        ],
        [
            { label: 'اب', output: 'ABC', wide: true },
            { label: '_', output: '_' },
            { label: '.', output: '.' },
            { label: '␣', output: ' ', wide: true },
            { label: ',', output: ',' },
            { label: '↵', output: 'ENTER', wide: true },
        ],
    ],
    symbols: [
        [
            { label: '«', output: '«' }, { label: '»', output: '»' },
            { label: '(', output: '(' }, { label: ')', output: ')' },
            { label: 'ـ', output: 'ـ' }, { label: '،', output: '،' },
            { label: '؛', output: '؛' }, { label: '؟', output: '؟' },
            { label: '!', output: '!' }, { label: '٪', output: '٪' },
        ],
        [
            { label: '٫', output: '٫' }, { label: '٬', output: '٬' },
            { label: '〈', output: '〈' }, { label: '〉', output: '〉' },
            { label: '٭', output: '٭' }, { label: '"', output: '"' },
            { label: "'", output: "'" }, { label: '`', output: '`' },
            { label: '~', output: '~' }, { label: '°', output: '°' },
        ],
        [
            { label: '{', output: '{' }, { label: '}', output: '}' },
            { label: ':', output: ':' }, { label: ';', output: ';' },
            { label: '•', output: '•' }, { label: '…', output: '…' },
            { label: '–', output: '–' }, { label: '—', output: '—' },
            { label: '©', output: '©' }, { label: '®', output: '®' },
        ],
        [
            { label: 'اب', output: 'ABC', wide: true },
            { label: '␣', output: ' ', wide: true },
            { label: '.', output: '.' }, { label: '،', output: '،' },
            { label: '↵', output: 'ENTER', wide: true },
        ],
    ],
};
// ---- Shifted (diacritics + extra Arabic letters) ----
const SHIFTED = {
    standard: [
        [
            { label: 'ﹶ', output: '\u064E' }, { label: 'ﹸ', output: '\u064F' },
            { label: 'ﹺ', output: '\u0650' }, { label: 'ﹰ', output: '\u064B' },
            { label: 'ﹲ', output: '\u064D' }, { label: 'ﹴ', output: '\u064D' },
            { label: 'ّ', output: '\u0651' }, { label: 'ﹿ', output: '\u0652' },
            { label: 'آ', output: 'آ' }, { label: 'أ', output: 'أ' },
            { label: 'إ', output: 'إ' }, { label: 'ؤ', output: 'ؤ' },
        ],
        [
            { label: 'ة', output: 'ة' }, { label: 'ى', output: 'ى' },
            { label: 'ي', output: 'ي' }, { label: 'ك', output: 'ك' },
            { label: 'د', output: 'د' }, { label: 'ذ', output: 'ذ' },
            { label: 'ط', output: 'ط' }, { label: 'ظ', output: 'ظ' },
            { label: 'ص', output: 'ص' }, { label: 'ض', output: 'ض' },
            { label: 'ث', output: 'ث' }, { label: 'ق', output: 'ق' },
        ],
        [
            { label: '⇩', output: 'SHIFT', wide: true },
            { label: 'ف', output: 'ف' }, { label: 'غ', output: 'غ' },
            { label: 'ع', output: 'ع' }, { label: 'ھ', output: 'ھ' },
            { label: 'خ', output: 'خ' }, { label: 'ح', output: 'ح' },
            { label: 'ج', output: 'ج' }, { label: 'چ', output: 'چ' },
            { label: 'ڎ', output: 'ڎ' }, { label: 'ۊ', output: 'ۊ' },
            { label: 'ۉ', output: 'ۉ' },
            { label: '⌫', output: 'BACKSPACE', wide: true },
        ],
        [
            { label: '123', output: 'NUMS', wide: true },
            { label: '‍', output: '\u200D' },
            { label: '،', output: '،' },
            { label: '.', output: '.' },
            { label: '␣', output: ' ', wide: true },
            { label: '؟', output: '؟' },
            { label: '؛', output: '؛' },
            { label: '↵', output: 'ENTER', wide: true },
        ],
    ],
    numbers: LAYOUTS.numbers,
    symbols: LAYOUTS.symbols,
};
export class KurdishKeyboard {
    constructor(options) {
        this.shifted = false;
        this.visible = false;
        if (typeof options.target === 'string') {
            const el = document.querySelector(options.target);
            if (!el)
                throw new Error(`KurdishKeyboard: target "${options.target}" not found`);
            this.target = el;
        }
        else {
            this.target = options.target;
        }
        if (typeof options.container === 'string') {
            const el = document.querySelector(options.container);
            if (!el)
                throw new Error(`KurdishKeyboard: container "${options.container}" not found`);
            this.container = el;
        }
        else if (options.container) {
            this.container = options.container;
        }
        else {
            this.container = document.body;
        }
        this.layout = options.layout || 'standard';
        this.includeZWNJ = options.includeZWNJ !== false; // default true
        this.numberFormat = options.numberFormat || 'arabic'; // default Arabic nums
        this.autoConvertMode = options.autoConvert || false;
        this.onChange = options.onChange;
        this._onDocClick = this._handleDocClick.bind(this);
        this._build();
        this.target.addEventListener('focus', () => this.show());
        // Auto-convert on input (paste, programmatic changes, etc.)
        if (this.autoConvertMode) {
            this.target.addEventListener('input', () => this._applyAutoConvert());
            // Also convert on blur
            this.target.addEventListener('blur', () => this._applyAutoConvert());
        }
        if (options.floatingButton)
            this._addFloatingButton();
        if (options.direction)
            this.el.style.direction = options.direction;
        if (options.autoShow) {
            setTimeout(() => this.show(), 100);
        }
    }
    show() {
        if (this.visible)
            return;
        this.el.style.display = 'block';
        requestAnimationFrame(() => {
            this.el.style.transform = 'translateY(0)';
            this.el.style.opacity = '1';
        });
        this.visible = true;
        document.addEventListener('mousedown', this._onDocClick);
    }
    hide() {
        if (!this.visible)
            return;
        this.el.style.transform = 'translateY(100%)';
        this.el.style.opacity = '0';
        const el = this.el;
        setTimeout(() => { el.style.display = 'none'; }, 250);
        this.visible = false;
        document.removeEventListener('mousedown', this._onDocClick);
    }
    toggle() { this.visible ? this.hide() : this.show(); }
    /** Switch number format between 'arabic' (٠١٢٣) and 'latin' (0123) */
    setNumberFormat(format) {
        this.numberFormat = format;
        this._rerender();
    }
    destroy() {
        this.hide();
        this.el.remove();
        this.target.removeEventListener('focus', () => this.show());
        if (this.floatBtn)
            this.floatBtn.remove();
    }
    // ========== Floating Button ==========
    _addFloatingButton() {
        this.floatBtn = document.createElement('button');
        this.floatBtn.innerHTML = '⌨️';
        this.floatBtn.title = 'کیبۆرد';
        this.floatBtn.style.cssText =
            'position:fixed;bottom:24px;right:20px;width:52px;height:52px;' +
                'border-radius:50%;border:none;background:#4299e1;color:#fff;' +
                'font-size:24px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.25);' +
                'z-index:9998;display:flex;align-items:center;justify-content:center;' +
                'transition:transform 0.2s,opacity 0.2s;';
        this.floatBtn.addEventListener('click', () => this.toggle());
        // Show when target is focused
        this.target.addEventListener('focus', () => { if (this.floatBtn)
            this.floatBtn.style.opacity = '1'; });
        this.target.addEventListener('blur', () => {
            setTimeout(() => {
                if (!this.visible && this.floatBtn)
                    this.floatBtn.style.opacity = '0.5';
            }, 200);
        });
        document.body.appendChild(this.floatBtn);
    }
    // ========== Internal ==========
    _build() {
        this.el = document.createElement('div');
        this.el.className = 'kkb-root';
        this.el.innerHTML = this._renderHTML();
        this.el.style.cssText =
            'position:fixed;bottom:0;left:0;right:0;z-index:9999;display:none;' +
                'transform:translateY(100%);opacity:0;transition:transform 0.25s ease,opacity 0.25s ease;';
        this.el.addEventListener('mousedown', (e) => e.preventDefault());
        this.el.addEventListener('click', (e) => {
            const key = e.target.closest('[data-key]');
            if (key)
                this._press(key.getAttribute('data-key'));
        });
        this.container.appendChild(this.el);
    }
    _renderHTML() {
        const keys = this._currentLayout();
        let html = '';
        for (const row of keys) {
            html += '<div class="kkb-row">';
            for (const k of row) {
                const wide = k.wide ? ' kkb-wide' : '';
                const special = ['BACKSPACE', 'ENTER', 'SHIFT', 'NUMS', 'ABC'].includes(k.output)
                    ? ' kkb-special' : '';
                html +=
                    `<button class="kkb-key${wide}${special}" data-key="${encodeURIComponent(JSON.stringify(k))}">${k.label}</button>`;
            }
            html += '</div>';
        }
        return html;
    }
    _currentLayout() {
        const layout = this.shifted ? (SHIFTED[this.layout] || LAYOUTS[this.layout]) : LAYOUTS[this.layout];
        const filtered = !this.includeZWNJ
            ? layout.map(row => row.filter(k => k.output !== '\u200C' && k.output !== '\u200D'))
            : layout;
        // Swap number keys if latin format requested
        if (this.numberFormat === 'latin' && (this.layout === 'numbers' || this.layout === 'standard')) {
            return filtered.map(row => row.map(k => this._swapNumeral(k)));
        }
        return filtered;
    }
    _swapNumeral(k) {
        const map = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
        if (map[k.output])
            return { label: map[k.output], output: map[k.output], wide: k.wide };
        return k;
    }
    _rerender() {
        this.el.innerHTML = this._renderHTML();
        // Re-attach click handler after innerHTML wipe
        this.el.addEventListener('click', (e) => {
            const key = e.target.closest('[data-key]');
            if (key)
                this._press(key.getAttribute('data-key'));
        });
    }
    _press(raw) {
        const k = JSON.parse(decodeURIComponent(raw));
        switch (k.output) {
            case 'BACKSPACE': {
                const start = this.target.selectionStart || 0;
                const end = this.target.selectionEnd || 0;
                if (start !== end) {
                    this.target.value = this.target.value.slice(0, start) + this.target.value.slice(end);
                    this.target.selectionStart = this.target.selectionEnd = start;
                }
                else if (start > 0) {
                    this.target.value = this.target.value.slice(0, start - 1) + this.target.value.slice(start);
                    this.target.selectionStart = this.target.selectionEnd = start - 1;
                }
                break;
            }
            case 'ENTER':
                this._insert('\n');
                break;
            case 'SHIFT':
                this.shifted = !this.shifted;
                this._rerender();
                return;
            case 'NUMS':
                this.layout = 'numbers';
                this.shifted = false;
                this._rerender();
                return;
            case 'ABC':
                this.layout = 'standard';
                this.shifted = false;
                this._rerender();
                return;
            default:
                this._insert(k.output);
        }
        this.target.focus();
        this._applyAutoConvert();
        this.target.dispatchEvent(new Event('input', { bubbles: true }));
        this.onChange?.(this.target.value);
    }
    _applyAutoConvert() {
        if (!this.autoConvertMode)
            return;
        const val = this.target.value;
        if (!val)
            return;
        const converted = convertMixedText(val, this.autoConvertMode);
        if (converted !== val) {
            const start = this.target.selectionStart ?? 0;
            const end = this.target.selectionEnd ?? 0;
            this.target.value = converted;
            this.target.selectionStart = this.target.selectionEnd = Math.min(start, converted.length);
        }
    }
    _insert(text) {
        const el = this.target;
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        el.value = el.value.slice(0, start) + text + el.value.slice(end);
        const newPos = start + text.length;
        el.selectionStart = el.selectionEnd = newPos;
    }
    _handleDocClick(e) {
        const target = e.target;
        if (!this.el.contains(target) && target !== this.target) {
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
                return;
            this.hide();
        }
    }
}
export default KurdishKeyboard;
