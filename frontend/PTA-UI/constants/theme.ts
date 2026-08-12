import { Platform } from 'react-native';

export const Colors = {
  // App Base Palette
  background: '#FAF7F2',
  backgroundSecondary: '#FFFDF9',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8F5EE',
  
  // Brand & Accents
  primary: '#F59E0B',
  primaryDark: '#D97706',
  primaryLight: '#FDE68A',
  primaryGradient: ['#FFC01D', '#F59E0B', '#E58A00'],
  blueGradient: ['#38BDF8', '#0EA5E9', '#0284C7'],
  greenGradient: ['#34D399', '#10B981', '#059669'],
  
  secondary: '#3B82F6',
  secondaryLight: '#EFF6FF',
  secondaryBorder: '#BFDBFE',
  
  accentGreen: '#10B981',
  accentGreenLight: '#ECFDF5',
  accentGreenBorder: '#A7F3D0',
  
  accentRed: '#EF4444',
  accentRedLight: '#FEF2F2',
  accentRedBorder: '#FECACA',
  
  accentPurple: '#8B5CF6',
  accentPurpleLight: '#F5F3FF',
  
  // Typography
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#CBD5E1',
  textWhite: '#FFFFFF',
  
  // Borders & Dividers
  border: '#ECE6DA',
  borderLight: '#F3EFE6',
  divider: '#E2E8F0',
  
  // Shadows & Claymorphism
  shadowColor: '#7C6F5A',
  primaryShadow: '#D97706',
  blueShadow: '#2563EB',
  
  // Compatibility with Expo templates
  light: {
    text: '#1E293B',
    background: '#FAF7F2',
    tint: '#F59E0B',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#F59E0B',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: '#F59E0B',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#F59E0B',
  },
};

export const Shadows = {
  soft: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  card: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardElevated: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryButton: {
    shadowColor: Colors.primaryShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
  },
  secondaryButton: {
    shadowColor: Colors.blueShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  blueButton: {
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
