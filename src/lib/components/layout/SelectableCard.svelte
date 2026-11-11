<!-- @component A card that works as a checkbox or radio option. Ported from ../fractalsvelte-ui layout/SelectableCard.svelte — the check/radio mark is the same svg source trick the Icon uses; state is owned by the caller (selected + onchange). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Size, Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	export type SelectableCardType = 'checkbox' | 'radio';
	export type IndicatorPosition = 'right' | 'left';

	interface Props {
		selected?: boolean;
		type?: SelectableCardType;
		disabled?: boolean;
		value?: string;
		name?: string;
		indicatorPosition?: IndicatorPosition;
		size?: Size;
		surface?: Surface;
		/** Border when not selected; selected cards always use border-strong. */
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		/** Card corners; cards take no pill shape. */
		shape?: Exclude<Shape, 'round'>;
		title?: string;
		description?: string;
		textsize?: TextSize;
		class?: string;
		onchange?: (selected: boolean) => void;
		indicator?: Snippet;
		children?: Snippet;
	}

	let {
		selected = $bindable(false),
		type = 'checkbox',
		disabled = false,
		value,
		name,
		indicatorPosition = 'right',
		size = 'h-md',
		surface = 'bg-panel',
		border = 'border',
		shadow,
		padding = 'pad-md',
		shape = 'curved',
		title,
		description,
		textsize = 'text-md',
		class: className = '',
		onchange,
		indicator,
		children
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		selected = type === 'radio' ? true : !selected;
		onchange?.(selected);
	}
</script>

{#snippet mark()}
	<div class="row ycenter shrink-0 text-lg {selected ? 'text-theme' : 'text-muted'}" aria-hidden="true">
		{#if indicator}
			{@render indicator()}
		{:else}
			{#if type === 'radio'}
				<svg
					source={`<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5" />${selected ? '<circle cx="10" cy="10" r="4.5" fill="currentColor" />' : ''}</svg>`}
					style="width: 18px; height: 18px;"
				/>
			{:else}
				<svg
					source={`<svg viewBox="0 0 20 20"><rect x="1.5" y="1.5" width="17" height="17" rx="4" fill="${selected ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" />${selected ? '<polyline points="5.5 10.5 8.5 13.5 14.5 7" fill="none" stroke="var(--bg-overlay, #ffffff)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' : ''}</svg>`}
					style="width: 18px; height: 18px;"
				/>
			{/if}
		{/if}
	</div>
{/snippet}

<div
	role={type}
	aria-checked={selected}
	aria-disabled={disabled || undefined}
	tabindex={disabled ? undefined : 0}
	data-value={value}
	data-name={name}
	onclick={toggle}
	class="card card-sized card-clickable row ytop gap-sm {size} {shape} {padding} {surface} {selected ? 'border-strong' : border} {disabled ? 'disabled text-muted' : ''} {textsize} {className}"
	hitbox="self"
>
	{#if indicatorPosition === 'left'}{@render mark()}{/if}
	<div class="box gap-xs grow min0">
		{#if title}<text class="weight-600 {disabled ? 'text-muted' : 'text-primary'}">{title}</text>{/if}
		{#if description}<text class="text-sm text-secondary lh15">{description}</text>{/if}
		{#if children}{@render children()}{/if}
	</div>
	{#if indicatorPosition === 'right'}{@render mark()}{/if}
</div>
