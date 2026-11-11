<!-- @component A menu of actions that opens from a trigger. Ported from ../fractalsvelte-ui core/DropdownMenu.svelte — the panel rides the fork's `<Popover>` (side/align instead of a placement string); outside presses and Escape are the popover's own. -->
<script lang="ts" module>
	import type { MenuEntry } from '../overlays/MenuList.svelte';

	export interface DropdownMenuItem extends MenuEntry {
		onclick?: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Popover from 'gpuix-fractalsvelte/components/Popover.svelte';
	import MenuList from '../overlays/MenuList.svelte';
	import type { Size, Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	/** `bottom-start` → `side="bottom" align="start"`, and so on. */
	export type Placement =
		| 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
		| 'left-start' | 'left-end' | 'right-start' | 'right-end';

	interface Props {
		open?: boolean;
		/** Outside press or Escape. */
		onclose?: () => void;
		placement?: Placement;
		closeOnSelect?: boolean;
		items?: DropdownMenuItem[];
		label?: string;
		size?: Size;
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		trigger?: Snippet<[{ open: boolean; toggle: () => void }]>;
		/** Custom menu body replacing items */
		children?: Snippet<[{ close: () => void }]>;
	}

	let {
		open = $bindable(false),
		onclose,
		placement = 'bottom-start',
		closeOnSelect = true,
		items = [],
		label,
		size = 'h-md',
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'modern',
		textsize = 'text-md',
		class: className = '',
		trigger: triggerSnippet,
		children
	}: Props = $props();

	const side = $derived(placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right');
	const align = $derived(placement.split('-')[1] as 'start' | 'end');
	const close = () => (open = false);
</script>

<Popover bind:open onclose={() => onclose?.()} {side} {align} testid="dropdown-menu">
	{#if triggerSnippet}
		{@render triggerSnippet?.({ open, toggle: () => (open = !open) })}
	{/if}
	{#snippet content()}
		{#if children}
			{@render children({ close })}
		{:else}
			<MenuList
				{items}
				{label}
				{size}
				{surface}
				{border}
				{shadow}
				{shape}
				{textsize}
				onclose={close}
				onselect={(item) => {
					(item as DropdownMenuItem).onclick?.();
					if (closeOnSelect) close();
				}}
			/>
		{/if}
	{/snippet}
</Popover>
