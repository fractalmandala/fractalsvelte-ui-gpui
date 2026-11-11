<!-- @component A progress bar, determinate or indeterminate, with optional value label. Ported from ../fractalsvelte-ui display/Progress.svelte — the SVG track becomes two boxes; GPUI takes % on width, so the fill needs no measuring. -->
<script lang="ts">
	import type { Size, MessageText, TextSize } from '../../types.ts';

	interface Props {
		value?: number;
		max?: number;
		size?: Size;
		/** Bar colour. Unset, it uses the theme colour (text-theme). */
		tone?: MessageText;
		direction?: 'horizontal' | 'vertical';
		indeterminate?: boolean;
		showValue?: boolean;
		label?: string;
		textsize?: TextSize;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 'h-md',
		tone,
		direction = 'horizontal',
		indeterminate = false,
		showValue = false,
		label,
		textsize = 'text-md',
		class: className = ''
	}: Props = $props();

	const fraction = $derived(indeterminate ? 0 : Math.min(1, Math.max(0, value / (max || 100))));

	// The canonical track is an SVG whose thickness rides em; here it rides the
	// text size in px, and the ink rides the tone text classes.
	const THICK: Record<Size, number> = {
		'h-xs': 3, 'h-sm': 4, 'h-md': 6, 'h-bs': 8, 'h-lg': 12, 'h-xl': 16
	};
	const thick = $derived(THICK[size]);
	const vertical = $derived(direction === 'vertical');
	const fill = $derived(indeterminate ? 30 : fraction * 100);
	const ink = $derived(tone ? tone.replace('text-', 'bg-') : 'bg-theme');

	const trackStyle = $derived(
		vertical
			? `width: ${thick}px; height: 160px;`
			: `width: 100%; height: ${thick}px;`
	);
	const fillStyle = $derived(
		vertical
			? `width: 100%; height: ${fill}%; align-self: flex-end;`
			: `width: ${fill}%; height: 100%;`
	);
</script>

<div class="box gap-xs {vertical ? 'xcenter' : ''} {textsize} {className}">
	{#if label || (showValue && !indeterminate)}
		<div class="{vertical ? 'box xcenter' : 'row ycenter xbetween'} gap-sm">
			{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
			{#if showValue && !indeterminate}
				<text class="text-sm text-muted">{Math.round(fraction * 100)}%</text>
			{/if}
		</div>
	{/if}
	<div role="progressbar" aria-valuenow={indeterminate ? undefined : Math.round(fraction * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label} class="{ink} fsui-track {vertical ? 'row' : ''}" style="opacity: 0.15; {trackStyle}">
		<div class="{ink}" style="opacity: 1; {fillStyle}"></div>
	</div>
</div>
