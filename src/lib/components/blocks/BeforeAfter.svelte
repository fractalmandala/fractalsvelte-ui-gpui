<!-- @component A before/after comparison with a draggable divider. Ported from ../fractalsvelte-ui blocks/BeforeAfter.svelte — the clip-path reveal becomes two boxes: `before` fills from the left up to the divider (% width), `after` fills the rest. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Shape, TextSize } from '../../types.ts';

	interface Props {
		/** The 'before' content. */
		before?: Snippet;
		/** The 'after' content. */
		after?: Snippet;
		/** Divider position, 0–100 (%). */
		value?: number;
		disabled?: boolean;
		shape?: Shape;
		textsize?: TextSize;
		class?: string;
		labels?: { before?: string; after?: string };
	}

	let {
		before,
		after,
		value = $bindable(50),
		disabled = false,
		shape = 'modern',
		textsize = 'text-md',
		class: className = '',
		labels = {}
	}: Props = $props();

	let dragging = $state(false);
	let ox = $state(0);
	let width = $state(0);

	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };

	function fromPointer(px: number) {
		if (disabled) return;
		value = Math.max(0, Math.min(100, ((px - ox) / Math.max(1, width)) * 100));
	}

	function layout(e: { x: number; width: number }) {
		ox = e.x;
		width = e.width;
	}

	const split = $derived(Math.max(0, Math.min(100, value)));
</script>

<div
	class="{textsize} {className}"
	style="position: relative; width: 100%; height: 220px; border-radius: {RADIUS[shape]}px; overflow: hidden; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));"
	onlayout={layout}
	onclick={(e) => fromPointer(e.x)}
	onmousedown={(e) => {
		dragging = true;
		fromPointer(e.x);
	}}
	onmousemove={(e) => dragging && fromPointer(e.x)}
	onmouseup={() => (dragging = false)}
	onmouseleave={() => (dragging = false)}
	hitbox="self"
>
	{#snippet pane(snippet, atLeft)}
		<div style="position: absolute; top: 0; {atLeft ? 'left: 0' : 'right: 0'}; width: {atLeft ? split : 100 - split}%; height: 100%; overflow: hidden; display: flex; flex-direction: column; background-color: var(--bg-overlay, #ffffff);">
			{#if snippet}{@render snippet()}{/if}
			{#if atLeft && labels.before}
				<div class="text-xs weight-600" style="position: absolute; top: 8px; left: 8px; padding: 2px 8px; border-radius: 3px; background-color: rgba(0, 0, 0, 0.4);"><text class="text-xs weight-600 text-white">{labels.before}</text></div>
			{:else if !atLeft && labels.after}
				<div style="position: absolute; top: 8px; right: 8px; padding: 2px 8px; border-radius: 3px; background-color: rgba(0, 0, 0, 0.4);"><text class="text-xs weight-600 text-white">{labels.after}</text></div>
			{/if}
		</div>
	{/snippet}
	{@render pane(before, true)}
	{@render pane(after, false)}
	<!-- the divider -->
	<div style="position: absolute; top: 0; left: {split}%; width: 2px; height: 100%; background-color: var(--bg-overlay, #ffffff); pointer-events: none;"></div>
	<div style="position: absolute; top: 50%; left: {split}%; width: 28px; height: 28px; border-radius: 999px; background-color: var(--bg-overlay, #ffffff); border: 1px solid var(--border, #dedede); pointer-events: none; transform: translate(-50%, -50%);"></div>
</div>
