<!-- @component A button (a GPUI button: role button, tab stop, Enter and Space click it). Ported from ../fractalsvelte-ui core/Button.svelte — no href form, since GPUI has no links; disabled is a class, since GPUI has no :disabled. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Variant, Size, Shape, Shadow, TextSize } from '../../types.ts';

	interface Props {
		variant?: Variant;
		size?: Size;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); kept for source compatibility and ignored. */
		shadow?: Shadow;
		/** Defaults to the text size that suits `size`. */
		textsize?: TextSize;
		/** Disables the button. */
		disabled?: boolean;
		type?: string;
		/** `.selected` finish, for toggles and option lists. */
		selected?: boolean;
		onclick?: (e: MouseEvent) => void;
		ariaLabel?: string;
		class?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	}

	// The text size each height reads best at, used until `textsize` says otherwise.
	const TEXT_FOR_SIZE: Record<Size, TextSize> = {
		'h-xs': 'text-xs',
		'h-sm': 'text-xs',
		'h-md': 'text-sm',
		'h-bs': 'text-sm',
		'h-lg': 'text-md',
		'h-xl': 'text-bs'
	};

	let {
		variant = 'primary',
		size = 'h-lg',
		shape = 'modern',
		shadow,
		textsize,
		disabled = false,
		type = 'button',
		selected = false,
		onclick,
		ariaLabel,
		class: className = '',
		children,
		leading,
		trailing
	}: Props = $props();

	const classes = $derived(
		`button gap-sm weight-500 ${variant} ${size} ${shape} ${textsize ?? TEXT_FOR_SIZE[size]}${disabled ? ' disabled' : ''}${selected ? ' selected' : ''} ${className}`
	);
</script>

<button {type} {disabled} onclick={disabled ? undefined : onclick} aria-label={ariaLabel} class={classes} hitbox="self">
	{#if leading}<div class="row ycenter">{@render leading()}</div>{/if}
	{@render children?.()}
	{#if trailing}<div class="row ycenter">{@render trailing()}</div>{/if}
</button>
