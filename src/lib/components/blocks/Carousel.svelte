<!-- @component A carousel of slides with next/prev arrows and indicator dots. Ported from ../fractalsvelte-ui blocks/Carousel.svelte — GPUI has no drag-to-scroll momentum, so navigation is the arrows and dots (set draggable={false}; drag support is the mouse move listeners, best-effort). -->
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import IconButton from '../actions/IconButton.svelte';
	import { klChevronLeft, klChevronRight } from '../../icons/keylinestroke.ts';
	import type { Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		/** One entry per slide, passed to the `slide` snippet. */
		items?: T[];
		slide?: Snippet<[T, number]>;
		/** Accessible name for the carousel region. */
		label?: string;
		index?: number;
		/** How many slides are visible at once. */
		perView?: number;
		/** Space between slides, in px. */
		gap?: number;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
	}

	let {
		items = [],
		slide,
		label = 'Carousel',
		index = $bindable(0),
		perView = 1,
		gap = 16,
		shape = 'modern',
		shadow,
		textsize = 'text-md',
		class: className = ''
	}: Props = $props();

	const maxIndex = $derived(Math.max(0, items.length - perView));
	const go = (d: number) => (index = Math.max(0, Math.min(maxIndex, index + d)));
</script>

<div class="box gap-sm wfull {textsize} {className}" aria-label={label} aria-roledescription="carousel">
	<div class="row ycenter gap-sm wfull">
		<IconButton iconVariant="ghost" label="Previous" size="h-md" disabled={index <= 0} onclick={() => go(-1)}>
			<Icon icon={klChevronLeft} />
		</IconButton>
		<div class="grow min0">
			<div class="row ytop" style="gap: {gap}px; overflow: hidden; width: 100%;">
				{#each items as item, i (i)}
					{#if i >= index && i < index + perView}
						<div class="grow min0" style="flex: 1 1 0;">
							{#if slide}{@render slide(item, i)}{:else}
								<div class="box xcenter ycenter state-hover modern" style="height: 120px; border-radius: 6px;">
									<text class="text-sm text-secondary">{i + 1}</text>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<IconButton iconVariant="ghost" label="Next" size="h-md" disabled={index >= maxIndex} onclick={() => go(1)}>
			<Icon icon={klChevronRight} />
		</IconButton>
	</div>
	{#if items.length > perView}
		<div class="row xcenter gap-xs">
			{#each Array.from({ length: maxIndex + 1 }, (_, i) => i) as i (i)}
				<div
					role="button"
					tabindex={0}
					class="pointer"
					style="width: {i === index ? 16 : 6}px; height: 6px; border-radius: 3px; background-color: {i === index ? 'var(--theme-color, #497100)' : 'var(--border, #dedede)'}; cursor: pointer;"
					onclick={() => (index = i)}
				></div>
			{/each}
		</div>
	{/if}
</div>
