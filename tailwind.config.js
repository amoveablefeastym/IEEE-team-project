/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── BRAND PURPLES ──────────────────────────
        // Usage: bg-brand, text-brand, border-brand
        brand: {
          DEFAULT: '#5B21B6',
          hover:   '#4C1D95',
          light:   '#EDE9FE',
          subtle:  '#F5F3FF',
        },
        // ── SURFACES & BACKGROUNDS ─────────────────
        // Usage: bg-surface, bg-page
        surface: '#FFFFFF',
        page:    '#F3F4F6',

        // ── TEXT COLORS ────────────────────────────
        // Usage: text-text-primary, text-text-secondary
        'text-primary':   '#111827',
        'text-secondary': '#6B7280',
        'text-muted':     '#9CA3AF',

        // ── STATUS COLORS ──────────────────────────
        // Usage: bg-online, text-warning
        online:  '#10B981',
        warning: '#F59E0B',

        // ── BADGE COLORS ───────────────────────────
        // Usage: bg-badge-prev, text-badge-prev-text
        'badge-prev':      '#FEF3C7',
        'badge-prev-text': '#92400E',
        'badge-anon':      '#E5E7EB',
        'badge-anon-text': '#374151',
      },

      borderRadius: {
        // Usage: rounded-badge, rounded-btn, rounded-card, rounded-modal
        badge: '4px',
        btn:   '6px',
        card:  '12px',
        modal: '16px',
      },

      fontSize: {
        // Usage: text-xxs, text-label
        'xxs':   '11px',
        'label': '13px',
      },

      spacing: {
        // Usage: p-18, gap-18 etc.
        '18': '72px',
        '22': '88px',
      },
    },
  },
  plugins: [],
}