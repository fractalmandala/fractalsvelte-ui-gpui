<!-- @component A keyboard key, as an icon button or a static keycap for showing shortcuts. Ported from ../fractalsvelte-ui display/Kbd.svelte — GPUI has no `<span>`, so the static keycap is a box; text-transform is unsupported, so keycaps render their text as given. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import { klKeyboard } from '../../icons/keylinestroke.ts';
	import type { Size, Shape, IconVariant, TextSize } from '../../types.ts';
	import IconButton from '../actions/IconButton.svelte';

	interface Props {
		/** Accessible name. */
		label?: string;
		/** The key's icon, e.g. klArrowBigUp. */
		glyph?: IconNode;
		/** Keycap look; ghost by default, for the button and the static keycap alike. */
		icon?: IconVariant;
		iconVariant?: IconVariant;
		size?: Size;
		shape?: Shape;
		/** Render a non-interactive keycap instead of a button. */
		static?: boolean;
		disabled?: boolean | null;
		textsize?: TextSize;
		class?: string;
		/** Replaces the glyph, e.g. a letter key. */
		children?: Snippet;
	}

	let {
		label = 'Keyboard',
		glyph = klKeyboard,
		icon,
		iconVariant,
		size = 'h-sm',
		shape = 'mincurved',
		static: isStatic = false,
		disabled = false,
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();

	const look = $derived<IconVariant>(iconVariant ?? icon ?? 'ghost');
	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
</script>

{#if isStatic}
	<div
		class="row xcenter ycenter px-sm shrink-0 font-mono border-strong {look} {size} {shape} {textsize} {className}"
		style="display: inline-flex; align-items: center; justify-content: center; height: {H[size]}px;"
	>
		{#if children}{@render children()}{:else}<Icon icon={glyph} />{/if}
	</div>
{:else}
	<IconButton {label} iconVariant={look} {size} {shape} {disabled} class="font-mono border-strong {textsize} {className}">
		{#if children}{@render children()}{:else}<Icon icon={glyph} />{/if}
	</IconButton>
{/if}
