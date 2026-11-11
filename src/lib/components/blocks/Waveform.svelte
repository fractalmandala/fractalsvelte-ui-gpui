<!-- @component An interactive audio waveform visualizer and scrubber with progress fill and seek support. Ported from ../fractalsvelte-ui blocks/Waveform.svelte — the SVG bars become drawn boxes; seeking measures the container with onlayout. -->
<script lang="ts">
	import type { Size, Surface, Border, Shape, Shadow, TextSize, Variant, Message } from '../../types.ts';

	interface Props {
		/** Bar heights from 0 to 1, one per bar. */
		peaks?: number[];
		/** Played portion, 0–100. */
		progress?: number;
		duration?: number;
		barWidth?: number;
		barGap?: number;
		/** Lets the user click or drag to seek, which fires `onseek`. */
		interactive?: boolean;
		variant?: Variant | Message;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
		onseek?: (progress: number) => void;
	}

	// Default representative audio waveform peaks
	const defaultPeaks = [
		0.2, 0.35, 0.6, 0.45, 0.8, 0.95, 0.7, 0.5, 0.65, 0.85, 0.4, 0.3, 0.55, 0.75, 0.9, 0.6, 0.45, 0.7, 0.8, 0.5,
		0.35, 0.6, 0.85, 0.95, 0.65, 0.4, 0.55, 0.7, 0.9, 0.75, 0.5, 0.35, 0.6, 0.7, 0.85, 0.65, 0.45, 0.3, 0.5, 0.25
	];

	let {
		peaks = defaultPeaks,
		progress = $bindable(35),
		duration,
		barWidth = 4,
		barGap = 2,
		interactive = true,
		variant = 'primary',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow,
		textsize = 'text-md',
		class: className = '',
		onseek
	}: Props = $props();

	let width = $state(0);
	let ox = $state(0);
	let dragging = $state(false);

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}

	function seek(px: number) {
		if (!interactive || width <= 0) return;
		progress = Math.max(0, Math.min(100, (px / width) * 100));
		onseek?.(progress);
	}

	function layout(e: { x: number; width: number }) {
		width = e.width;
		ox = e.x;
	}

	const ink = $derived(variant === 'primary' ? 'bg-button' : variant === 'secondary' ? 'bg-button-secondary' : `bg-${variant === 'themed' ? 'theme' : variant}`);

	const played = $derived((Math.max(0, Math.min(100, progress)) / 100) * width);
</script>

<div class="box gap-xs wfull {surface} {border} {shape} {textsize} {className}">
	<div
		class="relative pointer {interactive ? '' : ''}"
		style="position: relative; height: 48px; background-color: transparent; display: flex; align-items: center;"
		onlayout={layout}
		onclick={(e) => seek(e.x - ox)}
		onmousedown={(e) => {
			if (!interactive) return;
			dragging = true;
			seek(e.x - ox);
		}}
		onmousemove={(e) => dragging && seek(e.x - ox)}
		onmouseup={() => (dragging = false)}
		hitbox="self"
	>
		<div class="row ycenter" style="display: flex; align-items: center; width: 100%; height: 100%; gap: {barGap}px;">
			{#each peaks as peak, i (i)}
				{@const barLeft = i * (barWidth + barGap)}
				{@const playedHere = barLeft + barWidth / 2 <= played}
				<div
					class="{playedHere ? 'bg-theme' : 'state-hover'}"
					style="width: {barWidth}px; height: {Math.max(3, Math.round(peak * 44))}px; border-radius: {barWidth / 2}px;"
				></div>
			{/each}
		</div>
	</div>
	{#if duration !== undefined}
		<div class="row ycenter xbetween text-xs text-muted">
			<text class="text-xs text-muted">{formatTime((Math.max(0, Math.min(100, progress)) / 100) * duration)}</text>
			<text class="text-xs text-muted">{formatTime(duration)}</text>
		</div>
	{/if}
</div>
