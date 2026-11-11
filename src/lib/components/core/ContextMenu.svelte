<!-- @component A menu that opens on right-click inside a region. Ported from ../fractalsvelte-ui core/ContextMenu.svelte — GPUI reports right clicks through `onauxclick` with the pointer's window coordinates, so the menu opens at the cursor through the fork's `<Popover position>`. -->
<script lang="ts" module>
	import type { MenuEntry } from '../overlays/MenuList.svelte';

	export interface ContextMenuItem extends MenuEntry {
		id: string;
		onselect?: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Popover from 'gpuix-fractalsvelte/components/Popover.svelte';
	import MenuList from '../overlays/MenuList.svelte';
	import type { Size, Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	interface Props {
		items?: ContextMenuItem[];
		/** Called after the menu closes on an outside press or Escape. */
		onclose?: () => void;
		label?: string;
		size?: Size;
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		items = [],
		onclose,
		label = 'Context menu',
		size = 'h-md',
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'modern',
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();

	let open = $state(false);
	let at = $state({ x: 0, y: 0 });

	const close = () => (open = false);
</script>

<Popover bind:open position={at} side="bottom" align="start" testid="context-menu" onclose={() => { close(); onclose?.(); }}>
	<div
		class="{className}"
		onclick={open ? close : undefined}
		onauxclick={(e) => {
			if (e.isRightClick) {
				at = { x: e.x, y: e.y };
				open = true;
			}
		}}
	>
		{@render children?.()}
	</div>
	{#snippet content()}
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
				(item as ContextMenuItem).onselect?.();
				close();
			}}
		/>
	{/snippet}
</Popover>
