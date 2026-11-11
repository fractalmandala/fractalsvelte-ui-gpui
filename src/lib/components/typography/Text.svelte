<!-- @component Polymorphic typography primitive supporting tone colors, weights, and truncation. Ported from ../fractalsvelte-ui typography/Text.svelte — GPUI has no semantic tags, so every render is a `<text>` element. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TextSize, Weight } from '../../types.ts';

	type TextTone = 'default' | 'secondary' | 'muted' | 'themed' | 'info' | 'success' | 'warning' | 'danger';

	interface Props {
		/** Semantic text tone color. */
		tone?: TextTone;
		textsize?: TextSize;
		weight?: Weight;
		/** Monospace code font family. */
		mono?: boolean;
		/** Single-line text truncation with ellipsis. */
		truncate?: boolean;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		tone = 'default',
		textsize = 'text-md',
		weight,
		mono = false,
		truncate = false,
		onclick,
		class: className = '',
		children
	}: Props = $props();

	const toneMap: Record<TextTone, string> = {
		default: 'text-primary',
		secondary: 'text-secondary',
		muted: 'text-muted',
		themed: 'text-theme',
		info: 'text-info',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger'
	};
</script>

<text
	class="lh16 {toneMap[tone]} {textsize} {weight ?? ''} {mono ? 'font-mono' : ''} {truncate ? 'truncate' : ''} {className}"
	onclick={onclick}
>
	{@render children?.()}
</text>
