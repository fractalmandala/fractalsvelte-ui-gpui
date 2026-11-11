<!-- @component A corner ribbon banner for cards and containers, with bookmark styling and variant themes. Ported from ../fractalsvelte-ui display/Ribbon.svelte — clip-path is unsupported, so `bookmark` is a no-op (accepted and ignored); the tint is the message fill at low opacity. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Variant, Message } from '../../types.ts';

	export type RibbonPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

	interface Props {
		/** Which corner of its positioned parent the ribbon sits on. */
		position?: RibbonPosition;
		variant?: Variant | Message;
		/** Unportable in GPUI (no clip-path); accepted and ignored. */
		bookmark?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { position = 'top-right', variant = 'primary', bookmark, class: className = '', children }: Props = $props();

	const isMessage = $derived(['info', 'success', 'warning', 'danger'].includes(variant));
	const bg = $derived(
		isMessage
			? `var(--${variant}-00, var(--bg-panel, #ebebeb))`
			: variant === 'themed'
				? 'var(--theme-color, #497100)'
				: variant === 'primary'
					? 'var(--bg-button, #151615)'
					: variant === 'secondary'
						? 'var(--bg-button-secondary, #e7e8e7)'
						: 'transparent'
	);
	const ink = $derived(isMessage ? `text-${variant}` : variant === 'themed' || variant === 'primary' ? 'text-inverse' : 'text-primary');
</script>

<div
	class="inline-flex row xcenter ycenter px-sm mincurved text-xs weight-700 {className}"
	style="position: absolute; {position === 'top-right'
		? 'top: 8px; right: -4px'
		: position === 'top-left'
			? 'top: 8px; left: -4px'
			: position === 'bottom-right'
				? 'bottom: 8px; right: -4px'
				: 'bottom: 8px; left: -4px'}; padding: 2px 8px; border-radius: 3px; background-color: {bg};"
>
	<text class="{ink} text-xs weight-700">{@render children?.()}</text>
</div>
