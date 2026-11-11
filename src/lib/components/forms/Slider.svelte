<!-- @component A single-thumb slider for choosing a value in a range. Ported from ../fractalsvelte-ui forms/Slider.svelte — the SVG track becomes drawn boxes: the fill rides % on width, the thumb sits at a px offset from the onlayout-measured track length, and dragging is mouseDown/mouseMove/mouseUp on the track. -->
<script lang="ts">
	import type { MessageText, Size, TextSize } from '../../types.ts';

	interface Props {
		value?: number;
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
		onchange?: (value: number) => void;
		class?: string;
	}

	let {
		value = $bindable(0),
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

	let dragging = $state(false);
	let focused = $state(false);
	let trackLen = $state(0);

	const THICK: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const thick = $derived(THICK[size]);
	const r = $derived(Math.max(8, thick / 2 + 2));
	const trackH = $derived(Math.max(4, Math.round(thick / 5)));
	const vert = $derived(direction === 'vertical');
	const fraction = $derived(max <= min ? 0 : (Math.max(min, Math.min(max, value)) - min) / (max - min));

	function roundToStep(val: number): number {
		const raw = min + Math.round((val - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		return Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
	}

	function fromPointer(x: number, y: number) {
		if (disabled) return;
		// The pointer arrives in window coordinates; the track's origin comes from
		// onlayout. The thumb radius is the dead zone at each end.
		const pos = vert ? y : x;
		const origin = vert ? trackBottom : trackLeft;
		const len = trackLen;
		const d = vert ? origin + len - pos : pos - origin;
		const ratio = Math.max(0, Math.min(1, (d - r) / Math.max(1, len - r * 2)));
		set(min + ratio * (max - min));
	}

	function set(v: number) {
		value = roundToStep(v);
		onchange?.(value);
	}

	function onkeydown(e: { key: string; preventDefault: () => void }) {
		if (disabled) return;
		const map: Record<string, number> = {
			ArrowRight: value + step,
			ArrowUp: value + step,
			ArrowLeft: value - step,
			ArrowDown: value - step,
			PageUp: value + step * 10,
			PageDown: value - step * 10,
			Home: min,
			End: max
		};
		if (!(e.key in map)) return;
		e.preventDefault();
		set(map[e.key]);
	}

	let trackLeft = 0;
	let trackTop = 0;
	let trackBottom = 0;

	function layout(e: { x: number; y: number; width: number; height: number }) {
		trackLeft = e.x;
		trackTop = e.y;
		trackBottom = e.y + e.height;
		trackLen = (vert ? e.height : e.width) || trackLen;
	}

	const fillW = $derived(vert ? thick : `${Math.round(fraction * 1000) / 10}%`);
	const fillH = $derived(vert ? `${Math.round(fraction * 1000) / 10}%` : trackH);
	const thumbAt = $derived(r + Math.max(0, Math.min(1, fraction)) * Math.max(0, trackLen - r * 2));
</script>

<div class="box gap-xs {vert ? 'xcenter' : 'wfull'} {textsize} {className}">
	{#if label || showValue}
		<div class="row ycenter xbetween gap-sm">
			{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
			{#if showValue}<text class="px-sm mincurved text-xs text-secondary state-hover">{formatValue(value)}</text>{/if}
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
		aria-valuenow={value}
		aria-valuetext={formatValue(value)}
		aria-label={label}
		onlayout={layout}
		onclick={(e) => {
				if (disabled) return;
			fromPointer(e.x, e.y);
		}}
		onmousedown={(e) => {
			if (disabled) return;
			dragging = true;
			fromPointer(e.x, e.y);
		}}
		onmousemove={(e) => dragging && fromPointer(e.x, e.y)}
		onmouseup={() => (dragging = false)}
		onmouseleave={() => (dragging = false)}
		onkeydown={onkeydown}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
	>
		<!-- the track's ghost -->
		<div
			class="{disabled ? 'text-muted' : tone ? tone.replace('text-', 'bg-') : 'bg-theme'}"
			style="position: absolute; height: {trackH}px; width: 100%; border-radius: {trackH / 2}px; opacity: 0.35;"
		></div>
		<!-- the fill -->
		<div
			class="{disabled ? 'text-muted' : tone ? tone.replace('text-', 'bg-') : 'bg-theme'}"
			style="position: absolute; {vert ? `bottom: 0; left: ${(thick - trackH) / 2}px; width: ${trackH}px; height: ${fillH}` : `top: ${(thick - trackH) / 2}px; left: 0; width: ${fillW}; height: ${trackH}px`}; border-radius: {trackH / 2}px;"
		></div>
		<!-- the thumb -->
		<div
			style="position: absolute; {vert
				? `top: ${(thumbAt - r).toFixed(1)}px; left: ${(thick - r) / 2}px`
				: `left: ${(thumbAt - r).toFixed(1)}px; top: ${(thick - r) / 2}px`}; width: {r * 2}px; height: {r * 2}px; border-radius: 999px; background-color: var(--bg-overlay, #ffffff); border: 2px solid {disabled ? 'var(--text-muted, #bcbfbc)' : tone ? `var(--${tone.replace('text-', '')}, #497100)` : 'var(--theme-color, #497100)'};"
		>
			{#if focused && !disabled}
				<div style="position: absolute; inset: -2px; border-radius: 999px; background-color: currentColor; opacity: 0.25;"></div>
			{/if}
		</div>
	</div>
</div>
