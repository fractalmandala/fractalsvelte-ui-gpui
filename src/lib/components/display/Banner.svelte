<!-- @component A full-width notice strip: tinted by `message`, or plain with coloured text and icon via `messageText`. Ported from ../fractalsvelte-ui display/Banner.svelte — the tint classes use color-mix(), which GPUI cannot compute, so the tint is the tone at low opacity over bg-panel; sizes map to the banner paddings. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import { klCircleCheck, klCircleX, klInfo, klTriangleAlert, klX } from '../../icons/keylinestroke.ts';
	import type { Message, MessageText, Size, Shape, TextSize } from '../../types.ts';
	import IconButton from '../actions/IconButton.svelte';

	interface Props {
		/** Tinted strip in this tone (background, border and icon) */
		message?: Message;
		/** Plain strip with only the icon and text in this tone; overrides message */
		messageText?: MessageText;
		/** Padding and text step, h-sm … h-xl */
		size?: Size;
		/** Corner treatment; square suits a full-width strip, the others an inline notice */
		shape?: Shape;
		dismissible?: boolean;
		onclose?: () => void;
		/** An icon from $lib/icons/keylinestroke or keylinefill; defaults to one per tone */
		icon?: IconNode;
		textsize?: TextSize;
		class?: string;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		message = 'info',
		messageText,
		size = 'h-md',
		shape = 'rect',
		dismissible = false,
		onclose,
		icon,
		textsize = 'text-md',
		class: className = '',
		action,
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

	// canonical .banner.h-* paddings and text steps
	const STEP: Record<Size, { padBlock: number; padInline: number; text: string }> = {
		'h-xs': { padBlock: 4, padInline: 8, text: 'text-sm' },
		'h-sm': { padBlock: 4, padInline: 8, text: 'text-sm' },
		'h-md': { padBlock: 8, padInline: 12, text: 'text-md' },
		'h-bs': { padBlock: 8, padInline: 12, text: 'text-bs' },
		'h-lg': { padBlock: 12, padInline: 16, text: 'text-lg' },
		'h-xl': { padBlock: 12, padInline: 24, text: 'text-xl' }
	};
	const step = $derived(STEP[size]);
</script>

{#if !closed}
	<aside
		role="status"
		class="banner row ycenter xbetween gap-md wfull {shape === 'rect' ? 'bb' : 'border'} {shape} {textsize} {className}"
		style="padding: {step.padBlock}px {step.padInline}px; {messageText
			? ''
			: `background-color: var(--${tone}-00, var(--bg-panel, #ebebeb)); border-color: var(--${tone}-25, var(--border, #dedede)); color: var(--text-primary, #0a0b0a);`}{messageText ? 'background-color: var(--bg-panel, #ebebeb);' : ''}"
	>
		<div class="row ycenter gap-sm min0">
			<div class="row ycenter shrink-0 {toneText}" aria-hidden="true"><Icon icon={icon ?? ICONS[tone]} /></div>
			<div class="min0 {messageText ?? ''}">{@render children?.()}</div>
		</div>
		<div class="row ycenter gap-xs shrink-0">
			{@render action?.()}
			{#if dismissible}
				<IconButton iconVariant="ghost" size="h-sm" label="Dismiss banner" class="text-muted" onclick={dismiss}>
					<Icon icon={klX} />
				</IconButton>
			{/if}
		</div>
	</aside>
{/if}
