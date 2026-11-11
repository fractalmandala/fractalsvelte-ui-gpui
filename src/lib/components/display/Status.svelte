<!-- @component A status pill or badge with an integrated indicator dot and label. Ported from ../fractalsvelte-ui display/Status.svelte — the tint classes use color-mix(), which GPUI cannot compute, so the tint is the message fill at low opacity (bg x-00) with the x-25 border; solid variants keep their own ink. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Variant, Message, Size, Shape, TextSize } from '../../types.ts';
	import Dot from './Dot.svelte';

	interface Props {
		variant?: Variant | Message;
		size?: Size;
		shape?: Shape;
		/** Lite mode renders a subtle border outline instead of a tinted surface */
		lite?: boolean;
		/** Pulsating animation on the indicator dot */
		animated?: boolean;
		/** Status label text */
		label?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'success',
		size = 'h-sm',
		shape = 'round',
		lite = false,
		animated = false,
		label,
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));
	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };

	const bg = $derived(
		!lite && isMessage
			? `var(--${variant}-00, var(--bg-panel, #ebebeb))`
			: !lite && variant === 'themed'
				? 'var(--theme-color, #497100)'
				: !lite && variant === 'primary'
					? 'var(--bg-button, #151615)'
					: !lite && variant === 'secondary'
						? 'var(--bg-button-secondary, #e7e8e7)'
						: 'transparent'
	);
	const border = $derived(
		lite
			? 'var(--border, #dedede)'
			: isMessage
				? `var(--${variant}-25, var(--border, #dedede))`
				: 'transparent'
	);
	const ink = $derived(
		lite ? 'text-primary' : isMessage ? `text-${variant}` : variant === 'themed' || variant === 'primary' ? 'text-inverse' : 'text-primary'
	);
</script>

<div
	class="row ycenter gap-xs px-sm weight-500 {textsize} {className}"
	style="height: {H[size]}px; border-radius: {RADIUS[shape]}px; background-color: {bg}; border: 1px solid {border};"
>
	<Dot {variant} {animated} size={size === 'h-xs' || size === 'h-sm' ? 'sm' : 'md'} />
	<!-- on a tint the label takes the message colour; a solid fill keeps its own ink -->
	<text class="{ink} {textsize}">
		{#if children}{@render children()}{:else if label}{label}{/if}
	</text>
</div>
