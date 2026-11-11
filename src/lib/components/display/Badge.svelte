<!-- @component A small label for status or counts, with optional leading dot. Ported from ../fractalsvelte-ui display/Badge.svelte — the dot is a GPUI box, not an inline SVG circle. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Message, Size, Shape, TextSize } from '../../types.ts';

	interface Props {
		message?: Message;
		size?: Size;
		shape?: Shape;
		/** Leading status dot */
		dot?: boolean;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		message = 'success',
		size = 'h-md',
		shape = 'modern',
		dot = false,
		textsize = 'text-sm',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="badge row ycenter gap-xs shrink-0 msg {message} {size} {shape} {textsize} {className}">
	{#if dot}
		<div class="shrink-0" style="width: 6px; height: 6px; border-radius: 999px; background-color: currentColor;"></div>
	{/if}
	{@render children?.()}
</div>
