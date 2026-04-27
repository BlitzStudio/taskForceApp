export const lightTheme = {
  bg: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#fafafa',
  border: '#e5e5e5',
  borderStrong: '#d4d4d4',
  text: '#171717',
  textMuted: '#737373',
  textSubtle: '#a3a3a3',
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  danger: '#dc2626',
  success: '#16a34a',
  warning: '#ea580c',
  shadow: 'rgba(0,0,0,0.05)',
};

export const darkTheme: typeof lightTheme = {
  bg: '#0a0a0a',
  surface: '#171717',
  surfaceAlt: '#262626',
  border: '#262626',
  borderStrong: '#404040',
  text: '#f5f5f5',
  textMuted: '#a3a3a3',
  textSubtle: '#737373',
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f97316',
  shadow: 'rgba(0,0,0,0.4)',
};

export const STATUS_COLORS = {
  'not-started': '#737373',
  'in-progress': '#2563eb',
  'completed': '#16a34a',
  'on-hold': '#ea580c',
  'not-important': '#a3a3a3',
};

export const PRIORITY_COLORS = {
  low: '#16a34a',
  medium: '#ea580c',
  high: '#dc2626',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radii = { sm: 6, md: 8, lg: 12, xl: 16, pill: 999 };

export type ThemeColors = typeof lightTheme;
