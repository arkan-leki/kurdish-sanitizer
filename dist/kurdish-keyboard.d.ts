/**
 * Kurdish Keyboard — A mobile-friendly virtual keyboard for typing
 * Kurdish (Sorani) Unicode characters with a C4Kurd/Arabic-style layout.
 *
 * Usage:
 *   import { KurdishKeyboard } from 'kurdish-keyboard';
 *   const kb = new KurdishKeyboard({ target: document.getElementById('my-input')! });
 */
export interface KeyDef {
    label: string;
    output: string;
    wide?: boolean;
}
export type LayoutName = 'standard' | 'numbers' | 'symbols';
/**
 * Non-Unicode Kurdish input types the keyboard can auto-convert.
 * - 'ali-k': Ali-K/C4Kurd Latin-based font (e.g. "kUrdy" → "کوردی")
 * - 'arabic-kb': Arabic/Persian keyboard layout (e.g. "\u0643\u0648\u0631\u062F\u064A" → "کوردی")
 * - 'latin': Hawar-based Latin (e.g. "kurdî" → "کوردی")
 * - false: no auto-conversion
 */
export type AutoConvert = 'ali-k' | 'arabic-kb' | 'latin' | false;
export declare const ALI_K_MAP: Record<string, string>;
/** Arabic/Persian keyboard → proper Kurdish Unicode */
export declare const ARABIC_KB_MAP: Record<string, string>;
/**
 * Convert Ali-K / C4Kurd legacy Latin text to Kurdish Unicode.
 * e.g. "kUrdy" → "کوردی"
 */
export declare function convertAliK(text: string): string;
/**
 * Fix Arabic/Persian keyboard text to proper Kurdish Unicode.
 * e.g. "\u0643\u0648\u0631\u062F\u064A" → "کوردی"
 */
export declare function convertArabicKB(text: string): string;
/**
 * Simple Latin→Arabic conversion for Hawar-style input.
 * e.g. "kurdî" → "کوردی"
 */
export declare function convertLatin(text: string): string;
/**
 * Convert Latin characters in-place within mixed Kurdish text.
 * Preserves existing Kurdish/Arabic characters, only converts Latin.
 * e.g. "کوردiستان" → "کوردستان" (i removed as per Ali-K mapping)
 *      "رودaw" → "روداو"
 *      "dzn" → "دزن"
 */
export declare function convertMixedText(text: string, mode: AutoConvert | 'auto'): string;
export interface KurdishKeyboardOptions {
    /** Target input/textarea element (or CSS selector) */
    target: HTMLInputElement | HTMLTextAreaElement | string;
    /** Starting layout */
    layout?: LayoutName;
    /** Append keyboard to this element (defaults to document.body) */
    container?: HTMLElement | string;
    /** Called after each key press with the full text value */
    onChange?: (value: string) => void;
    /** Show keyboard immediately */
    autoShow?: boolean;
    /** Include ZWNJ key in layout (default: true) */
    includeZWNJ?: boolean;
    /** Show a floating ⌨️ button to toggle keyboard (default: false) */
    floatingButton?: boolean;
    /** Keyboard direction (default: 'rtl') */
    direction?: 'rtl' | 'ltr';
    /** Number format for keyboard output (default: 'arabic' for ٠١٢٣, 'latin' for 0123) */
    numberFormat?: 'arabic' | 'latin';
    /**
     * Auto-convert non-Unicode input (Ali-K, Arabic keyboard, Latin) to Kurdish Unicode.
     * - 'ali-k': convert Ali-K/C4Kurd Latin
     * - 'arabic-kb': fix Arabic/Persian keyboard text
     * - 'latin': convert Hawar Latin to Arabic script
     * - 'auto': detect and convert automatically
     * - false: no conversion (default)
     */
    autoConvert?: AutoConvert | 'auto';
}
export declare class KurdishKeyboard {
    private target;
    private container;
    private el;
    private floatBtn;
    private layout;
    private shifted;
    private visible;
    private includeZWNJ;
    private numberFormat;
    private autoConvertMode;
    private onChange?;
    private _onDocClick;
    constructor(options: KurdishKeyboardOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    /** Switch number format between 'arabic' (٠١٢٣) and 'latin' (0123) */
    setNumberFormat(format: 'arabic' | 'latin'): void;
    destroy(): void;
    private _addFloatingButton;
    private _build;
    private _renderHTML;
    private _currentLayout;
    private _swapNumeral;
    private _rerender;
    private _press;
    private _applyAutoConvert;
    private _insert;
    private _handleDocClick;
}
export default KurdishKeyboard;
