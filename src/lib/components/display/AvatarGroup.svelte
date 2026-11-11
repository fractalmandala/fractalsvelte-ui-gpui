<!-- @component A row or column of avatars, overlapping or spaced apart, with a "+N" chip for hidden members. Ported from ../fractalsvelte-ui display/AvatarGroup.svelte — the ring for overlapping avatars becomes a drawn border, and the overlap is a negative margin (GPUI margins accept px). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar, { type AvatarStatus, type AvatarShape } from './Avatar.svelte';
	import type { Size, Surface, TextSize } from '../../types.ts';

	/** Spacing between avatars, from overlapping, to touching, to increasing gaps. */
	export type AvatarGroupGap = 'overlap' | 'touch' | 'xs' | 'sm' | 'md' | 'lg';

	export interface AvatarItem {
		src?: string;
		initials?: string;
		alt?: string;
		status?: AvatarStatus;
	}

	interface Props {
		avatars?: AvatarItem[];
		/** Avatars shown before the rest collapse into "+N" */
		max?: number;
		/** Extra hidden members added to the "+N" count */
		excess?: number;
		size?: Size;
		shape?: AvatarShape;
		surface?: Surface;
		/** Spacing between avatars: `overlap` stacks them, `touch` sets them edge to edge, `xs`…`lg` add a growing gap. */
		gap?: AvatarGroupGap;
		/** Lay the avatars out in a row or a column. */
		direction?: 'horizontal' | 'vertical';
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
		overflowSnippet?: Snippet<[{ count: number }]>;
	}

	let {
		avatars = [],
		max = avatars.length,
		excess = 0,
		size = 'h-lg',
		shape = 'circle',
		surface = 'state-hover',
		gap = 'overlap',
		direction = 'horizontal',
		textsize = 'text-md',
		class: className = '',
		children,
		overflowSnippet
	}: Props = $props();

	const PX: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const px = $derived(PX[size]);
	const step = $derived(gap === 'overlap' ? -Math.round(px * 0.25) : gap === 'touch' ? 0 : gap === 'xs' ? 4 : gap === 'sm' ? 8 : gap === 'md' ? 12 : 24);
	const shown = $derived(avatars.slice(0, Math.max(0, max)));
	const hidden = $derived(Math.max(0, avatars.length - shown.length) + Math.max(0, excess));

	const CHIP_PX = $derived(Math.max(8, Math.round(px * 0.38) * 2));
</script>

<div class="row ycenter {direction === 'vertical' ? 'ytop' : ''} {className}" style="gap: 0px; flex-direction: {direction === 'vertical' ? 'column' : 'row'};">
	{#each shown as a, i (i)}
		<div style="margin-{direction === 'vertical' ? 'top' : 'left'}: {i === 0 ? 0 : step}px; position: relative; z-index: {shown.length - i}; display: flex;">
			<Avatar {...a} {size} {shape} {surface} {textsize} />
		</div>
	{/each}
	{#if hidden > 0}
		{#if overflowSnippet}
			<div style="margin-{direction === 'vertical' ? 'top' : 'left'}: {step}px;">{@render overflowSnippet({ count: hidden })}</div>
		{:else}
			<div
				class="row xcenter ycenter weight-600 {textsize}"
				style="margin-{direction === 'vertical' ? 'top' : 'left'}: {step}px; width: {CHIP_PX}px; height: {CHIP_PX}px; border-radius: {shape === 'circle' ? 999 : Math.round(CHIP_PX * 0.2)}px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06)); color: var(--text-secondary, #626462); z-index: 0;"
			>
				<text>+{hidden}</text>
			</div>
		{/if}
	{/if}
	{#if children}{@render children()}{/if}
</div>
