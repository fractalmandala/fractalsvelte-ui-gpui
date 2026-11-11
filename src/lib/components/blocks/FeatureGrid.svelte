<!-- @component A grid of icon-led feature blurbs. Ported from ../fractalsvelte-ui blocks/FeatureGrid.svelte — the 2-column responsive grid collapses to the canonical desktop row (3 tracks); on narrow windows pass cols={2}. -->
<script lang="ts" module>
	import type { IconNode } from '../../icons/types.ts';
	export interface Feature {
		title: string;
		description: string;
		icon?: IconNode;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import type { Space, TextSize } from '../../types.ts';

	interface Props {
		features?: Feature[];
		cols?: 1 | 2 | 3 | 4;
		gap?: Space;
		textsize?: TextSize;
		class?: string;
	}

	let { features = [], cols = 3, gap = 'bs', textsize = 'text-md', class: className = '' }: Props = $props();
</script>

<div class="{textsize} {className}" style="display: grid; grid-template-columns: {cols}; gap: var(--space-{gap}, 16px);">
	{#each features as f, i (i)}
		<div class="box gap-xs">
			{#if f.icon}
				<div class="row ycenter text-theme" aria-hidden="true"><Icon icon={f.icon} /></div>
			{/if}
			<text class="weight-600">{f.title}</text>
			<text class="text-sm text-secondary lh15">{f.description}</text>
		</div>
	{/each}
</div>
