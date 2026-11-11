<!-- @component Horizontal or vertical divider separator rule with optional centered label. Ported from ../fractalsvelte-ui display/Divider.svelte — the line is one edge of an otherwise empty box, from the border-elevation-focus layer. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Border, TextSize } from '../../types.ts';

	interface Props {
		/** Optional text label centered along the divider line. */
		label?: string;
		/** Vertical orientation instead of default horizontal. */
		vertical?: boolean;
		border?: Border;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		vertical = false,
		border = 'border',
		textsize = 'text-sm',
		class: className = '',
		children
	}: Props = $props();

	const hasLabel = $derived(Boolean(label || children));

	// The line is one edge of an otherwise empty box, in the weight the border prop asks for.
	const LINE: Record<string, string> = {
		border: 'bt',
		'border-strong': 'bt-str',
		'border-subtle': 'bt-sub',
		'border-dashed': 'bt',
		'border-none': ''
	};
</script>

{#if vertical}
	<div role="separator" aria-orientation="vertical" class="hfull mx-sm {LINE[border].replace('bt', 'bl')} {className}"></div>
{:else if hasLabel}
	<div role="separator" aria-orientation="horizontal" class="row ycenter gap-md wfull my-sm {textsize} {className}">
		<div class="grow {LINE[border]}"></div>
		<text class="shrink-0 text-xs weight-500 ls-wide-xl text-secondary">
			{#if children}{@render children()}{:else}{label}{/if}
		</text>
		<div class="grow {LINE[border]}"></div>
	</div>
{:else}
	<div role="separator" aria-orientation="horizontal" class="wfull my-sm {LINE[border]} {className}"></div>
{/if}
