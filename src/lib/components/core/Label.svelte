<!-- @component An accessible form label with required indicator and optional description text. Ported from ../fractalsvelte-ui core/Label.svelte — GPUI has no `<label>`, so `for` targets nothing and is accepted for source compatibility. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TextSize } from '../../types.ts';

	interface Props {
		for?: string;
		/** Show a required asterisk indicator */
		required?: boolean;
		/** Optional descriptive helper text placed below the label */
		description?: string;
		textsize?: TextSize;
		class?: string;
		children?: Snippet;
	}

	let { for: htmlFor, required = false, description, textsize = 'text-md', class: className = '', children }: Props = $props();
</script>

<div class="box gap-xs wmax pointer weight-500 {textsize} {className}">
	<div class="row ycenter gap-xs text-primary">
		{@render children?.()}
		{#if required}
			<text class="text-danger weight-700" aria-hidden="true">*</text>
		{/if}
	</div>
	{#if description}
		<text class="text-xs text-secondary weight-400">{description}</text>
	{/if}
</div>
