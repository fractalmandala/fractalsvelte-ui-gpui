<!-- @component Shared keyboard-navigable menu list for DropdownMenu and ContextMenu. Ported from ../fractalsvelte-ui overlays/MenuList.svelte — GPUI has no DOM focus queries, so roving focus is not implemented; rows are plain buttons, Escape reaches the menu through the window key listener. -->
<script lang="ts" module>
	import type { IconNode } from '../../icons/types.ts';

	export interface MenuEntry {
		id?: string;
		label?: string;
		icon?: IconNode;
		shortcut?: string;
		danger?: boolean;
		disabled?: boolean;
		separator?: boolean;
	}
</script>

<script lang="ts">
	import Icon from '../core/Icon.svelte';
	import type { Size, Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	interface Props {
		items: MenuEntry[];
		label?: string;
		onselect: (item: MenuEntry, index: number) => void;
		onclose: () => void;
		/** Row height */
		size?: Size;
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		shape?: Shape;
		textsize?: TextSize;
	}

	let {
		items,
		label,
		onselect,
		onclose,
		size = 'h-md',
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'modern',
		textsize = 'text-md'
	}: Props = $props();

	const H: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
</script>

<div
	role="menu"
	class="box gap-xs pad-xs {surface} {border} {shadow} {shape} {textsize}"
	style="min-width: 180px;"
>
	{#if label}
		<text class="text-xs weight-500 text-secondary px-sm">{label}</text>
	{/if}
	{#each items as item, i (item.id ?? i)}
		{#if item.separator}
			<div class="bt"></div>
		{:else}
			<button
				role="menuitem"
				class="button {item.danger ? 'text-danger' : 'text-primary'} {size} {item.disabled ? 'disabled' : ''}"
				style="justify-content: flex-start;"
				{...item.disabled ? {} : { onclick: () => onselect(item, i) }}
			>
				{#if item.icon}<Icon icon={item.icon} size={16} />{/if}
				<text class="grow" style="text-align: left;">{item.label}</text>
				{#if item.shortcut}<text class="text-xs text-muted">{item.shortcut}</text>{/if}
			</button>
		{/if}
	{/each}
</div>
