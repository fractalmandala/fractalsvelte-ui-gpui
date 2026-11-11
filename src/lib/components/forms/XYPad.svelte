<!-- @component A two-axis pad for dragging a point in a rectangle, like a filter XY or morph position. Ported from ../fractalsvelte-ui forms/XYPad.svelte — the pad is a drawn box; the point sits at onlayout-measured coordinates, and dragging is mouseDown/mouseMove/mouseUp. -->
<script lang="ts">
	import type { Size, TextSize } from '../../types.ts';

	interface Props {
		/** 0–1 per axis; 0,0 is the bottom-left corner. */
		x?: number;
		y?: number;
		/** Snap the released point to a grid of 1/divisions per axis (0 = free). */
		divisions?: number;
		disabled?: boolean;
		size?: Size;
		/** Pad size in px. */
		length?: number;
		label?: string;
		textsize?: TextSize;
		onchchange?: (position: { x: number; y: number }) => void;
		class?: string;
	}

	let {
		x = $bindable(0.5),
		y = $bindable(0.5),
		divisions = 0,
		disabled = false,
		size = 'h-lg',
		length = 160,
		label,
		textsize = 'text-md',
		onchchange,
		class: className = ''
	}: Props = $props();

	let dragging = $state(false);
	let originX = $state(0);
	let originY = $state(0);
	let padLen = $state(160);

	const snap = (v: number) => (divisions > 0 ? Math.round(v * divisions) / divisions : v);

	function fromPointer(px: number, py: number) {
		if (disabled) return;
		const nx = snap(Math.max(0, Math.min(1, (px - originX) / Math.max(1, padLen))));
		const ny = snap(Math.max(0, Math.min(1, (originY + padLen - py) / Math.max(1, padLen))));
		x = nx;
		y = ny;
		onchchange?.({ x, y });
	}

	function layout(e: { x: number; y: number; width: number; height: number }) {
		originX = e.x;
		originY = e.y;
		padLen = e.width || padLen;
	}

	const pointAt = $derived(r + Math.max(0, Math.min(1, x)) * Math.max(0, padLen - r * 2));
	const pointY = $derived(r + (1 - Math.max(0, Math.min(1, y))) * Math.max(0, padLen - r * 2));
	const r = 9;
	const pad = $derived(length);
</script>

<div class="box gap-xs {textsize} {className}">
	{#if label}<text class="text-sm weight-500 text-secondary">{label}</text>{/if}
	<div
		class="pointer {disabled ? 'disabled' : ''}"
		style="position: relative; width: {pad}px; height: {pad}px; border-radius: 6px; background-color: var(--bg-input, #f2f2f2); border: 1px solid var(--border, #dedede); overflow: hidden;"
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
		<!-- the crosshair through the point -->
		<div style="position: absolute; left: {Math.round(pointAt)}px; top: 0; width: 1px; height: 100%; background-color: var(--border, #dedede);"></div>
		<div style="position: absolute; top: {Math.round(pointY)}px; left: 0; height: 1px; width: 100%; background-color: var(--border, #dedede);"></div>
		<!-- the point -->
		<div style="position: absolute; left: {Math.round(pointAt - r)}px; top: {Math.round(pointY - r)}px; width: {r * 2}px; height: {r * 2}px; border-radius: 999px; background-color: var(--theme-color, #497100); border: 2px solid var(--bg-overlay, #ffffff);"></div>
	</div>
</div>
