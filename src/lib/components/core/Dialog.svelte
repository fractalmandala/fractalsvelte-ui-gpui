<!-- @component A modal dialog with title, description, body and footer. Ported from ../fractalsvelte-ui core/Dialog.svelte — widths are px (GPUI has no em). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import Modal from './Modal.svelte';
	import type { Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	/** prose — a reading column (576px); full — the window allows. */
	export type DialogSize = 'prose' | 'full';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		size?: DialogSize;
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
		title,
		description,
		size = 'prose',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'curved',
		textsize = 'text-md',
		class: className = '',
		onclose,
		trigger,
		header,
		footer,
		children
	}: Props = $props();

	const WIDTHS: Record<DialogSize, number> = { prose: 576, full: 680 };
	const uid = $props.id();
	const hasHeader = $derived(Boolean(header || title || description));
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal
	bind:open
	{closeOnBackdrop}
	{closeOnEscape}
	{onclose}
	{surface}
	{border}
	{shadow}
	{shape}
	width={WIDTHS[size]}
	panelClass="{textsize} {className}"
>
	{#if hasHeader || showCloseButton}
		<div class="row ytop xbetween gap-md px-md pt-md pb-sm">
			<div class="box gap-xs min0">
				{#if header}
					{@render header()}
				{:else}
					{#if title}<text id="{uid}-title" class="text-lg weight-600 lh12">{title}</text>{/if}
					{#if description}<text id="{uid}-desc" class="text-sm text-secondary lh15">{description}</text>{/if}
				{/if}
			</div>
			{#if showCloseButton}
				<CloseButton label="Close dialog" size="h-sm" class="shrink-0" onclick={() => (open = false)} />
			{/if}
		</div>
	{/if}
	{#if children}<div class="box gap-sm px-md pb-md text-sm lh15">{@render children()}</div>{/if}
	{#if footer}
		<div class="row ycenter xright gap-xs wrap px-md py-sm bt state-selected">{@render footer()}</div>
	{/if}
</Modal>
