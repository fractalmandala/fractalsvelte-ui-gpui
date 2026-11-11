<!-- @component Applies a fractalsvelte palette to the GPUI window and registers the stylesheets. Put it once, near the root. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { apply_tokens, use_palette, type Mode, type Palette } from './theme.ts';
	import '../styles/index.css';

	interface Props {
		mode?: Mode;
		/** Extra or overriding tokens: `{ 'theme-color': '#ff3e00' }` rebrands everything. */
		tokens?: Palette;
		children?: Snippet;
	}

	let { mode = 'light', tokens, children }: Props = $props();

	// The palette first (it is complete), then the one-off overrides on top.
	// Two effects so a palette switch re-applies both, in order.
	$effect(() => use_palette(mode));
	$effect(() => {
		if (tokens) apply_tokens(tokens);
	});
</script>

{#if children}{@render children()}{/if}
