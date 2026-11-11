<!-- @component A slide-in navigation panel for small screens. Ported from ../fractalsvelte-ui navigation/MobileNav.svelte — the native modal drawer is our Portal Modal: Escape, backdrop and the page scrim come with it. -->
<script lang="ts">
	import type { TextSize } from '../../types.ts';
	import type { Snippet } from 'svelte';
	import Icon from '../core/Icon.svelte';
	import { klX } from '../../icons/keylinestroke.ts';
	import Modal, { type ModalPlacement } from '../core/Modal.svelte';

	export type MobileNavPosition = 'left' | 'right' | 'top' | 'bottom';

	interface Props {
		open?: boolean;
		position?: MobileNavPosition;
		title?: string;
		closeOnBackdrop?: boolean;
		textsize?: TextSize;
		class?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		position = 'left',
		title = '',
		closeOnBackdrop = true,
		textsize = 'text-md',
		class: className = '',
		header,
		children,
		footer
	}: Props = $props();

	const PLACE: Record<MobileNavPosition, ModalPlacement> = {
		left: 'left',
		right: 'right',
		top: 'top-edge',
		bottom: 'bottom-edge'
	};
</script>

<Modal bind:open placement={PLACE[position]} {closeOnBackdrop} aria-label={title || 'Navigation'} panelClass="{textsize} {className}">
	<div class="row ycenter xbetween gap-md px-md py-sm bb">
		{#if header}
			{@render header()}
		{:else}
			<text class="text-bs weight-600">{title}</text>
		{/if}
		<button
			class="btn-icon inline-flex row xcenter ycenter ghost h-lg mincurved text-muted"
			aria-label="Close navigation"
			onclick={() => (open = false)}
			style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 3px; cursor: pointer;"
		>
			<Icon icon={klX} />
		</button>
	</div>
	<nav class="box gap-xs pad-sm grow" aria-label={title || 'Navigation'}>
		{@render children?.()}
	</nav>
	{#if footer}<div class="box gap-xs pad-sm bt">{@render footer()}</div>{/if}
</Modal>
