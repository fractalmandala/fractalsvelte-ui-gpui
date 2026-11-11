<!-- @component Zero-state placeholder illustration with title, description, and action button slot. Ported from ../fractalsvelte-ui blocks/EmptyState.svelte — the icon tile is a drawn circle. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klInbox } from '../../icons/keylinestroke.ts';
	import type { Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		title?: string;
		description?: string;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		/** Padding classes, e.g. `pad-xl` or `px-lg py-sm`. */
		padding?: string;
		textsize?: TextSize;
		icon?: Snippet;
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		title = 'No items',
		description,
		surface = 'bg-surface',
		border = 'border-dashed',
		shape = 'modern',
		shadow,
		padding = 'pad-xl',
		textsize = 'text-md',
		icon,
		actions,
		children,
		class: className = ''
	}: Props = $props();
</script>

<div class="box xcenter ycenter gap-md wfull {surface} {border} {shape} {padding} {textsize} {className}">
	<div
		aria-hidden="true"
		style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background-color: var(--state-hover, rgba(0, 0, 0, 0.06));"
	>
		{#if icon}
			{@render icon()}
		{:else}
			<Icon icon={klInbox} class="text-theme" />
		{/if}
	</div>
	{#if title}<text class="text-lg weight-600">{title}</text>{/if}
	{#if description}<text class="text-sm text-secondary lh15" style="text-align: center;">{description}</text>{/if}
	{#if children}{@render children()}{/if}
	{#if actions}<div class="row ycenter gap-xs wrap">{@render actions()}</div>{/if}
</div>
