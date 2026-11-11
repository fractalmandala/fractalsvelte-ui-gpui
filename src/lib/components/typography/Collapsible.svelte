<!-- @component A single section that expands and collapses under a header. Ported from ../fractalsvelte-ui typography/Collapsible.svelte — the 0fr→1fr grid collapse has no GPUI equivalent, so the body mounts and unmounts with {#if}; the motion prop could animate the height. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klChevronDown, klChevronUp } from '../../icons/keylinestroke.ts';
	import type { Variant, Size, Surface, Border, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		open?: boolean;
		disabled?: boolean;
		title?: string;
		/** Trigger paint */
		variant?: Variant;
		/** Trigger height */
		size?: Size;
		surface?: Surface;
		border?: Border;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		textsize?: TextSize;
		class?: string;
		header?: Snippet<[{ isOpen: boolean; toggle: () => void }]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		disabled = false,
		title = '',
		variant = 'ghost',
		size = 'h-lg',
		surface = 'bg-panel',
		border = 'border',
		shape = 'curved',
		shadow,
		textsize = 'text-md',
		class: className = '',
		header,
		children
	}: Props = $props();

	const uid = $props.id();
	const toggle = () => !disabled && (open = !open);
</script>

<div class="box wfull {surface} {border} {shape} {textsize} {className}">
	{#if header}
		{@render header({ isOpen: open, toggle })}
	{:else}
		<button
			class="row xbetween ycenter wfull gap-sm px-md weight-500 {variant} {size} {shape} {disabled ? 'text-muted' : ''}"
			aria-expanded={open}
			aria-controls="{uid}-content"
			{disabled}
			onclick={toggle}
		>
			<text>{title}</text>
			<Icon icon={open ? klChevronUp : klChevronDown} class="text-muted shrink-0" />
		</button>
	{/if}
	{#if open}
		<div id="{uid}-content">
			{@render children?.()}
		</div>
	{/if}
</div>
