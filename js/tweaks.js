// ========= TWEAKS (editmode) =========
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FAFAF7",
  "personalDark": true,
  "commercialLayout": "grid",
  "displayFont": "vt323",
  "crt": true,
  "fisheye": false
}/*EDITMODE-END*/;
window.__TWEAKS = { ...TWEAK_DEFAULTS };

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"VT323"', '"DotGothic16"', 'ui-monospace', 'monospace'],
        sans: ['"Noto Sans TC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    }
  }
};
