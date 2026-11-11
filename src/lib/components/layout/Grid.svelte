<!-- @component Responsive CSS Grid container with explicit columns. Ported from ../fractalsvelte-ui layout/Grid.svelte — GPUI's grid takes a track count (`grid-template-columns: N`), so the responsive folding and auto-fit card grid collapse to the full-width column count. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Space, TextSize } from '../../types.ts';

	interface Props {
		/** Columns at full width. Omit for the card grid's auto-fit feel (4 tracks). */
		cols?: 1 | 2 | 3 | 4 | 6;
		/** Space between cells, from the spacing scale. */
		gap?: Space;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let { cols, gap = 'bs', padding, textsize = 'text-md', class: className = '', children }: Props = $props();

	const tracks = $derived(cols ?? 4);
</script>

<div
	class="wfull {padding ?? ''} {textsize} {className}"
	style="display: grid; grid-template-columns: {tracks}; gap: var(--space-{gap}, 16px);"
>
	{@render children?.()}
</div>
