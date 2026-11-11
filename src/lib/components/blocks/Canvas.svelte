<!-- @component A framed drawing surface. Ported from ../fractalsvelte-ui blocks/Canvas.svelte — GPUI has no <canvas> element (native 0.11 registers none; a canvas paints nothing), so the frame renders and `draw` is unavailable: paint through `<svg source>`, `<code>`, `<markdown>` or an `<img>` fed by the window helper `set_image_pixels` instead. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Surface, Border, Shape, Shadow, Frame } from '../../types.ts';

	interface Props {
		/** Accepted for source compatibility with the DOM edition; GPUI cannot run a 2D context. */
		draw?: (ctx: unknown, size: { width: number; height: number }) => void;
		/** Aspect ratio, as one of the frame classes. */
		ratio?: Frame;
		label?: string;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		class?: string;
		children?: Snippet;
	}

	let { draw, ratio = 'frame-16-9', label, surface = 'bg-surface', border = 'border', shape = 'modern', shadow, class: className = '', children }: Props = $props();

	const RATIO: Record<Frame, number> = {
		'frame-16-9': 16 / 9,
		'frame-9-16': 9 / 16,
		'frame-4-3': 4 / 3,
		'frame-3-4': 3 / 4,
		'frame-3-2': 3 / 2,
		'frame-2-3': 2 / 3,
		'frame-1-1': 1
	};
</script>

<div
	role={label ? 'img' : undefined}
	aria-label={label}
	class="wfull {surface} {border} {shape} {className}"
>
	<div style="width: 100%; aspect-ratio: {RATIO[ratio]}; border-radius: 6px; overflow: hidden;">
		{@render children?.()}
	</div>
</div>
