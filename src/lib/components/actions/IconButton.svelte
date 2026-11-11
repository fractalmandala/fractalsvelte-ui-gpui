<!-- @component A square button holding only an icon, named for screen readers by `label`. Ported from ../fractalsvelte-ui actions/IconButton.svelte — no href form. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Variant, Size, Shape, Shadow } from '../../types.ts';

	interface Props {
		/** Accessible name. */
		label: string;
		/** Visual style variant for icon button. */
		iconVariant?: Variant;
		/** Alias for iconVariant */
		variant?: Variant;
		/** Alias for iconVariant */
		icon?: Variant;
		size?: Size;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		/** Shows the button as busy and makes it inert. */
		loading?: boolean;
		disabled?: boolean | null;
		onclick?: (e: MouseEvent) => void;
		ariaPressed?: boolean;
		testid?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		iconVariant,
		variant,
		icon,
		size = 'h-md',
		shape = 'rect',
		shadow,
		loading = false,
		disabled = false,
		onclick,
		ariaPressed,
		testid,
		class: className = '',
		children
	}: Props = $props();

	const inert = $derived(Boolean(disabled || loading));
	const currentVariant = $derived(iconVariant ?? variant ?? icon ?? 'primary');
</script>

<button
	testid={testid}
	class="btn-icon {currentVariant} {size} {shape} {disabled || loading ? 'disabled' : ''} {className}"
	aria-label={label}
	aria-busy={loading || undefined}
	aria-pressed={ariaPressed}
	disabled={inert}
	onclick={inert ? undefined : onclick}
	hitbox="self"
>
	{@render children?.()}
</button>
