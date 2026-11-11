/**
 * Non-colour tokens, in px. GPUI's rem is fixed at 16 px, so the canonical rem
 * tokens are baked here as px literals (component stylekit rules inline them).
 * Text sizes use the canonical desktop scale (typography.css, the >=1281px row);
 * --text-xs and --text-sm have no breakpoint row and stay as written.
 */

/** --space-* (gaps-pads-margins.css): rem at 16px. */
export const SPACE = {
	xs: 4,
	sm: 8,
	md: 12,
	bs: 16,
	lg: 24,
	xl: 32,
	'2xl': 48,
	'3xl': 64
} as const;

/** --radius-* (shapes-sizes.css). */
export const RADIUS = {
	xs: 2,
	sm: 3,
	md: 6,
	bs: 12,
	lg: 16,
	full: 999
} as const;

/** --h-* component heights (shapes-sizes.css). */
export const H = {
	'h-xs': 12,
	'h-sm': 16,
	'h-md': 20,
	'h-bs': 27,
	'h-lg': 32,
	'h-xl': 40
} as const;

/** --text-* (typography.css, desktop scale, rem × 16). */
export const TEXT = {
	'text-xs': 10.72,
	'text-sm': 12,
	'text-md': 14.4,
	'text-bs': 16,
	'text-lg': 22.4,
	'text-xl': 28.16,
	'text-2xl': 35.2,
	'text-3xl': 44,
	'text-4xl': 55.04,
	'text-5xl': 68.8
} as const;

export type SpaceSize = keyof typeof SPACE;
export type TextToken = keyof typeof TEXT;
