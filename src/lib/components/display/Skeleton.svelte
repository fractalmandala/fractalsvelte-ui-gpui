<!-- @component Animated shimmer placeholder for loading states with line count, dimensions, and shape. Ported from ../fractalsvelte-ui display/Skeleton.svelte — GPUI has no pulse keyframes; the shimmer is the static state-selected block (accept `anim-pulse` differences). -->
<script lang="ts">
	import type { Shape } from '../../types.ts';

	interface Props {
		/** Width of the skeleton item, px or % ('100%'). */
		width?: string;
		/** Height of the skeleton item in px. */
		height?: number;
		/** Render as a circular avatar or icon placeholder. */
		circle?: boolean;
		/** Number of skeleton line blocks to stack. */
		lines?: number;
		shape?: Shape;
		class?: string;
	}

	let {
		width = '100%',
		height = 16,
		circle = false,
		lines = 1,
		shape = 'mincurved',
		class: className = ''
	}: Props = $props();

	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };
</script>

<div aria-hidden="true" class="box gap-xs wfull {className}">
	{#each { length: lines }, i (i)}
		<div
			class="state-selected {circle ? 'round' : shape}"
			style="width: {lines > 1 && i === lines - 1 && !circle ? '60%' : width}; height: {circle ? width : height}px; border-radius: {circle ? 999 : RADIUS[shape]}px;"
		></div>
	{/each}
</div>
