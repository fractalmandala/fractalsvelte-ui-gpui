<!-- @component A number that counts up to `value`, with prefix, suffix and decimals. Ported from ../fractalsvelte-ui display/Counter.svelte — no requestAnimationFrame in the GPUI runtime, so the count-up ticks on an interval. -->
<script lang="ts">
	import type { TextSize } from '../../types.ts';

	interface Props {
		value?: number;
		prefix?: string;
		suffix?: string;
		decimals?: number;
		/** Count-up duration in ms; 0 jumps straight to the value. */
		duration?: number;
		textsize?: TextSize;
		class?: string;
	}

	let {
		value = 0,
		prefix = '',
		suffix = '',
		decimals = 0,
		size = 'text-3xl',
		duration = 600,
		textsize = 'text-md',
		class: className = ''
	}: Props = $props();

	// The motion is the number itself counting, not a CSS transform: each tick
	// writes text content, never style.
	let shown = $state(0);
	let from = 0;

	$effect(() => {
		const target = value;
		const start = performance.now();
		const origin = from;
		if (duration <= 0) {
			shown = from = target;
			return;
		}
		const timer = setInterval(() => {
			const t = Math.min(1, (performance.now() - start) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			shown = from = origin + (target - origin) * eased;
			if (t >= 1) clearInterval(timer);
		}, 33);
		return () => clearInterval(timer);
	});

	const text = $derived(decimals > 0 ? shown.toFixed(decimals) : Math.round(shown).toString());
</script>

<div
	class="row ybot gap-xs weight-600 lh11 {size} {textsize} {className}"
	role="status"
	aria-live="polite"
	aria-label="{prefix}{value}{suffix}"
>
	{#if prefix}<text class="text-muted">{prefix}</text>{/if}
	<text aria-hidden="true">{text}</text>
	{#if suffix}<text class="text-muted">{suffix}</text>{/if}
</div>
