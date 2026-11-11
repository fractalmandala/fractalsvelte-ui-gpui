<!-- @component A card that acts as a button. Ported from ../fractalsvelte-ui layout/ClickableCard.svelte — no href form (GPUI has no links); `.card-clickable` strengthens the border on hover, and `.link-parent`'s theme-coloured title on hover is dropped with it. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Size, Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		disabled?: boolean;
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
		onclick?: (event: MouseEvent) => void;
		media?: Snippet;
		header?: Snippet;
		headerExtra?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		disabled = false,
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
		onclick,
		media,
		header,
		headerExtra,
		footer,
		children
	}: Props = $props();

	const hasHeader = $derived(Boolean(header || title || description || headerExtra));
	const shell = $derived(
		`card card-sized card-clickable box xleft ytop gap-md ta-l wfull ${size} ${shape} ${padding} ${surface} ${border} ${disabled ? 'disabled' : ''} ${textsize} ${className}`
	);
</script>

<div
	onclick={disabled ? undefined : onclick}
	class={shell}
	hitbox="self"
>
	{#if media}<div class="box wfull overflow-hidden {shape}">{@render media()}</div>{/if}
	{#if hasHeader}
		{#if header}
			{@render header()}
		{:else}
			<div class="row ytop xbetween gap-sm wfull">
				<div class="box gap-xs min0">
					{#if title}<text class="card-title">{title}</text>{/if}
					{#if description}<text class="card-desc text-secondary">{description}</text>{/if}
				</div>
				{#if headerExtra}<div class="row ycenter gap-xs shrink-0">{@render headerExtra()}</div>{/if}
			</div>
		{/if}
	{/if}
	{#if children}<div class="box gap-sm wfull">{@render children()}</div>{/if}
	{#if footer}
		<div class="row ycenter gap-sm pt-sm bt-sub wfull">{@render footer()}</div>
	{/if}
</div>
