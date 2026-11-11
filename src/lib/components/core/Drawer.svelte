<!-- @component A drawer sliding in from a window edge. Ported from ../fractalsvelte-ui core/Drawer.svelte — width in px (24em → 384px), content scrolls in the fork's Scroller. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import Scroller from 'gpuix-fractalsvelte/components/Scroller.svelte';
	import Modal from './Modal.svelte';
	import type { Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

	interface Props {
		open?: boolean;
		placement?: DrawerPlacement;
		title?: string;
		description?: string;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showCloseButton?: boolean;
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		onclose?: () => void;
		trigger?: Snippet<[{ open: () => void }]>;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		placement = 'right',
		title,
		description,
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'rect',
		textsize = 'text-md',
		class: className = '',
		onclose,
		trigger,
		header,
		footer,
		children
	}: Props = $props();

	const uid = $props.id();
	const hasHeader = $derived(Boolean(header || title || description));
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal
	bind:open
	placement={placement}
	{closeOnBackdrop}
	{closeOnEscape}
	{onclose}
	{surface}
	{border}
	{shadow}
	{shape}
	width={placement === 'left' || placement === 'right' ? 384 : undefined}
	panelClass="{textsize} {className}"
>
	{#if hasHeader || showCloseButton}
		<div class="row ytop xbetween gap-md pad-md bb">
			<div class="box gap-xs min0">
				{#if header}
					{@render header()}
				{:else}
					{#if title}<text id="{uid}-title" class="text-lg weight-600 lh12">{title}</text>{/if}
					{#if description}<text id="{uid}-desc" class="text-sm text-secondary lh15">{description}</text>{/if}
				{/if}
			</div>
			{#if showCloseButton}
				<CloseButton label="Close drawer" size="h-sm" class="shrink-0" onclick={() => (open = false)} />
			{/if}
		</div>
	{/if}
	<div class="grow min0 hmin0">
		<Scroller gap={8} pad="16px">
			{@render children?.()}
		</Scroller>
	</div>
	{#if footer}<div class="row ycenter xright gap-xs pad-md bt state-selected">{@render footer()}</div>{/if}
</Modal>
