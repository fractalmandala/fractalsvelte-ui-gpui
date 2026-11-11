<!-- @component A two-thumb range slider. Ported from ../fractalsvelte-ui forms/RangeSlider.svelte — the SVG track becomes drawn boxes (see Slider); the two thumbs drag independently, and the fills clamp so they never cross. -->
<script lang="ts">
	import type { MessageText, Size, TextSize } from '../../types.ts';

	interface Props {
		/** The lower thumb; bind both to keep them ordered. */
		from?: number;
		/** The upper thumb. */
		to?: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		description?: string;
		showValue?: boolean;
		formatValue?: (val: number) => string;
		tone?: MessageText;
		/** Thumb diameter / track thickness */
		size?: Size;
		direction?: 'horizontal' | 'vertical';
		disabled?: boolean;
		id?: string;
		textsize?: TextSize;
		onchange?: (range: { from: number; to: number }) => void;
		class?: string;
	}

	let {
		from = $bindable(0),
		to = $bindable(100),
		min = 0,
		max = 100,
		step = 1,
		label,
		description,
		showValue = false,
		formatValue = (v: number) => String(v),
		tone,
		size = 'h-sm',
		direction = 'horizontal',
		disabled = false,
		id,
		textsize = 'text-md',
		onchange,
		class: className = ''
	}: Props = $props();

	let dragging = $state<0 | 1 | null>(null);
	let focused = $state<number | null>(null);
	let trackLen = $state(0);

	const THICK: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const thick = $derived(THICK[size]);
	const r = $derived(Math.max(8, thick / 2 + 2));
	const trackH = $derived(Math.max(4, Math.round(thick / 5)));
	const vert = $derived(direction === 'vertical');
	const clampV = (v: number) => Math.max(min, Math.min(max, v));

	function roundToStep(val: number): number {
		const raw = min + Math.round((val - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(clampV(raw).toFixed(decimals));
	}

	function set(which: 0 | 1, v: number) {
		const rounded = roundToStep(v);
		if (which === 0) from = Math.min(rounded, to);
		else to = Math.max(rounded, from);
		onchange?.({ from, to });
	}

	function fromPointer(which: 0 | 1, x: number, y: number) {
		if (disabled) return;
		const pos = vert ? y : x;
		const origin = vert ? trackBottom : trackLeft;
		const d = vert ? origin + trackLen - pos : pos - origin;
		const ratio = Math.max(0, Math.min(1, (d - r) / Math.max(1, trackLen - r * 2)));
		set(which, min + ratio * (max - min));
	}

	function onkeydown(e: { key: string; preventDefault: () => void }) {
		if (disabled || focused === null) return;
		const which = focused;
		const current = which === 0 ? from : to;
		const map: Record<string, number> = {
			ArrowRight: current + step,
			ArrowUp: current + step,
			ArrowLeft: current - step,
			ArrowDown: current - step,
			PageUp: current + step * 10,
			PageDown: current - step * 10,
			Home: min,
			End: max
		};
		if (!(e.key in map)) return;
		e.preventDefault();
		set(which, map[e.key]);
	}

	let trackLeft = 0;
	let trackBottom = 0;

	function layout(e: { x: number; y: number; width: number; height: number }) {
		trackLeft = e.x;
		trackBottom = e.y + e.height;
		trackLen = (vert ? e.height : e.width) || trackLen;
	}

	const fFrom = $derived((clampV(from) - min) / Math.max(1, max - min));
	const fTo = $derived((clampV(to) - min) / Math.max(1, max - min));
	const lo = $derived(Math.min(fFrom, fTo));
	const hi = $derived(Math.max(fFrom, fTo));
	const ink = $derived(tone ? tone.replace('text-', 'bg-') : 'bg-theme');
	const border_ink = $derived(tone ?? 'text-theme');
</script>

<div class="box gap-xs {vert ? 'xcenter' : 'wfull'} {textsize} {className}">
	{#if label || showValue}
		<div class="row ycenter xbetween gap-sm">
			{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
			{#if showValue}<text class="px-sm mincurved text-xs text-secondary state-hover">{formatValue(from)} – {formatValue(to)}</text>{/if}
		</div>
	{/if}
	{#if description}<text class="text-sm text-muted lh15">{description}</text>{/if}
	<div
		id={id}
		class="relative wfull pointer {disabled ? 'disabled' : ''}"
		hitbox="self"
		style="height: {thick}px; display: flex; align-items: center; background-color: transparent;"
		role="slider"
		tabindex={disabled ? undefined : 0}
		aria-orientation={direction}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={from}
		aria-valuetext={`${formatValue(from)} – ${formatValue(to)}`}
		aria-label={label}
		onlayout={layout}
		onclick={(e) => {
			if (disabled) return;
			const pos = vert ? e.y : e.x;
			const d = vert ? trackBottom - pos : pos - trackLeft;
			const ratio = Math.max(0, Math.min(1, (d - r) / Math.max(1, trackLen - r * 2)));
			set(ratio < (lo + hi) / 2 ? 0 : 1, min + ratio * (max - min));
		}}
		onmousedown={(e) => {
			if (disabled) return;
			const pos = vert ? e.y : e.x;
			const d = vert ? trackBottom - pos : pos - trackLeft;
			const ratio = Math.max(0, Math.min(1, (d - r) / Math.max(1, trackLen - r * 2)));
			// the thumb the press landed closer to
			dragging = ratio < (lo + hi) / 2 ? 0 : 1;
			focused = dragging;
			fromPointer(dragging, e.x, e.y);
		}}
		onmousemove={(e) => dragging !== null && fromPointer(dragging, e.x, e.y)}
		onmouseup={() => (dragging = null)}
		onmouseleave={() => (dragging = null)}
		onkeydown={onkeydown}
		onblur={() => (focused = null)}
	>
		<div class="{disabled ? 'text-muted' : ink}" style="position: absolute; height: {trackH}px; width: 100%; border-radius: {trackH / 2}px; opacity: 0.35;"></div>
		<div
			class="{disabled ? 'text-muted' : ink}"
			style="position: absolute; {vert
				? `bottom: ${Math.round(lo * trackLen)}px; left: ${(thick - trackH) / 2}px; width: ${trackH}px; height: ${Math.round((hi - lo) * trackLen)}px`
				: `left: ${Math.round(lo * trackLen)}px; top: ${(thick - trackH) / 2}px; width: ${Math.round((hi - lo) * trackLen)}px; height: ${trackH}px`}; border-radius: {trackH / 2}px;"
		></div>
		{#each [lo, hi] as f, i (i)}
			{@const at = r + f * Math.max(0, trackLen - r * 2)}
			<div
				style="position: absolute; {vert
					? `top: ${(at - r).toFixed(1)}px; left: ${(thick - r) / 2}px`
					: `left: ${(at - r).toFixed(1)}px; top: ${(thick - r) / 2}px`}; width: {r * 2}px; height: {r * 2}px; border-radius: 999px; background-color: var(--bg-overlay, #ffffff); border: 2px solid {disabled ? 'var(--text-muted, #bcbfbc)' : `var(--${border_ink.replace('text-', '')}, #497100)`};"
			>
				{#if focused === i && !disabled}
					<div style="position: absolute; inset: -2px; border-radius: 999px; background-color: currentColor; opacity: 0.25;"></div>
				{/if}
			</div>
		{/each}
	</div>
</div>
