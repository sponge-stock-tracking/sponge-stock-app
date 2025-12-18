/**
 * Tasarım Token'ları
 * Tüm sistem genelinde tutarlı tasarım için kullanılacak değerler
 */

export const designTokens = {
  colors: {
    bg: {
      dark: '#021024',
      mid: '#052659',
      soft: '#5483B3',
      light: '#7DA0CA',
      veryLight: '#C1E8FF',
    },
    text: {
      main: '#FFFFFF',
      muted: '#C1E8FF',
    },
    alert: {
      red: '#FFFFFF',
      bg: 'rgba(255, 255, 255, 0.2)',
    },
    calendar: {
      active: '#4CAF50',
      dayHover: 'rgba(255, 255, 255, 0.1)',
      today: '#7DA0CA',
    },
    nav: {
      buttonHover: '#5483B3',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    sm: '0 4px 10px rgba(0, 0, 0, 0.2)',
    md: '0 10px 25px rgba(0, 0, 0, 0.4)',
    lg: '0 15px 35px rgba(0, 0, 0, 0.5)',
    inset: 'inset 0 1px 1px rgba(255, 255, 255, 0.35)',
    insetHover: 'inset 0 1px 2px rgba(255, 255, 255, 0.6)',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '18px',
    xl: '22px',
    full: '50%',
  },
  transitions: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
  backdropBlur: {
    sm: '10px',
    md: '16px',
    lg: '18px',
  },
} as const

/**
 * CSS değişkenlerini kullanarak stil oluşturma helper'ı
 */
export const getDesignToken = (path: string): string => {
  const parts = path.split('.')
  let value: any = designTokens
  for (const part of parts) {
    value = value[part]
    if (value === undefined) return ''
  }
  return value
}

