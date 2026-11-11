<!-- @component A dismiss button with an X icon for closing panels, dialogs and dismissible items. Ported from ../fractalsvelte-ui actions/CloseButton.svelte. -->
<script lang="ts">
	import type { Variant, Size, Shape, Shadow } from '../../types.ts';
	import IconButton from './IconButton.svelte';
	import Icon from '../core/Icon.svelte';
	import { klX } from '../../icons/keylinestroke.ts';

	interface Props {
		label?: string;
		/** Visual style variant for close button. */
		iconVariant?: Variant;
		/** Alias for iconVariant */
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		shadow?: Shadow;
		onclick?: (e: MouseEvent) => void;
		class?: string;
	}

	let {
		label = 'Close',
		iconVariant,
		variant,
		size = 'h-md',
		shape = 'modern',
		shadow,
		onclick,
		class: className = ''
	}: Props = $props();

	const currentVariant = $derived(iconVariant ?? variant ?? 'ghost');
</script>

<IconButton {label} iconVariant={currentVariant} {size} {shape} {shadow} {onclick} class={className}>
	<Icon icon={klX} />
</IconButton>
