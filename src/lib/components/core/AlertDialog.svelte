<!-- @component A modal that asks the user to confirm or cancel an action. Ported from ../fractalsvelte-ui core/AlertDialog.svelte — an alert dialog only closes through its buttons: no backdrop dismissal, and Escape maps to Cancel. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import { klTriangleAlert } from '../../icons/keylinestroke.ts';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';
	import type { Message, Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		confirmText?: string;
		cancelText?: string;
		/** Tone of the icon; danger also paints the confirm button */
		message?: Message;
		/** Disables both actions and blocks Escape while an async confirm runs */
		loading?: boolean;
		textsize?: TextSize;
		class?: string;
		onconfirm?: () => void;
		oncancel?: () => void;
		/** An icon from $lib/icons/keylinestroke or keylinefill; defaults to a warning triangle */
		icon?: IconNode;
		surface?: Surface;
		border?: Border;
		shadow?: Shadow;
		shape?: Shape;
		trigger?: Snippet<[{ open: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title = 'Are you sure?',
		description,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		message = 'danger',
		loading = false,
		textsize = 'text-md',
		class: className = '',
		onconfirm,
		oncancel,
		icon,
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'curved',
		trigger,
		children
	}: Props = $props();

	const uid = $props.id();

	function cancel() {
		if (loading) return;
		open = false;
		oncancel?.();
	}

	function confirm() {
		if (loading) return;
		open = false;
		onconfirm?.();
	}
</script>

{@render trigger?.({ open: () => (open = true) })}

<Modal
	bind:open
	role="alertdialog"
	closeOnBackdrop={false}
	closeOnEscape={false}
	onescape={cancel}
	{surface}
	{border}
	{shadow}
	{shape}
	aria-labelledby={title ? `${uid}-title` : undefined}
	aria-describedby={description ? `${uid}-desc` : undefined}
	width={448}
	panelClass="{textsize} {className}"
>
	<div class="row ytop gap-sm px-md pt-md pb-sm">
		<div class="row ycenter shrink-0 text-xl" aria-hidden="true">
			<Icon icon={icon ?? klTriangleAlert} class={message === 'danger' ? 'text-danger' : message === 'warning' ? 'text-warning' : `text-${message}`} />
		</div>
		<div class="box gap-xs min0">
			{#if title}<text id="{uid}-title" class="text-lg weight-600 lh12">{title}</text>{/if}
			{#if description}<text id="{uid}-desc" class="text-sm text-secondary lh15">{description}</text>{/if}
			{#if children}{@render children()}{/if}
		</div>
	</div>
	<div class="row ycenter xright gap-xs wrap px-md py-sm bt state-selected">
		<Button size="h-sm" variant="ghost" disabled={loading} onclick={cancel}>{cancelText}</Button>
		<Button size="h-sm" variant={message === 'danger' ? 'danger' : 'primary'} disabled={loading} onclick={confirm}>{confirmText}</Button>
	</div>
</Modal>
