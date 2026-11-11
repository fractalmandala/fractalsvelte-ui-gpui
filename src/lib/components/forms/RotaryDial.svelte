<!-- @component A rotary dial for values that read as a knob. Ported from ../fractalsvelte-ui forms/RotaryDial.svelte — the svg arc becomes a drawn ring; dragging is vertical (up increases), like the canonical one. -->
<script lang="ts">
	import type { Size, TextSize } from '../../types.ts';

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		size?: Size;
		label?: string;
		showValue?: boolean;
		formatValue?: (val: number) => string;
		textsize?: TextSize;
		onchchange?: (value: number) => void;
		class?: string;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		size = 'h-xl',
		label,
		showValue = true,
		formatValue = (val: number) => String(val),
		textsize = 'text-md',
		onchchange,
		class: className = ''
	}: Props = $props();

	const PX: Record<Size, number> = { 'h-xs': 24, 'h-sm': 32, 'h-md': 40, 'h-bs': 48, 'h-lg': 56, 'h-xl': 72 };
	const px = $derived(PX[size]);
	const R = $derived(px / 2);
	const STROKE = 4;
	const r = $derived(R - STROKE - 2);

	// The dial sweeps 270°, from 135° (min) through 0° (mid) to -135° (max).
	const fraction = $derived(Math.max(0, Math.min(1, (value - min) / Math.max(1e-6, max - min))));
	const sweep = 270;
	const startAngle = 135;

	let lastY = 0;
	let dragging = $state(false);

	function set(v: number) {
		const raw = min + Math.round((v - min) / step) * step;
		const decimals = (step.toString().split('.')[1] || '').length;
		value = Number(Math.max(min, Math.min(max, raw)).toFixed(decimals));
		onchchange?.(value);
	}

	function byPixels(dy: number) {
		if (disabled) return;
		set(value - (dy / 120) * (max - min));
	}

	// svg source: the full track ring, the swept arc, the pointer. The arc's
	// endpoints compute in JS since GPUI's svg parser has no dash tricks.
	const source = $derived.by(() => {
		const angle = (startAngle - fraction * sweep) * (Math.PI / 180);
		const cx = R, cy = R;
		const ax = cx + r * Math.cos(angle), ay = cy - r * Math.sin(angle);
		const sx = cx + r * Math.cos((startAngle * Math.PI) / 180), sy = cy - r * Math.sin((startAngle * Math.PI) / 180);
		const endAngle = (startAngle - sweep) * (Math.PI) / 180;
		const ex = cx + r * Math.cos(endAngle), ey = cy - r * Math.sin(endAngle);
		const largeArc = fraction * sweep > 180 ? 1 : 0;
		return (
			`<svg viewBox="0 0 ${px} ${px}">` +
			`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#dedede" stroke-width="${STROKE}" />` +
			(fraction > 0.001
				? `<path d="M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ax} ${ay}" fill="none" stroke="#497100" stroke-width="${STROKE}" stroke-linecap="round" />`
				: '') +
			`<circle cx="${ax}" cy="${ay}" r="${STROKE / 1.4}" fill="#497100" />` +
			`<path d="M ${cx} ${cy} L ${sx + (ax - cx) * 0.0} ${sy}" stroke="none" />` +
			`<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(angle) * 0.75).toFixed(2)}" y2="${(cy - r * Math.sin(angle) * 0.75).toFixed(2)}" stroke="#0a0b0a" stroke-width="2" stroke-linecap="round" />` +
			`</svg>`
		);
		// eslint-disable-next-line no-unreachable
		void ex; void ey;
	});
</script>

<div class="box gap-xs xcenter {textsize} {className}">
	{#if label || showValue}
		<div class="row ycenter gap-sm">
			{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
			{#if showValue}<text class="text-xs text-secondary">{formatValue(value)}</text>{/if}
		</div>
	{/if}
	<div
		role="slider"
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-label={label ?? 'Dial'}
		class="pointer {disabled ? 'disabled' : ''}"
		style="width: {px}px; height: {px}px; background-color: transparent;"
		onmousedown={(e) => {
			dragging = true;
			lastY = e.y;
		}}
		onmousemove={(e) => {
			if (!dragging) return;
			byPixels(e.y - lastY);
			lastY = e.y;
		}}
		onmouseup={() => (dragging = false)}
		onmouseleave={() => (dragging = false)}
		hitbox="self"
	>
		<svg {source} style="width: {px}px; height: {px}px;" />
	</div>
</div>
