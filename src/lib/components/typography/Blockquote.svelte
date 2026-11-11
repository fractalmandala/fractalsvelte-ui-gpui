<!-- @component A quotation with author and citation. Ported from ../fractalsvelte-ui typography/Blockquote.svelte — GPUI has no <blockquote>/<cite>, so it is boxes and text with the same classes. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import { klQuote } from '../../icons/keylinestroke.ts';
	import type { Border, ThemeColor, TextSize } from '../../types.ts';

	interface Props {
		quote?: string;
		author?: string;
		citation?: string;
		/** An icon from $lib/icons/keylinestroke or keylinefill, or false for none */
		icon?: IconNode | false;
		/** Colour of the icon */
		accent?: ThemeColor;
		/** Left rule colour */
		border?: Border;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		authorSnippet?: Snippet;
	}

	let {
		quote,
		author,
		citation,
		icon = klQuote,
		accent = 'theme-color',
		border = 'border-strong',
		textsize = 'text-md',
		class: className = '',
		children,
		authorSnippet
	}: Props = $props();

	// The rule down the left edge, in the weight the border prop asks for.
	const LINE: Record<string, string> = { border: 'bl', 'border-strong': 'bl-str', 'border-subtle': 'bl-sub', 'border-dashed': 'bl', 'border-none': '' };
	const ACCENT: Record<string, string> = { 'theme-color': 'text-theme', 'theme-color-up': 'text-theme-up', 'theme-color-down': 'text-theme-down' };
</script>

<div class="row ytop gap-md pl-md py-xs {LINE[border] ?? 'bl'} {textsize} {className}">
	{#if icon}
		<div class="row shrink-0 text-xl {ACCENT[accent]}" aria-hidden="true"><Icon {icon} /></div>
	{/if}
	<div class="box gap-sm min0">
		{#if quote}<text class="text-lg text-primary lh15">{quote}</text>{/if}
		{#if children}<div class="text-bs text-primary lh16">{@render children()}</div>{/if}
		{#if author || citation || authorSnippet}
			<div class="row ycenter gap-xs wrap text-sm">
				{#if authorSnippet}
					{@render authorSnippet()}
				{:else}
					{#if author}<text class="weight-600 text-primary">{author}</text>{/if}
					{#if citation}<text class="text-muted">— {citation}</text>{/if}
				{/if}
			</div>
		{/if}
	</div>
</div>
