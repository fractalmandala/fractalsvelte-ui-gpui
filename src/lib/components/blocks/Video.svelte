<!-- @component Styled media card with title, caption, aspect ratio and tokenized frame. Ported from ../fractalsvelte-ui blocks/Video.svelte — GPUI has no video player (native 0.11 registers no such element), so the card shows the source through an `<img>` when it is an image/data URL and a framed placeholder otherwise. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klVideo } from '../../icons/keylinestroke.ts';
	import type { Surface, Border, Shape, Shadow, TextSize, Frame } from '../../types.ts';

	interface Props {
		/** Media file URL or filesystem path; images render, videos show a framed placeholder. */
		src?: string;
		poster?: string;
		title?: string;
		caption?: string;
		controls?: boolean;
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		/** Aspect ratio, as one of the frame classes. */
		ratio?: Frame;
		preload?: 'auto' | 'metadata' | 'none';
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		src,
		poster,
		title,
		caption,
		controls = true,
		autoplay = false,
		muted = false,
		loop = false,
		ratio = 'frame-16-9',
		preload,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		shadow,
		padding = 'pad-md',
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();

	// The frame classes set aspect ratios in CSS; GPUI has no aspect-ratio % mix,
	// so each frame maps to a pixel ratio at the card's width minus padding.
	const RATIO: Record<Frame, number> = {
		'frame-16-9': 16 / 9,
		'frame-9-16': 9 / 16,
		'frame-4-3': 4 / 3,
		'frame-3-4': 3 / 4,
		'frame-3-2': 3 / 2,
		'frame-2-3': 2 / 3,
		'frame-1-1': 1
	};
	const ratioN = $derived(RATIO[ratio]);
	const media = $derived(poster ?? src);
	const looksLikeImage = $derived(Boolean(media && /\.(png|jpe?g|gif|webp|bmp|svg|ico)$/i.test(media) || media?.startsWith('data:')));
</script>

<div class="box gap-sm {surface} {border} {shape} {padding} {textsize} {className}">
	{#if title}<text class="text-bs weight-600">{title}</text>{/if}
	<div class="relative wfull" style="position: relative; width: 100%;">
		<div style="width: 100%; aspect-ratio: {ratioN}; border-radius: 6px; overflow: hidden; background-color: var(--state-hover, rgba(0, 0, 0, 0.06)); display: flex; align-items: center; justify-content: center;">
			{#if looksLikeImage && media}
				<img src={media} alt={title ?? 'Media'} style="width: 100%; height: 100%; object-fit: cover;" />
			{:else}
				<div class="row ycenter gap-sm text-muted">
					<Icon icon={klVideo} />
					<text class="text-sm text-muted">{src ? src.split('/').pop() : 'No source'}</text>
				</div>
			{/if}
			{#if controls && !looksLikeImage}
				<div style="position: absolute; right: 8px; bottom: 8px; width: 28px; height: 28px; border-radius: 999px; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;">
					<Icon icon={klVideo} size={14} class="text-white" />
				</div>
			{/if}
		</div>
	</div>
	{#if caption}<text class="text-sm text-secondary lh15">{caption}</text>{/if}
	{#if children}{@render children()}{/if}
</div>
