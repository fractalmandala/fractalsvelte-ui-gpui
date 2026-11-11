<!-- @component A studio audio level fader with tactile grooved thumb marks, vertical by default. Ported from ../fractalsvelte-ui forms/Fader.svelte — the drawn track/thumb mechanics are the Slider's; the thumb marks are grooves painted across the cap. -->
<script lang="ts">
	import type { Size, Shape, TextSize, Orientation } from '../../types.ts';

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		orientation?: Orientation;
		disabled?: boolean;
		size?: Size;
		shape?: Shape;
		label?: string;
		showValue?: boolean;
		thumbMarks?: number;
		textsize?: TextSize;
		onchchange?: (value: number) => void;
		class?: string;
	}

	let {
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		orientation = 'vertical',
		disabled = false,
		size = 'h-xl',
		shape = 'curved',
		label,
		showValue = true,
		thumbMarks = 3,
		textsize = 'text-md',
		onchchange,
		class: className = ''
	}: Props = $props();

	// Reuses the Slider's geometry, flipped upright: the track is the control
	// height wide and a fixed 160px long, 0 at the bottom.
	const W: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const thick = $derived(W[size]);
	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };
	const LEN = 160;
	const r = $derived(Math.max(10, thick / 2 + 2));

	let dragging = $state(false);
	let trackTop = $state(0);
	let trackLen = $state(LEN);

	const fraction = $derived(Math.max(0, Math.min(1, (value - min) / Math.max(1e-6, max - min))));

	function set(v: number) {
		const raw = min + Math.round((v - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		value = Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
		onchchange?.(value);
	}

	function fromPointer(x: number, y: number) {
		if (disabled) return;
		const d = trackTop + trackLen - y; // 0 at the bottom
		const ratio = Math.max(0, Math.min(1, (d - r) / Math.max(1, trackLen - r * 2)));
		set(min + ratio * (max - min));
	}

	function layout(e: { x: number; y: number; width: number; height: number }) {
		trackTop = e.y;
		trackLen = e.height || trackLen;
	}

	const thumbAt = $derived(r + fraction * Math.max(0, trackLen - r * 2));
	const capR = $derived(thick / 2 + 2);
</script>

<div class="box gap-xs xcenter {textsize} {className}">
	{#if label || showValue}
		<div class="row ycenter gap-sm">
			{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
			{#if showValue}<text class="text-xs text-secondary">{Math.round(value)}</text>{/if}
		</div>
	{/if}
	<div
		class="pointer {disabled ? 'disabled' : ''}"
		style="position: relative; width: {thick}px; height: {LEN}px; background-color: transparent;"
		onlayout={layout}
		onclick={(e) => fromPointer(e.x, e.y)}
		onmousedown={(e) => {
			dragging = true;
			fromPointer(e.x, e.y);
		}}
		onmousemove={(e) => dragging && fromPointer(e.x, e.y)}
		onmouseup={() => (dragging = false)}
		onmouseleave={() => (dragging = false)}
		hitbox="self"
	>
		<!-- the channel -->
		<div style="position: absolute; left: {(thick - 6) / 2}px; top: 0; width: 6px; height: 100%; border-radius: 3px; background-color: var(--border, #dedede);"></div>
		<!-- the filled run -->
		<div style="position: absolute; left: {(thick - 6) / 2}px; top: {Math.round(thumbAt)}px; width: 6px; height: {Math.max(0, Math.round(trackLen - r - thumbAt))}px; border-radius: 3px; background-color: var(--theme-color, #497100);"></div>
		<!-- the cap -->
		<div
			style="position: absolute; top: {Math.round(thumbAt - capR)}px; left: 0; width: {thick}px; height: {capR * 2}px; border-radius: {RADIUS[shape]}px; background-color: var(--bg-overlay, #ffffff); border: 1px solid var(--border-strong, #aeaeae);"
		>
			{#each Array.from({ length: thumbMarks }, (_, i) => i) as mi (mi)}
				<div style="position: absolute; left: 2px; right: 2px; top: {Math.round(((mi + 1) * capR * 2) / (thumbMarks + 1))}px; height: 1px; background-color: var(--border, #dedede);"></div>
			{/each}
		</div>
	</div>
</div>
