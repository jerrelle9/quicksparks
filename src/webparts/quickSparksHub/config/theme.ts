export const colors = {
    primary: '#0099c7',
    accentMagenta: '#CA3493',
    accentPurple: '#752f8b',

    background: '#f8f9fb',
    surface: '#ffffff',
    border: '#e2e5ea',

    textPrimary: '#1a1d23',
    textSecondary: '#5c6370',
    textMuted: '#8b919a',

    success: '#2d8659',
    warning: '#b5850a',
    error: '#c4392e',
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
} as const;

export const typography = {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    weights: {
        light: 300,
        regular: 400,
        semibold: 600,
        bold: 700,
    },
    sizes: {
        caption: 13,
        body: 15,
        h3: 18,
        h2: 22,
        h1: 28,
        display: 36,
    },
} as const;

export const shadows = {
    card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    cardHover: '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
} as const;

export const radii = {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
} as const;

export const transitions = {
    fast: '150ms ease-out',
    default: '200ms ease-out',
    slow: '300ms ease-out',
} as const;
