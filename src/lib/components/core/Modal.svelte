<!-- @component The modal shell shared by Dialog, Drawer and CommandPalette. Ported from ../fractalsvelte-ui core/Modal.svelte — GPUI has no `<dialog>`, so the shell is the fork's `<Portal>` layer: a scrim that blocks the page, the panel on top of it, and Escape through on_window_key. -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Portal from 'gpuix-fractalsvelte/components/Portal.svelte';
	import { on_window_key } from 'gpuix-fractalsvelte';
	import type { Surface, Border, Shadow, Shape } from '../../types.ts';

	/** Where the panel sits inside the window-sized layer. */
	export type ModalPlacement = 'center' | 'top' | 'left' | 'right' | 'top-edge' | 'bottom-edge';

	interface Props {
		open?: boolean;
		placement?: ModalPlacement;
		/** Clicking the scrim closes */
		closeOnBackdrop?: boolean;
		/** Escape closes */
		closeOnEscape?: boolean;
		/** Called when Escape is pressed but closeOnEscape is false */
		onescape?: () => void;
		onclose?: () => void;
		/** Panel look, as on Card */
		surface?: Surface;
		border?: Border;
		/** Unportable in GPUI (no box-shadow); accepted and ignored. */
		shadow?: Shadow;
		shape?: Shape;
		/** Classes for the visible panel */
		panelClass?: string;
		/** Panel width in px */
		width?: number;
		children?: Snippet;
	}

	let {
		open = false,
		placement = 'center',
		closeOnBackdrop = true,
		closeOnEscape = true,
		onescape,
		onclose,
		panelClass = '',
		width,
		surface = 'bg-overlay',
		border = 'border',
		shadow,
		shape = 'curved',
		children
	}: Props = $props();

	const close = () => {
		if (open) {
			open = false;
			onclose?.();
		}
	};

	$effect(() => {
		if (!open) return;
		return on_window_key('keydown', (e) => {
			if (e.key !== 'escape') return;
			if (closeOnEscape) close();
			else onescape?.();
		});
	});

	// Each placement carries its own alignment modifiers.
	const ALIGN: Record<ModalPlacement, string> = {
		center: 'row xcenter ycenter',
		top: 'row xcenter ytop pt-3xl',
		left: 'row ycenter xleft',
		right: 'row ycenter xright',
		'top-edge': 'box ytop',
		'bottom-edge': 'box ybot'
	};
	// A side drawer spans the window's height; centre/top panels hug their width.
	const PANEL_SIZE: Record<ModalPlacement, string> = {
		center: '',
		top: '',
		left: 'height: 100%;',
		right: 'height: 100%;',
		'top-edge': 'width: 100%;',
		'bottom-edge': 'width: 100%;'
	};
</script>

{#if open}
	<Portal>
		<div
			class="full {ALIGN[placement]}"
			style="background-color: rgba(0, 0, 0, 0.45);"
			onclick={closeOnBackdrop ? close : undefined}
		>
			<div
				class="box text-primary {surface} {border} {shadow} {shape} {panelClass}"
				style="max-width: 100%; max-height: 100%; background-color: var(--bg-overlay); {PANEL_SIZE[placement]}{width !== undefined ? `width: ${width}px;` : ''}"
			>
				{@render children?.()}
			</div>
		</div>
	</Portal>
{/if}
