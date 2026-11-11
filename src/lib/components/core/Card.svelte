<!-- @component A content card with optional media, title, description, header and footer. Ported from ../fractalsvelte-ui core/Card.svelte — box-shadow prop accepted and ignored; card-title/card-desc come from the flat ports in components-gpui.css. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Size, Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		size?: Size;
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		/** Padding classes, e.g. `pad-lg` or `px-lg py-sm`. */
		padding?: string;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		title?: string;
		description?: string;
		textsize?: TextSize;
		class?: string;
		media?: Snippet;
		header?: Snippet;
		headerExtra?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shadow,
		padding = 'pad-lg',
		shape = 'curved',
		title,
		description,
		textsize = 'text-md',
		class: className = '',
		media,
		header,
		headerExtra,
		footer,
		children
	}: Props = $props();

	const classes = $derived(
		`card card-sized box gap-md ${size} ${shape} ${padding} ${surface} ${border} ${textsize} ${className}`
	);

	const hasHeader = $derived(Boolean(header || title || description || headerExtra));
</script>

<div class={classes}>
	{#if media}<div class="box overflow-hidden {shape}">{@render media()}</div>{/if}
	{#if hasHeader}
		{#if header}
			{@render header()}
		{:else}
			<div class="row ytop xbetween gap-sm">
				<div class="box gap-xs min0">
					{#if title}<text class="card-title">{title}</text>{/if}
					{#if description}<text class="card-desc text-secondary">{description}</text>{/if}
				</div>
				{#if headerExtra}<div class="row ycenter gap-xs shrink-0">{@render headerExtra()}</div>{/if}
			</div>
		{/if}
	{/if}
	{#if children}<div class="box gap-sm">{@render children()}</div>{/if}
	{#if footer}
		<div class="row ycenter gap-sm pt-sm bt-sub">{@render footer()}</div>
	{/if}
</div>
