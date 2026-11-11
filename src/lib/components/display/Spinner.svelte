<!-- @component A spinning loading indicator sized to the surrounding text. Ported from ../fractalsvelte-ui display/Spinner.svelte — the rotation is SMIL inside the svg source, so no keyframes are needed, and the ink is the inherited text colour. -->
<script lang="ts">
	import type { MessageText, TextSize } from '../../types.ts';

	interface Props {
		/** Rides the type scale: the spinner is 1em of this text size. Omit to follow the parent. */
		size?: TextSize;
		/** Ink of the arc. Omit to follow the parent's colour. */
		tone?: MessageText;
		/** Seconds per revolution. */
		duration?: number;
		label?: string;
		class?: string;
	}

	let { size, tone, duration = 0.8, label = 'Loading', class: className = '' }: Props = $props();

	// The canonical spinner sizes to 1em of the text size; GPUI has no em, so the
	// px size of the type scale stands in.
	const PX: Record<string, number> = {
		'text-xs': 10.72, 'text-sm': 12, 'text-md': 14.4, 'text-bs': 16, 'text-lg': 22.4,
		'text-xl': 28.16, 'text-2xl': 35.2, 'text-3xl': 44, 'text-4xl': 55.04, 'text-5xl': 68.8
	};
	const px = $derived((size && PX[size]) || 14.4);

	const source = $derived(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">` +
			`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.2" />` +
			`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="56.5" stroke-dashoffset="42">` +
			`<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="${duration}s" repeatCount="indefinite" />` +
			`</circle></svg>`
	);
</script>

<svg {source} role="status" aria-label={label} class="shrink-0 {tone ?? ''} {className}" style="width: {px}px; height: {px}px;" />
