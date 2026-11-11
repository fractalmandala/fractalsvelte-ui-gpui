<!-- @component A user image, or initials fallback, with optional status dot. Ported from ../fractalsvelte-ui display/Avatar.svelte — the SVG avatar becomes boxes: a `<img>` when there is a src (GPUI fetches paths and URLs), initials over a fill otherwise, and a drawn status dot pinned to the corner. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Size, Surface, TextSize } from '../../types.ts';

	export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';
	export type AvatarShape = 'circle' | 'rounded' | 'square';

	interface Props {
		src?: string;
		alt?: string;
		initials?: string;
		status?: AvatarStatus;
		/** Control height: sm 16 · md 20 · bs 27 · lg 32px */
		size?: Size;
		shape?: AvatarShape;
		/** Background behind initials or the placeholder */
		surface?: Surface;
		textsize?: TextSize;
		class?: string;
		/** Rendered beside the avatar when there is no image or initials. */
		fallback?: Snippet;
	}

	let {
		src,
		alt = 'Avatar',
		initials,
		status,
		size = 'h-lg',
		shape = 'circle',
		surface,
		textsize = 'text-md',
		class: className = '',
		fallback
	}: Props = $props();

	const PX: Record<Size, number> = { 'h-xs': 12, 'h-sm': 16, 'h-md': 20, 'h-bs': 27, 'h-lg': 32, 'h-xl': 40 };
	const px = $derived(PX[size]);
	const radius = $derived(shape === 'circle' ? 999 : shape === 'rounded' ? Math.round(px * 0.2) : 0);
	const STATUS_COLOR: Record<AvatarStatus, string> = {
		online: 'var(--success, #45a903)',
		busy: 'var(--danger, #ef0028)',
		away: 'var(--warning, #f7c900)',
		offline: 'var(--text-muted, #bcbfbc)'
	};
	const fill = $derived(surface ? `var(--${surface === 'bg-main' ? 'bg' : surface})` : 'var(--state-hover, rgba(0, 0, 0, 0.06))');
</script>

{#if !src && !initials && fallback}
	<div class={className}>{@render fallback()}</div>
{:else}
	<div
		role="img"
		aria-label={status ? `${alt} (${status})` : alt}
		class="row xcenter ycenter shrink-0 {textsize} {className}"
		style="position: relative; width: {px}px; height: {px}px; border-radius: {radius}px; background-color: {fill}; color: var(--text-secondary, #626462); overflow: hidden;"
	>
		{#if src}
			<img {src} {alt} style="width: 100%; height: 100%; object-fit: cover; border-radius: {radius}px;" />
		{:else if initials}
			<text class="weight-600 {surface ? 'text-primary' : ''}">{initials.slice(0, 2).toUpperCase()}</text>
		{:else}
			<text class="weight-600">{alt.slice(0, 1).toUpperCase()}</text>
		{/if}
		{#if status}
			<div
				style="position: absolute; {shape === 'circle' ? 'right: 0px; bottom: 0px;' : 'right: -2px; bottom: -2px;'} width: {Math.max(8, Math.round(px * 0.28))}px; height: {Math.max(8, Math.round(px * 0.28))}px; border-radius: 999px; background-color: {STATUS_COLOR[status]}; border: 2px solid var(--bg, #ffffff);"
			></div>
		{/if}
	</div>
{/if}
