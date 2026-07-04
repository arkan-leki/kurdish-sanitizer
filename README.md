# ⌨️ Kurdish Keyboard

A mobile-friendly **TypeScript virtual keyboard** for typing Kurdish (Sorani) with an Arabic-script layout. Includes auto-conversion from Ali-K, C4Kurd, Latin, and Arabic keyboard input — plus a built-in Kurdish text sanitizer.

---

## Features

- 🎹 **Virtual Keyboard** — Arabic-script layout (not QWERTY), slides up from bottom like a mobile keyboard
- 🔄 **Auto-Convert** — Detects and converts Ali-K, C4Kurd, Latin, and Arabic keyboard input to proper Kurdish Unicode
- 🧹 **Text Sanitizer** — Fixes `ك`→`ک`, `ي`→`ی`, `ه`→`ە`/`ھ`, ZWNJ, Tatweel, punctuation spacing
- 🔢 **Number Format** — Choose Arabic (`٠١٢٣`) or Latin (`0123`) numerals per input
- 📋 **Copy, Backspace, Enter** — Standard keyboard actions
- ⇧ **Shift Layer** — Diacritics and extra characters
- 🎨 **CSS Variables** — Fully themeable
- 📱 **Mobile-First** — Responsive, touch-friendly, swipe-to-dismiss ready
- 📦 **TypeScript** — Full type definitions included

---

## Quick Start

### Install

```bash
npm install kurdish-keyboard
```

### Usage

```ts
import { KurdishKeyboard } from 'kurdish-keyboard';
import 'kurdish-keyboard/dist/kurdish-keyboard.css';

// Attach to an input
new KurdishKeyboard({
  target: '#my-input',
  autoConvert: 'auto',       // auto-detect & convert non-Unicode input
  numberFormat: 'arabic',    // ٠١٢٣ (or 'latin' for 0123)
  floatingButton: true,      // show ⌨️ toggle button
});
```

### HTML (CDN)

```html
<link rel="stylesheet" href="kurdish-keyboard.css">
<script type="module">
  import { KurdishKeyboard } from './kurdish-keyboard.js';
  new KurdishKeyboard({ target: '#my-input' });
</script>
```

---

## API

### `new KurdishKeyboard(options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `target` | `Element \| string` | *required* | Input/textarea element or CSS selector |
| `layout` | `'standard' \| 'numbers' \| 'symbols'` | `'standard'` | Starting layout |
| `autoConvert` | `'auto' \| 'ali-k' \| 'arabic-kb' \| 'latin' \| false` | `false` | Auto-convert non-Unicode input |
| `numberFormat` | `'arabic' \| 'latin'` | `'arabic'` | Numeral type on key labels |
| `floatingButton` | `boolean` | `false` | Show floating ⌨️ toggle button |
| `includeZWNJ` | `boolean` | `true` | Include ZWNJ key in layout |
| `direction` | `'rtl' \| 'ltr'` | `'rtl'` | Keyboard direction |
| `container` | `Element \| string` | `document.body` | Where to append the keyboard |
| `onChange` | `(value: string) => void` | — | Called after each keypress |
| `autoShow` | `boolean` | `false` | Show keyboard immediately |

### Methods

| Method | Description |
|---|---|
| `show()` | Show the keyboard |
| `hide()` | Hide the keyboard |
| `toggle()` | Toggle visibility |
| `setNumberFormat(f)` | Switch number format (`'arabic'` / `'latin'`) |
| `destroy()` | Remove keyboard and clean up |

---

## Exported Functions

You can use the conversion functions standalone (no keyboard needed):

```ts
import { convertMixedText, convertAliK, convertArabicKB, convertLatin } from 'kurdish-keyboard';

convertMixedText('kUrdy', 'auto');           // "کوردی"
convertAliK('pYSwazy');                      // "پێشوازی"
convertArabicKB('كي');                      // "کی"
convertLatin('rojbaş');                      // "رۆژباش"
```

---

## Auto-Convert Modes

| Mode | Example Input | Output |
|---|---|---|
| `'auto'` | `kUrdy` | `کوردی` |
| `'auto'` | `كي` | `کی` |
| `'auto'` | `kurdi` | `کوردی` |
| `'ali-k'` | `mNdAL` | `منداڵ` |
| `'arabic-kb'` | `علي` | `علی` |
| `'latin'` | `silaw` | `سڵاو` |

---

## Theming

Override CSS variables on `.kkb-root` or `:root`:

```css
:root {
  --kkb-bg: #1a1a2e;
  --kkb-key-bg: #16213e;
  --kkb-key-color: #eee;
  --kkb-key-active-bg: #e94560;
  --kkb-key-height: 48px;
  --kkb-key-font-size: 20px;
}
```

Full list of variables in `src/kurdish-keyboard.css`.

---

## Demo

Open `demo.html` in a browser to see:

- 🎮 **Demos tab** — Auto-convert textarea, Arabic-nums keyboard, Latin-nums keyboard
- 📋 **Table Search tab** — Search 15 Kurdish employee records across encodings (Ali-K, Arabic KB, Latin, Unicode)

---

## Project Structure

```
kurdish-keyboard/
├── src/
│   ├── kurdish-keyboard.ts   # Main TypeScript source
│   └── kurdish-keyboard.css  # Styles with CSS variables
├── dist/                     # Built output
├── demo.html                 # Interactive demo
├── package.json
└── tsconfig.json
```

---

## License

MIT
