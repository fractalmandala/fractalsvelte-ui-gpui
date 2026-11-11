<!-- @component A gauge bar for a value in a known range, coloured by low, high and optimum zones. Ported from ../fractalsvelte-ui display/Meter.svelte — the SVG track becomes drawn boxes (as in Progress); zone colouring computes in JS since GPUI cannot. -->
<script lang="ts">
	import type { Size, MessageText, TextSize } from '../../types.ts';

	export type MeterZone = 'optimum' | 'sub-optimum' | 'critical';

	interface Props {
		value: number;
		min?: number;
		max?: number;
		low?: number;
		high?: number;
		optimum?: number;
		label?: string;
		showValue?: boolean;
		size?: Size;
		/** Bar colour. Unset, it follows the zone: success, warning or danger. */
		tone?: MessageText;
		direction?: 'horizontal' | 'vertical';
		formatValue?: (val: number) => string;
		textsize?: TextSize;
		class?: string;
	}

	let {
		value,
		min = 0,
		max = 100,
		low,
		high,
		optimum,
		label,
		showValue = false,
		size = 'h-md',
		tone,
		direction = 'horizontal',
		formatValue = (val: number) => String(val),
		textsize = 'text-md',
		class: className = ''
	}: Props = $props();

	const fraction = $derived(Math.min(1, Math.max(0, (value - min) / Math.max(1e-6, max - min))));
	const zone = $derived.by<MeterZone>(() => {
		if (low !== undefined && value < low) return 'critical';
		if (high !== undefined && value > high) return 'critical';
		const mid = optimum ?? (low !== undefined && high !== undefined ? (low + high) / 2 : (min + max) / 2);
		const dist = Math.abs(value - mid) / Math.max(1e-6, max - min);
		if (dist <= 0.15) return 'optimum';
		if (dist <= 0.35) return 'sub-optimum';
		return 'critical';
	});
	const ink = $derived(tone ?? { optimum: 'text-success', 'sub-optimum': 'text-warning', critical: 'text-danger' }[zone]);

	const THICK: Record<Size, number> = { 'h-xs': 3, 'h-sm': 4, 'h-md': 6, 'h-bs': 8, 'h-lg': 12, 'h-xl': 16 };
	const thick = $derived(THICK[size]);
	const vertical = $derived(direction === 'vertical');

	const trackStyle = $derived(vertical ? `width: ${thick}px; height: 160px;` : `width: 100%; height: ${thick}px;`);
	const fillStyle = $derived(vertical ? `width: 100%; height: ${Math.round(fraction * 100)}%; align-self: flex-end;` : `width: ${Math.round(fraction * 100)}%; height: 100%;`);
</script>

<div role="meter" aria-valuenow={Math.round(fraction * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label} class="box gap-xs {vertical ? 'xcenter' : ''} {textsize} {className}">
	{#if label || showValue}
		<div class="{vertical ? 'box xcenter' : 'row ycenter xbetween'} gap-sm">
			{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
			{#if showValue}<text class="text-sm text-muted {ink}">{formatValue(value)}</text>{/if}
		</div>
	{/if}
	<div class="{ink} fsui-track" style="opacity: 0.15; {trackStyle}">
		<div class="{ink}" style="opacity: 1; {fillStyle}"></div>
	</div>
</div>
