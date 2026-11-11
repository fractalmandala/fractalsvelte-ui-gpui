<!-- @component Inline code text. Ported from ../fractalsvelte-ui typography/Code.svelte — GPUI's `<code>` element takes a `code` string; for inline styled text we render a `<text>` with the canonical classes. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Surface, Border, Size, TextSize } from '../../types.ts';

	interface Props {
		surface?: Surface;
		border?: Border;
		/** Text step from the control size scale */
		size?: Size;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		surface = 'state-hover',
		border = 'border-none',
		size = 'h-sm',
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();

	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
</script>

<div class="font-mono px-xs mincurved {surface} {border} {textsize} {className}" style="display: inline-flex; align-items: center; min-height: {H[size]}px;">
	{@render children?.()}
</div>
