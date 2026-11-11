<!-- @component An inline message box: tinted by `message`, or plain with coloured text and icon via `messageText`. Ported from ../fractalsvelte-ui core/Alert.svelte. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import CloseButton from '../actions/CloseButton.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import { klCircleCheck, klCircleX, klInfo, klTriangleAlert } from '../../icons/keylinestroke.ts';
	import type { Message, MessageText, Shape, TextSize, ChildTextSize } from '../../types.ts';

	interface Props {
		/** Tinted box in this tone (background, border, icon and title) */
		message?: Message;
		/** Plain box with only the icon and title in this tone; overrides message */
		messageText?: MessageText;
		title?: string;
		description?: string;
		dismissible?: boolean;
		onclose?: () => void;
		/** An icon from $lib/icons/keylinestroke or keylinefill; defaults to one per tone */
		icon?: IconNode;
		/** Alert corners; alerts take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		padding?: string;
		textsize?: TextSize;
		childtextsize?: ChildTextSize;
		class?: string;
		testid?: string;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		message = 'info',
		messageText,
		title,
		description,
		dismissible = false,
		onclose,
		icon,
		shape = 'modern',
		padding = 'py-bs px-lg',
		textsize = 'text-sm',
		childtextsize = 'text-sm',
		class: className = '',
		testid,
		actions,
		children
	}: Props = $props();

	const ICONS: Record<Message, IconNode> = {
		info: klInfo,
		success: klCircleCheck,
		warning: klTriangleAlert,
		danger: klCircleX
	};
	const tone = $derived<Message>(messageText ? (messageText.replace('text-', '') as Message) : message);
	const toneText = $derived(messageText ?? `text-${message}`);
	let closed = $state(false);

	function dismiss() {
		closed = true;
		onclose?.();
	}
</script>

{#if !closed}
	<div
		role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
		testid={testid}
		class="card msg {message} {shape} {padding} {className}"
	>
		<div class="row ytop gap-sm">
			<div class="row ycenter shrink-0 text-lg {messageText ? toneText : ''}" aria-hidden="true">
				<Icon icon={icon ?? ICONS[tone]} />
			</div>
			<div class="box gap-xs grow min0 xleft ta-l">
				{#if title}<text class="{textsize} weight-500 lh11 {messageText ? toneText : ''}">{title}</text>{/if}
				{#if description}<text class="{textsize} lh11 text-secondary">{description}</text>{/if}
				{#if children}<text class="{childtextsize} text-secondary">{@render children()}</text>{/if}
				{#if actions}<div class="row ycenter gap-xs wrap pt-xs">{@render actions()}</div>{/if}
			</div>
			{#if dismissible}
				<CloseButton label="Dismiss alert" size="h-md" class="text-muted" onclick={dismiss} />
			{/if}
		</div>
	</div>
{/if}
