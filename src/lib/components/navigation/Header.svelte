<!-- @component A top bar with brand, centre and actions slots, optionally sticky. Ported from ../fractalsvelte-ui navigation/Header.svelte — GPUI has no sticky, so `sticky` only switches between the app-header height and a plain padded row. -->
<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		/** App-header treatment (64px tall row); off is a plain padded row. */
		sticky?: boolean;
		bordered?: boolean;
		textsize?: TextSize;
		class?: string;
		brand?: Snippet;
		center?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		sticky = true,
		bordered = true,
		textsize = 'text-md',
		class: className = '',
		brand,
		center,
		actions,
		children
	}: Props = $props();
</script>

<header
	class="{sticky ? 'app-header' : 'px-lg py-sm'} row ycenter xbetween gap-md bg-surface {bordered ? 'bb' : ''} {textsize} {className}"
	style="position: relative;"
>
	{#if brand}<div class="row ycenter gap-sm shrink-0">{@render brand()}</div>{/if}
	{#if center}<div class="row ycenter xcenter gap-sm grow min0">{@render center()}</div>{/if}
	{#if actions}<div class="row ycenter xright gap-xs shrink-0">{@render actions()}</div>{/if}
	{#if children && !brand && !center && !actions}{@render children()}{/if}
</header>
