<!-- @component Polymorphic heading element with semantic level, text size scale, tracking, and weight. Ported from ../fractalsvelte-ui typography/Heading.svelte — GPUI has no heading tags and cannot letter-space, so every render is a `<text>` element and level 6 reads small, secondary and heavy instead of uppercase. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TextSize, Weight } from '../../types.ts';

	interface Props {
		/** Heading tag level (h1 through h6). Defaults to 2. */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		/** Visual size scale 1-6. When omitted, matches the level. */
		size?: 1 | 2 | 3 | 4 | 5 | 6;
		textsize?: TextSize;
		weight?: Weight;
		class?: string;
		children?: Snippet;
	}

	let { level = 2, size, textsize, weight, class: className = '', children }: Props = $props();

	const defaultSizeMap: Record<number, TextSize> = {
		1: 'text-4xl',
		2: 'text-3xl',
		3: 'text-2xl',
		4: 'text-xl',
		5: 'text-lg',
		6: 'text-md'
	};
	const defaultWeightMap: Record<number, Weight> = {
		1: 'weight-800',
		2: 'weight-700',
		3: 'weight-700',
		4: 'weight-600',
		5: 'weight-600',
		6: 'weight-500'
	};

	const visualLevel = $derived(size ?? level);
</script>

<text class="text-primary lh12 {textsize ?? defaultSizeMap[visualLevel]} {weight ?? defaultWeightMap[visualLevel]} {className}">
	{@render children?.()}
</text>
