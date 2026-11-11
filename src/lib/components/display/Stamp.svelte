<!-- @component An icon or metric tile stamp with square aspect ratio, rounded corners, and status variants. Ported from ../fractalsvelte-ui display/Stamp.svelte — the pinned positions are absolute px insets (GPUI's pin-* classes use tokens GPUI can read, but the tile keeps its own aspect-ratio box). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Variant, Message, Size, Shape, TextSize } from '../../types.ts';

	export type StampPosition = 'inline' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

	interface Props {
		size?: Size;
		variant?: Variant | Message;
		shape?: Shape;
		/** `inline` flows with the content; the others pin the stamp to a corner of its positioned parent. */
		position?: StampPosition;
		textsize?: TextSize;
		class?: string;
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		size = 'h-lg',
		variant = 'primary',
		shape = 'curved',
		position = 'inline',
		textsize = 'text-md',
		class: className = '',
		icon,
		children
	}: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));
	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const px = $derived(H[size]);
	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };

	// The canonical `.tint.x` uses color-mix(); GPUI cannot, so the tint is the
	// message fill at low opacity over the panel surface.
	const bg = $derived(
		isMessage
			? `var(--${variant}-00, var(--bg-panel, #ebebeb))`
			: `var(--${variant === 'primary' ? 'bg-button' : variant === 'secondary' ? 'bg-button-secondary' : variant === 'themed' ? 'theme-color' : 'bg-panel'})`
	);
	const ink = $derived(isMessage ? `text-${variant}` : variant === 'themed' ? 'text-white' : variant === 'secondary' || variant === 'outline' || variant === 'ghost' || variant === 'link' ? 'text-primary' : 'text-inverse');
</script>

{#if position === 'inline'}
	<div
		class="row xcenter ycenter weight-600 {textsize} {className}"
		style="width: {px}px; height: {px}px; border-radius: {RADIUS[shape]}px; background-color: {bg}; display: inline-flex; align-items: center; justify-content: center;"
	>
		<div class="row ycenter {ink}">
			{#if icon}{@render icon()}{:else if children}{@render children()}{/if}
		</div>
	</div>
{:else}
	<div class="relative wfull hfull">
		<div
			class="row xcenter ycenter weight-600 {textsize} {className}"
			style="position: absolute; {position === 'top-start'
				? 'top: 8px; left: 8px'
				: position === 'top-end'
					? 'top: 8px; right: 8px'
					: position === 'bottom-start'
						? 'bottom: 8px; left: 8px'
						: 'bottom: 8px; right: 8px'}; width: {px}px; height: {px}px; border-radius: {RADIUS[shape]}px; background-color: {bg};"
		>
			<div class="row ycenter {ink}">
				{#if icon}{@render icon()}{:else if children}{@render children()}{/if}
			</div>
		</div>
	</div>
{/if}
