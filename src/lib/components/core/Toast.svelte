<!-- @component A single notification with title, description, tone, action and auto-dismiss. Ported from ../fractalsvelte-ui core/Toast.svelte — the countdown is the Progress-style drawn bar (GPUI takes % on width), and hover pauses through the renderer's mouseEnter/mouseLeave. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconNode } from '../../icons/types.ts';
	import { klCircleCheck, klCircleX, klInfo, klTriangleAlert } from '../../icons/keylinestroke.ts';
	import type { Message, MessageText, Surface, Border, Shadow, Shape, TextSize } from '../../types.ts';
	import CloseButton from '../actions/CloseButton.svelte';

	interface Props {
		id?: string;
		title?: string;
		description?: string;
		/** Tone of the icon and progress bar */
		messageText?: MessageText;
		/** An icon from $lib/icons/keylinestroke or keylinefill; defaults to one per tone */
		icon?: IconNode;
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		/** ms until auto-dismiss; 0 keeps it open */
		duration?: number;
		dismissible?: boolean;
		textsize?: TextSize;
		class?: string;
		onclose?: () => void;
		action?: Snippet;
		children?: Snippet;
	}

	let {
		id,
		title,
		description,
		messageText = 'text-info',
		icon,
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'curved',
		padding = 'pad-md',
		duration = 4000,
		dismissible = true,
		textsize = 'text-md',
		class: className = '',
		onclose,
		action,
		children
	}: Props = $props();

	const ICONS: Record<Message, IconNode> = {
		info: klInfo,
		success: klCircleCheck,
		warning: klTriangleAlert,
		danger: klCircleX
	};
	const tone = $derived(messageText.replace('text-', '') as Message);
	let visible = $state(true);
	let remaining = $state(1);
	let paused = $state(false);

	// No requestAnimationFrame in the GPUI runtime: the countdown ticks on an
	// interval, and each write restyles the drawn bar into the next frame.
	$effect(() => {
		if (duration <= 0) return;
		let last = performance.now();
		const timer = setInterval(() => {
			const now = performance.now();
			if (!paused) remaining = Math.max(0, remaining - (now - last) / duration);
			last = now;
			if (remaining <= 0) {
				clearInterval(timer);
				dismiss();
			}
		}, 100);
		return () => clearInterval(timer);
	});

	function dismiss() {
		if (!visible) return;
		visible = false;
		onclose?.();
	}

	const THICK = 3;
</script>

{#if visible}
	<div
		id={id}
		role={tone === 'danger' ? 'alert' : 'status'}
		aria-live={tone === 'danger' ? 'assertive' : 'polite'}
		class="card box gap-xs {surface} {border} {shape} {padding} {textsize} {className}"
		onmouseenter={() => (paused = true)}
		onmouseleave={() => (paused = false)}
	>
		<div class="row ytop gap-sm">
			<div class="row ycenter shrink-0 text-lg {messageText}" aria-hidden="true"><Icon icon={icon ?? ICONS[tone]} /></div>
			<div class="box gap-xs grow min0">
				{#if title}<text class="text-sm weight-600">{title}</text>{/if}
				{#if description}<text class="text-sm lh15 text-secondary">{description}</text>{/if}
				{#if children}{@render children()}{/if}
			</div>
			{#if action}<div class="row ycenter shrink-0">{@render action()}</div>{/if}
			{#if dismissible}
				<CloseButton label="Close notification" size="h-sm" class="shrink-0" onclick={dismiss} />
			{/if}
		</div>
		{#if duration > 0}
			<div class="{messageText} fsui-track" style="height: {THICK}px; width: 100%; opacity: 0.15;">
				<div class="{messageText}" style="height: 100%; width: {Math.round(remaining * 100)}%; opacity: 1;"></div>
			</div>
		{/if}
	</div>
{/if}
