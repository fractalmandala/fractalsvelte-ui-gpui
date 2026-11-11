<!-- @component An image, loaded by GPUI from a filesystem path, a data: URL or an http(s) URL. Ported from ../fractalsvelte-ui display/Img.svelte — give it both a width and a height (GPUI sizes images by their style box). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Size, Shape, TextSize } from '../../types.ts';

	interface Props {
		/** A filesystem path, a `data:` URL or an http(s) URL. */
		src?: string;
		alt?: string;
		width?: number | string;
		height?: number | string;
		shape?: Shape;
		/** GPUI's own object-fit vocabulary. */
		fit?: 'fill' | 'contain' | 'cover' | 'scaleDown' | 'none';
		/** Corner radius override in px. */
		radius?: number;
		textsize?: TextSize;
		class?: string;
		placeholder?: Snippet;
	}

	let {
		src,
		alt = '',
		width = '100%',
		height = 'auto',
		shape = 'modern',
		fit = 'cover',
		radius,
		textsize = 'text-md',
		class: className = '',
		placeholder
	}: Props = $props();

	const RADIUS: Record<Shape, number> = { rect: 0, mincurved: 3, modern: 6, curved: 12, round: 999 };
	const r = $derived(radius ?? RADIUS[shape]);
</script>

{#if src}
	<img {src} {alt} style="width: {width}; height: {height}; object-fit: {fit}; border-radius: {r}px;" class={className} />
{:else}
	<div
		class="row xcenter ycenter text-muted {textsize} {className}"
		style="width: {width}; height: {height}; border-radius: {r}px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));"
	>
		{#if placeholder}{@render placeholder()}{:else}
			<text>{alt || 'no image'}</text>
		{/if}
	</div>
{/if}
