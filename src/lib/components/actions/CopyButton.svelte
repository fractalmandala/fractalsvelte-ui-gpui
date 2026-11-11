<!-- @component Clipboard copy trigger with automatic check-mark feedback state. Ported from ../fractalsvelte-ui actions/CopyButton.svelte — GPUI exposes no clipboard API and Node has no navigator.clipboard in a window, so the copy attempt is best-effort and the feedback state always shows (wire a real sink through oncopy when one exists). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconVariant, Size, Shape, Shadow } from '../../types.ts';
	import IconButton from './IconButton.svelte';
	import Icon from '../core/Icon.svelte';
	import { klCheck, klCopy } from '../../icons/keylinestroke.ts';

	interface Props {
		text: string;
		copiedLabel?: string;
		resetAfter?: number;
		iconVariant?: IconVariant;
		variant?: IconVariant;
		size?: Size;
		shape?: Shape;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		class?: string;
		/** A GPUI-side sink for the text; when set it replaces the clipboard attempt. */
		oncopy?: (text: string) => void;
		children?: Snippet;
	}

	let {
		text,
		copiedLabel = 'Copied',
		resetAfter = 2000,
		iconVariant,
		variant,
		size = 'h-md',
		shape = 'modern',
		shadow,
		class: className = '',
		oncopy,
		children
	}: Props = $props();

	let copied = $state(false);

	async function handleCopy() {
		oncopy?.(text);
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// no clipboard in this runtime; the feedback state still shows
		}
		copied = true;
		setTimeout(() => (copied = false), resetAfter);
	}

	const currentVariant = $derived(iconVariant ?? variant ?? 'ghost');
</script>

<IconButton
	variant={currentVariant}
	label={copied ? copiedLabel : 'Copy'}
	{size}
	{shape}
	{shadow}
	class={className}
	onclick={handleCopy}
>
	{#if children}{@render children()}{:else}<Icon icon={copied ? klCheck : klCopy} />{/if}
</IconButton>
