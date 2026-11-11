<!-- @component A pannable, zoomable grid canvas for node diagrams. Ported from ../fractalsvelte-ui blocks/FlowCanvas.svelte — the grid background is drawn lines at the current zoom (GPUI cannot pattern-tile, so the grid lives inside a clipped svg source); panning drags the content plane, zoom buttons step it. -->
<script lang="ts">
	import type { TextSize, Shape } from '../../types.ts';
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klMinus, klPlus, klRotateCcw } from '../../icons/keylinestroke.ts';
	import IconButton from '../actions/IconButton.svelte';

	interface Props {
		gridType?: 'dots' | 'lines' | 'crosses';
		/** Grid pitch in canvas px at zoom 1 */
		gridSize?: number;
		zoom?: number;
		panX?: number;
		panY?: number;
		minZoom?: number;
		maxZoom?: number;
		interactive?: boolean;
		/** Box shape (width / height) */
		ratio?: '16/9' | '9/16' | '4/3' | '3/4' | '3/2' | '2/3' | '1/1';
		/** Size of the content plane, in canvas px */
		planeWidth?: number;
		planeHeight?: number;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		/** Snippet drawn over the canvas, such as zoom buttons. */
		controls?: Snippet;
	}

	let {
		gridType = 'dots',
		gridSize = 24,
		zoom = $bindable(1),
		panX = $bindable(0),
		panY = $bindable(0),
		minZoom = 0.2,
		maxZoom = 2.5,
		interactive = true,
		ratio = '16/9',
		planeWidth = 1600,
		planeHeight = 1000,
		shape = 'modern',
		textsize = 'text-md',
		class: className = '',
		children,
		controls
	}: Props = $props();

	const RATIO: Record<string, number> = { '16/9': 16 / 9, '9/16': 9 / 16, '4/3': 4 / 3, '3/4': 3 / 4, '3/2': 3 / 2, '2/3': 2 / 3, '1/1': 1 };

	let dragging = $state(false);
	let lastX = 0;
	let lastY = 0;
	let frameW = $state(560);

	function layout(e: { width: number }) {
		frameW = e.width || frameW;
	}

	const frameH = $derived(frameW / RATIO[ratio]);

	function panBy(dx: number, dy: number) {
		if (!interactive) return;
		panX += dx;
		panY += dy;
	}

	function stepZoom(d: number) {
		if (!interactive) return;
		zoom = Math.max(minZoom, Math.min(maxZoom, zoom + d));
	}

	function reset() {
		if (!interactive) return;
		zoom = 1;
		panX = 0;
		panY = 0;
	}

	// The grid draws inside an svg the size of the visible frame, translated by
	// the pan and scaled by the zoom.
	const gridSource = $derived.by(() => {
		const pitch = gridSize * zoom;
		const offX = panX % pitch;
		const offY = panY % pitch;
		const parts: string[] = [];
		if (gridType === 'dots') {
			for (let gx = offX; gx < frameW + pitch; gx += pitch)
				for (let gy = offY; gy < frameH + pitch; gy += pitch)
					parts.push(`<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="1" fill="var(--border-strong, #aeaeae)" />`);
		} else {
			for (let gx = offX; gx < frameW + pitch; gx += pitch)
				parts.push(`<line x1="${gx.toFixed(1)}" y1="0" x2="${gx.toFixed(1)}" y2="${frameH.toFixed(1)}" stroke="var(--border, #dedede)" stroke-width="1" />`);
			for (let gy = offY; gy < frameH + pitch; gy += pitch)
				parts.push(`<line x1="0" y1="${gy.toFixed(1)}" x2="${frameW.toFixed(1)}" y2="${gy.toFixed(1)}" stroke="var(--border, #dedede)" stroke-width="1" />`);
		}
		return `<svg viewBox="0 0 ${frameW} ${frameH}">${parts.join('')}</svg>`;
	});
</script>

<div class="box gap-xs {textsize} {className}">
	<div
		class="{shape}"
		style="position: relative; width: 100%; height: {Math.round(frameH)}px; border-radius: 6px; overflow: hidden; background-color: var(--bg, #ffffff); border: 1px solid var(--border, #dedede);"
		onlayout={layout}
		onmousedown={(e) => {
			dragging = true;
			lastX = e.x;
			lastY = e.y;
		}}
		onmousemove={(e) => {
			if (!dragging) return;
			panBy(e.x - lastX, e.y - lastY);
			lastX = e.x;
			lastY = e.y;
		}}
		onmouseup={() => (dragging = false)}
		onmouseleave={() => (dragging = false)}
		hitbox="self"
	>
		<div class="absolute" style="position: absolute; inset: 0; pointer-events: none;">
			<svg {gridSource} style="width: {Math.round(frameW)}px; height: {Math.round(frameH)}px;" />
		</div>
		<!-- the content plane -->
		<div
			class="absolute"
			style="position: absolute; left: {panX}px; top: {panY}px; width: {Math.round(planeWidth * zoom)}px; height: {Math.round(planeHeight * zoom)}px; pointer-events: auto;"
		>
			{#if children}{@render children()}{/if}
		</div>
		<!-- controls -->
		<div class="absolute row gap-xs" style="position: absolute; right: 8px; bottom: 8px; display: flex; gap: 4px;">
			{#if controls}
				{@render controls()}
			{:else}
				<IconButton iconVariant="secondary" size="h-sm" label="Zoom out" onclick={() => stepZoom(-0.2)}><Icon icon={klMinus} size={14} /></IconButton>
				<IconButton iconVariant="secondary" size="h-sm" label="Reset view" onclick={reset}><Icon icon={klRotateCcw} size={14} /></IconButton>
				<IconButton iconVariant="secondary" size="h-sm" label="Zoom in" onclick={() => stepZoom(0.2)}><Icon icon={klPlus} size={14} /></IconButton>
			{/if}
		</div>
	</div>
	<text class="text-xs text-muted">zoom {zoom.toFixed(1)}× · pan {Math.round(panX)}, {Math.round(panY)}</text>
</div>
