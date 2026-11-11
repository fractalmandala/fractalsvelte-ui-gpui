<!-- @component Two panes side by side or stacked, where either can be collapsed by dragging the divider. Ported from ../fractalsvelte-ui layout/SplitPane.svelte — the canonical snap states (both open / one collapsed) drive off mouse drag distance; keyboard roving is dropped. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klGripVertical, klGripHorizontal } from '../../icons/keylinestroke.ts';
	import type { Surface, Border, Shape, Shadow } from '../../types.ts';

	/**
	 * Which pane is collapsed. GPUI's margins make free percentages awkward, so
	 * the split snaps between three states instead: both panes sharing the
	 * space, or one of them collapsed.
	 */
	export type SplitCollapse = 'a' | 'b' | null;

	interface Props {
		/** `horizontal` puts the panes side by side; `vertical` stacks them. */
		direction?: 'horizontal' | 'vertical';
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		collapsed?: SplitCollapse;
		/** Drag distance in px that snaps a pane closed */
		snapDistance?: number;
		class?: string;
		paneA?: Snippet;
		paneB?: Snippet;
	}

	let {
		direction = 'horizontal',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow,
		collapsed = $bindable(null),
		snapDistance = 48,
		class: className = '',
		paneA,
		paneB
	}: Props = $props();

	const horizontal = $derived(direction === 'horizontal');
	let start: number | null = null;

	function shift(drag: number) {
		if (drag < 0) collapsed = collapsed === 'b' ? null : 'a';
		else collapsed = collapsed === 'a' ? null : 'b';
	}

	function dragMove(e: { x: number; y: number }) {
		if (start === null) return;
		const delta = (horizontal ? e.x : e.y) - start;
		if (Math.abs(delta) >= snapDistance) {
			shift(delta);
			start = horizontal ? e.x : e.y;
		}
	}
</script>

<div class="{horizontal ? 'row' : 'box'} {border} {shape} {className}" style="width: 100%; height: 100%; overflow: hidden;">
	{#if collapsed !== 'a'}
		<div class="box {surface} min0" style="flex: 1 1 0; overflow: hidden;">
			{@render paneA?.()}
		</div>
	{/if}
	<div
		role="separator"
		aria-orientation={horizontal ? 'vertical' : 'horizontal'}
		class="row xcenter ycenter shrink-0 pointer"
		style="{horizontal ? 'width: 10px' : 'height: 10px; width: 100%'}; display: flex; align-items: center; justify-content: center; cursor: grab; background-color: var(--border-subtle, #eeeeee);"
		onmousedown={(e) => {
			start = horizontal ? e.x : e.y;
		}}
		onmousemove={(e) => dragMove(e)}
		onmouseup={() => (start = null)}
		onmouseleave={() => (start = null)}
	>
		<Icon icon={horizontal ? klGripVertical : klGripHorizontal} size={12} class="text-muted" />
	</div>
	{#if collapsed !== 'b'}
		<div class="box {surface} min0" style="flex: 1 1 0; overflow: hidden;">
			{@render paneB?.()}
		</div>
	{/if}
</div>
