<!-- @component A label chip, optionally removable, filled with or coloured by a surface, theme or message colour. Ported from ../fractalsvelte-ui display/Tag.svelte — the fill is an inline style (GPUI's var() resolves from the palette, not from an ancestor element, so style:--tag-color cannot carry the colour). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import type { Size, Shape, Surface, ThemeColor, Message, TextSize } from '../../types.ts';

	export type TagColor = Surface | ThemeColor | Message;

	interface Props {
		/** Fill colour, or the text colour when `textOnly` is set. */
		variant?: TagColor;
		/** Colours the text and icon instead of the background. */
		textOnly?: boolean;
		size?: Size;
		shape?: Shape;
		removable?: boolean;
		removeLabel?: string;
		onremove?: (event: MouseEvent) => void;
		icon?: IconNode;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'theme-color',
		textOnly = false,
		size = 'h-sm',
		shape = 'mincurved',
		removable = false,
		removeLabel = 'Remove tag',
		onremove,
		icon,
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();

	// Surface and state fills can be light or dark depending on the token and mode, so their ink is
	// picked from the fill's lightness; theme and message fills take white.
	const ink = $derived(
		variant.startsWith('bg-') || variant.startsWith('state-') ? 'text-primary' : 'text-white'
	);

	function handleRemove(event: MouseEvent) {
		event.stopPropagation();
		onremove?.(event);
	}
</script>

<div
	class="tag row ycenter gap-xs shrink-0 {size} {shape} {textOnly ? 'text-only' : ink} {textsize} {className}"
	style="background-color: var(--{variant});"
>
	{#if icon}<Icon {icon} />{/if}
	{@render children?.()}
	{#if removable}
		<CloseButton label={removeLabel} size="h-sm" onclick={handleRemove} />
	{/if}
</div>
