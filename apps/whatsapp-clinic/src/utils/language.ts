const ARABIC_PATTERN = /[؀-ۿ]/;
const ALLOWED_PATTERN = /[؀-ۿ -~ \n\r\t]/g;

export function detectLanguage(text: string): 'ar' | 'en' {
  return ARABIC_PATTERN.test(text) ? 'ar' : 'en';
}

export function getLanguageInstruction(lang: 'ar' | 'en'): string {
  return lang === 'ar'
    ? 'IMPORTANT: You MUST respond in Arabic only. Do not use any word from any other language (no French, Russian, Chinese, Spanish, etc). Every single word must be Arabic or standard punctuation.'
    : 'IMPORTANT: You MUST respond in English only. Do not mix any other language.';
}

export function stripForeignCharacters(text: string, lang: 'ar' | 'en'): string {
  if (lang === 'en') return text;

  // For Arabic responses: keep Arabic chars, numbers, punctuation, whitespace
  // Remove ALL Latin letters (a-z, A-Z) — covers German, French, Russian latin etc.
  const cleaned = text
    .split('')
    .filter(char => {
      const code = char.charCodeAt(0);
      const isArabic = code >= 0x0600 && code <= 0x06FF;
      const isArabicExtended = code >= 0xFB50 && code <= 0xFDFF;
      const isNumber = code >= 0x0030 && code <= 0x0039;
      const isPunctuation = '.,!?:;-_()[]{}"\'/\\@#%^&*+=<>~`|'.includes(char);
      const isWhitespace = char === ' ' || char === '\n' || char === '\r' || char === '\t';
      const isEmoji = code >= 0x1F000;
      return isArabic || isArabicExtended || isNumber || isPunctuation || isWhitespace || isEmoji;
    })
    .join('');

  // Clean up multiple spaces left after removal
  return cleaned.replace(/  +/g, ' ').trim();
}
