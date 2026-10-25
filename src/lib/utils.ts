import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Case-insensitive nickname check; the numeric key must match exactly. */
export function checkKey(input: string, expected: string, numeric = false) {
  if (numeric) return input.trim() === expected
  return input.trim().toUpperCase() === expected.trim().toUpperCase()
}

export function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v))
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
