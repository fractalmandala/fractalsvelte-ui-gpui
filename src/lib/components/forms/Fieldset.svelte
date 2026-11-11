<!-- @component HTML fieldset container with styled legend, borders, padding, and disabled cascade. Ported from ../fractalsvelte-ui forms/Fieldset.svelte — GPUI has no `<fieldset>`, so it renders a bordered box and the disabled flag is accepted for source compatibility (GPUI has no form cascade). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		legend?: string;
		disabled?: boolean;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Padding classes, e.g. `pad-md` or `px-lg py-sm`. */
		padding?: string;
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let {
		legend,
		disabled = false,
		surface = 'bg-surface',
		border = 'border',
		shape = 'modern',
		padding = 'pad-md',
		shadow,
		textsize = 'text-md',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="box gap-sm wfull {surface} {border} {shape} {padding} {shadow} {textsize} {className}">
	{#if legend}
		<text class="px-sm weight-500 text-xs text-secondary">{legend}</text>
	{/if}
	{@render children?.()}
</div>
