<!-- @component A centred wrapper that caps content at a maximum width. Ported from ../fractalsvelte-ui layout/Container.svelte — `auto` margins cannot centre in GPUI, so the clamped canonical measures (the widest breakpoint row) are fixed-width boxes centred by a flex parent's justify-content. -->
<script lang="ts" module>
	export type ContainerSize = 'half' | 'wide' | 'full' | 'fluid' | 'prose';
	/** GPUI has no responsive measures: the widest canonical row (>=1281px). */
	const WIDTH: Record<ContainerSize, string> = {
		half: '800px',
		wide: '1024px',
		full: '680px',
		fluid: '100%',
		prose: '680px'
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: ContainerSize;
		class?: string;
		children?: Snippet;
	}

	let { size = 'wide', class: className = '', children }: Props = $props();
</script>

<div class="row xcenter wfull">
	<div class="{className}" style="width: {WIDTH[size]}; max-width: 100%; display: flex; flex-direction: column;">
		{@render children?.()}
	</div>
</div>
