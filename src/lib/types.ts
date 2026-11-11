/**
 * Prop language shared with the DOM library (../fractalsvelte-ui/src/lib/types.ts),
 * copied so this package is self-contained. The unions are the single source of
 * truth for both packages; keep them in sync.
 */

export const Variants = ['primary', 'secondary', 'themed', 'outline', 'ghost', 'link'] as const;
export type Variant = (typeof Variants)[number];

export const Sizes = ['h-xs', 'h-sm', 'h-md', 'h-bs', 'h-lg', 'h-xl'] as const;
export type Size = (typeof Sizes)[number];

export const Shapes = ['rect', 'mincurved', 'modern', 'curved', 'round'] as const;
export type Shape = (typeof Shapes)[number];

export const Shadows = [
	'shad-none', 'shad-sm', 'shad-bs', 'shad-lg', 'shad-xl', 'shad-2xl',
	'shad-hover-sm', 'shad-hover-bs', 'shad-hover-lg', 'shad-hover-xl', 'shad-hover-2xl'
] as const;
export type Shadow = (typeof Shadows)[number];

export const TextSizes = [
	'text-xs', 'text-sm', 'text-md', 'text-bs', 'text-lg',
	'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'
] as const;
export type TextSize = (typeof TextSizes)[number];

export const ChildTextSizes = ['text-xs', 'text-sm', 'text-md', 'text-bs'] as const;
export type ChildTextSize = (typeof ChildTextSizes)[number];

export const Surfaces = [
	'bg-main', 'bg-surface', 'bg-panel', 'bg-overlay', 'state-hover', 'state-selected', 'bg-button', 'bg-input'
] as const;
export type Surface = (typeof Surfaces)[number];

export const ThemeColors = ['theme-color', 'theme-color-up', 'theme-color-down'] as const;
export type ThemeColor = (typeof ThemeColors)[number];

export const Borders = [
	'border', 'border-subtle', 'border-strong', 'border-dashed', 'border-none', 'bb', 'bb-str', 'bb-sub', 'bb-dash'
] as const;
export type Border = (typeof Borders)[number];

export const Messages = ['info', 'success', 'warning', 'danger'] as const;
export type Message = (typeof Messages)[number];

export const MessageTexts = ['text-info', 'text-success', 'text-warning', 'text-danger'] as const;
export type MessageText = (typeof MessageTexts)[number];

export const Weights = ['weight-300', 'weight-400', 'weight-500', 'weight-600', 'weight-700', 'weight-800'] as const;
export type Weight = (typeof Weights)[number];

export type Orientation = 'horizontal' | 'vertical';

export const Frames = [
	'frame-16-9', 'frame-9-16', 'frame-4-3', 'frame-3-4', 'frame-3-2', 'frame-2-3', 'frame-1-1'
] as const;
export type Frame = (typeof Frames)[number];

export const Spaces = ['xs', 'sm', 'md', 'bs', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type Space = (typeof Spaces)[number];

export interface SelectOption {
	value: string | number;
	label: string;
	disabled?: boolean;
	group?: string;
}

export interface Column<T = Record<string, unknown>> {
	key: keyof T & string;
	label: string;
	align?: 'left' | 'right' | 'center';
	sortable?: boolean;
}
