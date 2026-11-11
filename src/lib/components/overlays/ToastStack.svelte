<!-- @component A stack of toasts placed in a screen corner or inline. Ported from ../fractalsvelte-ui overlays/ToastStack.svelte — the floating position uses the fork's `<Portal>` (GPUI has no popover layer); inline is a plain stack. -->
<script lang="ts" module>
	import type { MessageText, TextSize } from '../../types.ts';

	export interface ToastItem {
		id: string;
		title?: string;
		description?: string;
		messageText?: MessageText;
		duration?: number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Portal from 'gpuix-fractalsvelte/components/Portal.svelte';
	import Toast from '../core/Toast.svelte';

	export type ToastPosition = 'top-left' | 'inline';

	interface Props {
		position?: ToastPosition;
		toasts?: ToastItem[];
		textsize?: TextSize;
		class?: string;
		ondismiss?: (id: string) => void;
		children?: Snippet;
	}

	let {
		position = 'top-left',
		toasts = $bindable([]),
		textsize = 'text-md',
		class: className = '',
		ondismiss,
		children
	}: Props = $props();

	function remove(id: string) {
		toasts = toasts.filter((t) => t.id !== id);
		ondismiss?.(id);
	}
</script>

{#snippet stack()}
	<div class="box gap-xs {className}" style="pointer-events: auto;">
		{#each toasts as t (t.id)}
			<Toast {...t} onclose={() => remove(t.id)} {textsize} />
		{/each}
		{#if children}{@render children()}{/if}
	</div>
{/snippet}

{#if position === 'top-left'}
	<Portal>
		<div class="absolute" style="top: 16px; left: 16px; width: 360px; pointer-events: none;">
			{@render stack()}
		</div>
	</Portal>
{:else}
	{@render stack()}
{/if}
