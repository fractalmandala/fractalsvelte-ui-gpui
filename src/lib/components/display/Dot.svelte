<!-- @component A compact status dot indicator with optional pulsing animation and status variants. Ported from ../fractalsvelte-ui display/Dot.svelte — the ping and the dot are one svg source string (GPUI's svg takes raw markup, and the colour is the inherited text colour). -->
<script lang="ts">
	import type { Variant, Message } from '../../types.ts';

	export type DotSize = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant | Message;
		size?: DotSize;
		/** Whether the dot pulsates with an animated outer ping ring */
		animated?: boolean;
	}

	let { variant = 'primary', size = 'md', animated = false }: Props = $props();

	const PX: Record<DotSize, number> = { sm: 6, md: 8, lg: 12 };
	// The dot is drawn in currentColor, so its colour is a text class.
	const INK: Record<string, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		themed: 'text-theme',
		outline: 'text-primary',
		ghost: 'text-muted',
		link: 'text-info',
		info: 'text-info',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger'
	};

	const px = $derived(PX[size]);

	const source = $derived.by(() => {
		const ping = animated
			? `<circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.6"><animate attributeName="r" values="6;12" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" /></circle>`
			: '';
		const dot =
			variant === 'outline'
				? `<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2" />`
				: `<circle cx="12" cy="12" r="6" fill="currentColor" />`;
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${ping}${dot}</svg>`;
	});
</script>

<svg {source} aria-hidden="true" class="shrink-0 {INK[variant] ?? 'text-primary'}" style="width: {px * 2}px; height: {px * 2}px;" />
