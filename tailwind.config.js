/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        // ── BRAND PURPLE ──────────────────────────
        // Use: bg-brand, text-brand, border-brand
        brand: {
          DEFAULT: '#5B21B6',  // buttons, logo, active nav
          hover:   '#4C1D95',  // darker purple 
          light:   '#EDE9FE',  // pale purpl
        },

        // ── BACKGROUNDS ───────────────────────────
        
        surface: '#FFFFFF',
        page:    '#F3F4F6',

        // ── TEXT ──────────────────────────────────
       
        primary:   '#111827',  // near black — names, titles
        sub:       '#6B7280',  // medium gray — body text, nav labels
        muted:     '#9CA3AF',  // light gray — timestamps, hints

        // ── BORDERS ───────────────────────────────
       
        line:    '#E5E7EB',  // standard border on cards and panels
        subtle:  '#F3F4F6',  // very light divider between messages

        // ── STATUS ────────────────────────────────
        
        online:  '#10B981',  // green — online status dot
        star:    '#F59E0B',  // gold — mentor star icon

        // ── BADGES ────────────────────────────────
        // "Previously Took Course" badge
      
        'badge-prev':      '#FEF3C7',  // yellow background
        'badge-prev-text': '#92400E',  // brown text

        // "Anonymous" badge
        
        'badge-anon':      '#E5E7EB',  // gray background
        'badge-anon-text': '#374151',  // dark gray text

        // ── SPECIAL ───────────────────────────────
        // Jane Doe avatar square in sidebar
        // Use: bg-avatar-user
        'avatar-user': '#5B21B6',  // same purple as brand, white JD text on top

      },

      borderRadius: {
        
        badge:  '4px',   // tiny — badge chips
        btn:    '6px',   // small — all buttons
        card:   '12px',  // medium — white cards and panels
        modal:  '16px',  // large — course discovery modal
        avatar: '6px',   // square avatar (Jane Doe) — slightly rounded square
      },

      fontSize: {
        
        'xxs':   ['11px', { lineHeight: '1.4' }],  // timestamps, section labels
        'label': ['13px', { lineHeight: '1.5' }],  // nav items, badge text, metadata
      },

    },
  },
  plugins: [],
}