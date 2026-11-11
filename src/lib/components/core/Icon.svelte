<!-- @component An SVG icon from the keyline packs, sized in pixels or by a size token. Ported from ../fractalsvelte-ui core/Icon.svelte — GPUI's `<svg>` takes raw markup through `source`, is sized by its style width/height, and resolves the inherited text colour for currentColor. -->
<script lang="ts">
	import type { IconNode } from '../../icons/types.ts';

	interface Props {
		/** An icon from `$lib/icons/keylinestroke` (kl*) or `$lib/icons/keylinefill` (klf*). */
		icon: IconNode;
		size?: number | string;
		/** Accessible name. Without it the icon is decorative. */
		label?: string;
		/** Overrides the icon's stroke width (the stroke pack draws at 2). */
		strokeWidth?: number;
	}

	let { icon, size = 18, label, strokeWidth }: Props = $props();

	const sizePx = $derived.by(() => {
		if (typeof size === 'number') return size;
		if (typeof size === 'string') {
			const map: Record<string, number> = {
				'h-xs': 14,
				'h-sm': 16,
				'h-md': 18,
				'h-bs': 20,
				'h-lg': 24,
				'h-xl': 28
			};
			if (map[size]) return map[size];
			const parsed = parseFloat(size);
			if (!isNaN(parsed) && String(parsed) === size) return parsed;
		}
		return 18;
	});

	// The packs store paint attributes (stroke, fill, linecaps) on a wrapping `g`
	// that the shapes inherit. GPUI's svg parser does not resolve group
	// inheritance, so the serializer hoists the group's attributes onto each
	// shape before emitting the source string.
	const source = $derived.by(() => {
		const nodes = Array.isArray(icon) ? [...icon] : [];
		let carried: Record<string, string | number> = {};
		const body: string[] = [];
		for (const [tag, attrs] of nodes) {
			const own = Object.fromEntries(
				Object.entries(attrs ?? {})
					.filter(([k]) => k !== 'key')
					.map(([k, v]) => [k, k === 'stroke-width' && strokeWidth ? strokeWidth : v])
			);
			if (tag === 'g') {
				carried = { ...carried, ...own };
				continue;
			}
			const merged = { ...carried, ...own };
			if (Object.keys(merged).length === 0) {
				body.push(`<${tag} />`);
			} else {
				const a = Object.entries(merged)
					.map(([k, v]) => `${k}="${v}"`)
					.join(' ');
				body.push(`<${tag} ${a} />`);
			}
		}
		return `<svg viewBox="0 0 24 24">${body.join('')}</svg>`;
	});
</script>

<svg {source} role={label ? 'img' : undefined} aria-label={label} style="width: {sizePx}px; height: {sizePx}px;" />
